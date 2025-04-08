// vallet-proxy-server/server.js
require('dotenv').config();
const express = require('express');
const axios = require('axios');
const crypto = require('crypto');
const cors = require('cors');
const https = require('https'); // Import the 'https' module
const fs = require('fs'); // Import the 'fs' module for file reading
const { URLSearchParams } = require('url');

const app = express();

// --- Configuration ---
const httpsPort = 443; // Standard HTTPS port
const valletApiUrl = 'https://www.vallet.com.tr/api/v1/create-payment-link';

// Certificate paths
const sslKeyPath = '/etc/letsencrypt/live/srv759491.hstgr.cloud/privkey.pem';
const sslCertPath = '/etc/letsencrypt/live/srv759491.hstgr.cloud/fullchain.pem';

// Read SSL files
let sslOptions = {};
try {
  sslOptions = {
    key: fs.readFileSync(sslKeyPath),
    cert: fs.readFileSync(sslCertPath)
  };
  console.log("SSL certificate and key loaded successfully.");
} catch (error) {
  console.error("FATAL ERROR: Could not read SSL certificate/key files.", error);
  console.error(`Ensure the files exist and the user running this script has read permissions:\n  Key: ${sslKeyPath}\n  Cert: ${sslCertPath}`);
  process.exit(1);
}

// Vallet Credentials from environment variables
const userName = process.env.API_USER;
const password = process.env.API_KEY;
const shopCode = process.env.MERCHANT_CODE;
const hashKey = process.env.MERCHANT_KEY;
const frontendUrl = process.env.FRONTEND_URL;

// Validation using the new names
if (!userName || !password || !shopCode || !hashKey || !frontendUrl) {
  console.error("FATAL ERROR: Vallet API credentials (API_USER, API_KEY, MERCHANT_CODE, MERCHANT_KEY) or FRONTEND_URL missing or incomplete in .env file.");
  process.exit(1);
}

// --- Middleware ---
app.use(cors({
  origin: frontendUrl // Allow requests only from your frontend URL
}));
app.use(express.json()); // Parse JSON request bodies (still needed for incoming request from frontend)

// --- Helper Function: Generate Vallet Hash ---
function generateValletHash(data) {
  const stringToHash =
    data.orderId +
    data.currency +
    data.orderPrice +
    data.productsTotalPrice +
    data.productType +
    data.callbackOkUrl +
    data.callbackFailUrl;

  const hashString = userName + password + shopCode + stringToHash + hashKey;
  const sha1Hash = crypto.createHash('sha1').update(hashString).digest('hex');
  const packedHash = Buffer.from(sha1Hash, 'hex');
  const base64Hash = packedHash.toString('base64');

  // console.log("--- Hash Calculation ---"); // Reduce log noise
  // console.log("Using userName:", userName);
  // console.log("Using shopCode:", shopCode);
  // console.log("String before hashKey:", userName + password + shopCode + stringToHash);
  // console.log("Complete String to SHA1:", hashString);
  // console.log("SHA1 (hex):", sha1Hash);
  // console.log("Base64 Encoded Hash:", base64Hash);
  // console.log("------------------------");

  return base64Hash;
}

// Create an https agent that forces IPv4 for outgoing requests
const httpsAgentOutgoing = new https.Agent({ family: 4 });

// --- API Endpoint: Create Payment Link ---
app.post('/api/payment/create', async (req, res) => {
  console.log(`Received payment request on ${new Date().toISOString()}:`, req.body);
  const requestData = req.body;

  // --- Prepare Data for Vallet API ---
  const valletPayload = {
    userName: userName,
    password: password,
    shopCode: shopCode,
    productName: requestData.productName,
    productData: requestData.productData,
    productType: requestData.productType,
    productsTotalPrice: requestData.productsTotalPrice.toString(),
    orderPrice: requestData.orderPrice.toString(),
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
  valletPayload.hash = generateValletHash(hashDataForCalc);

  // --- Call Vallet API ---
  try {
    const formUrlEncodedPayload = new URLSearchParams(valletPayload).toString();
    console.log("Sending data to Vallet (using IPv4, form-urlencoded)...");

    const response = await axios.post(valletApiUrl, formUrlEncodedPayload, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Referer': frontendUrl // Vallet requires this
      },
      httpsAgent: httpsAgentOutgoing // Force IPv4 for the outgoing call
    });

    console.log("Vallet API Response Status:", response.status);
    console.log("Vallet API Response Data:", response.data);

    // --- Send Response to Frontend ---
    if (response.data && response.data.status === 'success' && response.data.payment_page_url) {
       res.status(200).json({
         status: 'success',
         payment_page_url: response.data.payment_page_url
       });
    } else {
       let errorMessage = 'Vallet API returned an error or unexpected response.';
       let errorDetails = response.data;
       if (typeof response.data === 'object' && response.data !== null && response.data.errorMessage) {
           errorMessage = response.data.errorMessage;
       } else if (typeof response.data === 'string') {
           try {
               const jsonPart1 = response.data.substring(0, response.data.indexOf('}{') + 1);
               const jsonPart2 = response.data.substring(response.data.indexOf('}{') + 1);
               const errorObj1 = JSON.parse(jsonPart1);
               const errorObj2 = JSON.parse(jsonPart2);
               errorMessage = `${errorObj1.errorMessage} / ${errorObj2.errorMessage}`;
           } catch(parseError) {
               errorMessage = response.data;
           }
       }

       console.warn("Sending error response to frontend:", { status: 'error', errorMessage, details: errorDetails });
       res.status(400).json({
         status: 'error',
         errorMessage: errorMessage,
         details: errorDetails
       });
    }

  } catch (error) {
    console.error("Error calling Vallet API:");
    if (error.response) {
        console.error("Status:", error.response.status);
        console.error("Headers:", error.response.headers);
        console.error("Data:", error.response.data);
    } else if (error.request) {
        console.error("No response received:", error.request);
    } else {
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

// --- Create HTTPS Server and Start Listening ---
https.createServer(sslOptions, app).listen(httpsPort, () => {
  console.log(`Vallet Proxy Server listening securely on HTTPS port ${httpsPort}`);
  console.log(`Accepting requests from: ${frontendUrl}`);
  console.log(`Vallet API requests will use IPv4 and Content-Type: application/x-www-form-urlencoded.`);
  console.log(`Loaded credentials - API_USER: ${userName ? 'OK' : 'MISSING'}, API_KEY: ${password ? 'OK' : 'MISSING'}, MERCHANT_CODE: ${shopCode ? 'OK' : 'MISSING'}, MERCHANT_KEY: ${hashKey ? 'OK' : 'MISSING'}`);
  console.log(`Using SSL Cert: ${sslCertPath}`);
  console.log(`Using SSL Key: ${sslKeyPath}`);
  // Note: Listening on port 443 typically requires root privileges or special capabilities (e.g., setcap) if not running as root.
}); 