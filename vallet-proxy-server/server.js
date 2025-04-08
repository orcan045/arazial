// vallet-proxy-server/server.js
require('dotenv').config();
const express = require('express');
const axios = require('axios');
const crypto = require('crypto');
const cors = require('cors');
const https = require('https'); // Import the 'https' module
const { URLSearchParams } = require('url'); // Import URLSearchParams

const app = express();

// --- Configuration ---
const port = process.env.PORT || 3001;
const valletApiUrl = 'https://www.vallet.com.tr/api/v1/create-payment-link';

// Updated environment variable names
const userName = process.env.API_USER;         // Changed from VALLET_USERNAME
const password = process.env.API_KEY;         // Changed from VALLET_PASSWORD
const shopCode = process.env.MERCHANT_CODE;   // Changed from VALLET_SHOPCODE
const hashKey = process.env.MERCHANT_KEY;     // Changed from VALLET_HASHKEY
const frontendUrl = process.env.FRONTEND_URL;

// Validation using the new names
if (!userName || !password || !shopCode || !hashKey) {
  console.error("FATAL ERROR: Vallet API credentials (API_USER, API_KEY, MERCHANT_CODE, MERCHANT_KEY) missing or incomplete in .env file.");
  process.exit(1); // Exit if essential credentials aren't set
}

// --- Middleware ---
app.use(cors({
  origin: frontendUrl // Allow requests only from your frontend URL
}));
app.use(express.json()); // Parse JSON request bodies (still needed for incoming request from frontend)

// --- Helper Function: Generate Vallet Hash ---
// Hash calculation uses the same logic, but reads from the correctly named variables
function generateValletHash(data) {
  const stringToHash =
    data.orderId +
    data.currency +
    data.orderPrice +
    data.productsTotalPrice +
    data.productType +
    data.callbackOkUrl +
    data.callbackFailUrl;

  // Using the updated variable names here
  const hashString = userName + password + shopCode + stringToHash + hashKey;
  const sha1Hash = crypto.createHash('sha1').update(hashString).digest('hex');
  const packedHash = Buffer.from(sha1Hash, 'hex');
  const base64Hash = packedHash.toString('base64');

  console.log("--- Hash Calculation ---");
  console.log("Using userName:", userName); // Log the actual values being used
  console.log("Using shopCode:", shopCode);
  console.log("String before hashKey:", userName + password + shopCode + stringToHash);
  console.log("Complete String to SHA1:", hashString);
  console.log("SHA1 (hex):", sha1Hash);
  console.log("Base64 Encoded Hash:", base64Hash);
  console.log("------------------------");

  return base64Hash;
}

// Create an https agent that forces IPv4
const httpsAgent = new https.Agent({ family: 4 });

// --- API Endpoint: Create Payment Link ---
app.post('/api/payment/create', async (req, res) => {
  console.log("Received payment request:", req.body);
  const requestData = req.body;

  // --- Prepare Data for Vallet API ---
  // Using the updated variable names when constructing the payload
  const valletPayload = {
    userName: userName,
    password: password,
    shopCode: shopCode,
    productName: requestData.productName,
    productData: requestData.productData, // Keep as stringified JSON as sent from frontend
    productType: requestData.productType,
    productsTotalPrice: requestData.productsTotalPrice.toString(), // Ensure string for encoding
    orderPrice: requestData.orderPrice.toString(), // Ensure string for encoding
    currency: requestData.currency || 'TRY',
    orderId: requestData.orderId,
    locale: requestData.locale || 'tr',
    buyerName: requestData.buyerName,
    buyerSurName: requestData.buyerSurName,
    buyerGsmNo: requestData.buyerGsmNo,
    buyerIp: requestData.buyerIp,
    buyerMail: requestData.buyerMail,
    callbackOkUrl: requestData.callbackOkUrl,
    callbackFailUrl: requestData.callbackFailUrl,
  };

  // --- Calculate Hash ---
  const hashDataForCalc = {
    orderId: valletPayload.orderId,
    currency: valletPayload.currency,
    orderPrice: valletPayload.orderPrice,
    productsTotalPrice: valletPayload.productsTotalPrice,
    productType: valletPayload.productType,
    callbackOkUrl: valletPayload.callbackOkUrl,
    callbackFailUrl: valletPayload.callbackFailUrl,
  };
  valletPayload.hash = generateValletHash(hashDataForCalc); // Hash function now uses correct variables internally


  // --- Call Vallet API ---
  try {
    // Convert payload to URL-encoded string
    // Important: URLSearchParams automatically handles encoding special characters
    const formUrlEncodedPayload = new URLSearchParams(valletPayload).toString();

    console.log("Sending data to Vallet (using IPv4, form-urlencoded):", formUrlEncodedPayload);

    const response = await axios.post(valletApiUrl, formUrlEncodedPayload, { // Send the encoded string
      headers: {
        // Set Content-Type to x-www-form-urlencoded
        'Content-Type': 'application/x-www-form-urlencoded',
        // Add the Referer header using the frontend URL
        'Referer': frontendUrl
      },
      httpsAgent: httpsAgent // Force IPv4
    });

    console.log("Vallet API Response Status:", response.status);
    console.log("Vallet API Response Data:", response.data);

    // --- Send Response to Frontend ---
    // Assuming Vallet still returns JSON in the response body even when accepting form-urlencoded
    if (response.data && response.data.status === 'success' && response.data.payment_page_url) {
       res.status(200).json({
         status: 'success',
         payment_page_url: response.data.payment_page_url
       });
    } else {
       // Handle potential errors returned by Vallet (check if response.data is JSON or string)
       let errorMessage = 'Vallet API returned an error or unexpected response.';
       let errorDetails = response.data;
       if (typeof response.data === 'object' && response.data !== null && response.data.errorMessage) {
           errorMessage = response.data.errorMessage;
       } else if (typeof response.data === 'string') {
           // Attempt to parse if it looks like the concatenated JSON error string
           try {
               // Extract potential JSON parts (this is fragile)
               const jsonPart1 = response.data.substring(0, response.data.indexOf('}{') + 1);
               const jsonPart2 = response.data.substring(response.data.indexOf('}{') + 1);
               const errorObj1 = JSON.parse(jsonPart1);
               const errorObj2 = JSON.parse(jsonPart2);
               errorMessage = `${errorObj1.errorMessage} / ${errorObj2.errorMessage}`; // Combine messages
           } catch(parseError) {
               // If parsing fails, use the raw string
               errorMessage = response.data;
           }
       }

       res.status(400).json({
         status: 'error',
         errorMessage: errorMessage,
         details: errorDetails
       });
    }

  } catch (error) {
    console.error("Error calling Vallet API:");
    if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error("Status:", error.response.status);
        console.error("Headers:", error.response.headers);
        console.error("Data:", error.response.data);
    } else if (error.request) {
        // The request was made but no response was received
        console.error("No response received:", error.request);
    } else {
        // Something happened in setting up the request that triggered an Error
        console.error('Error Message:', error.message);
    }
    console.error("Config:", error.config);

    res.status(500).json({
      status: 'error',
      errorMessage: 'Failed to communicate with Vallet API.',
      details: error.response ? error.response.data : error.message
    });
  }
});

// --- Start Server ---
app.listen(port, () => {
  console.log(`Vallet Proxy Server listening at http://localhost:${port}`);
  console.log(`Accepting requests from: ${frontendUrl}`);
  console.log(`Vallet API requests will use IPv4 and Content-Type: application/x-www-form-urlencoded.`);
  console.log(`Loaded credentials - API_USER: ${userName ? 'OK' : 'MISSING'}, API_KEY: ${password ? 'OK' : 'MISSING'}, MERCHANT_CODE: ${shopCode ? 'OK' : 'MISSING'}, MERCHANT_KEY: ${hashKey ? 'OK' : 'MISSING'}`);
}); 