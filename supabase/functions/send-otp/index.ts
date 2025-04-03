// Supabase Edge Function to send OTP via Verimor SMS API
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

// Function to generate a random 6-digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

serve(async (req) => {
  try {
    // CORS headers for preflight requests
    if (req.method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
      });
    }

    // Only allow POST requests
    if (req.method !== 'POST') {
      return new Response(JSON.stringify({ error: 'Method not allowed' }), {
        status: 405,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Get request body
    const { phoneNumber } = await req.json();
    
    if (!phoneNumber) {
      return new Response(JSON.stringify({ error: 'Phone number is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    
    // Validate phone number format (should be like 905311234567)
    const phoneRegex = /^90[5][0-9]{9}$/;
    if (!phoneRegex.test(phoneNumber)) {
      return new Response(JSON.stringify({ 
        error: 'Invalid phone number format. Must start with 90 followed by 5 and 9 more digits' 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Initialize Supabase client with admin privileges
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    );

    // Generate OTP
    const otp = generateOTP();
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 10); // OTP valid for 10 minutes

    // Store OTP in Supabase
    const { error: upsertError } = await supabaseAdmin
      .from('phone_auth_codes')
      .upsert({
        phone_number: phoneNumber,
        code: otp,
        expires_at: expiresAt.toISOString(),
        verified: false,
      }, {
        onConflict: 'phone_number'
      });

    if (upsertError) {
      console.error('Error saving OTP:', upsertError);
      return new Response(JSON.stringify({ error: 'Error saving OTP' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Prepare SMS message
    const message = `Arazial doğrulama kodunuz: ${otp}. Bu kod 10 dakika geçerlidir.`;

    // Get Verimor credentials from environment variables
    const verimorUsername = Deno.env.get('VERIMOR_USERNAME');
    const verimorPassword = Deno.env.get('VERIMOR_PASSWORD');
    const verimorSourceAddr = Deno.env.get('VERIMOR_SOURCE_ADDR') || 'ARAZIAL';

    if (!verimorUsername || !verimorPassword) {
      console.error('Missing Verimor credentials');
      return new Response(JSON.stringify({ error: 'SMS service configuration error' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Send SMS via Verimor API
    const verimorResponse = await fetch('https://sms.verimor.com.tr/v2/send.json', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: verimorUsername,
        password: verimorPassword,
        source_addr: verimorSourceAddr,
        messages: [
          {
            msg: message,
            dest: phoneNumber,
          }
        ]
      })
    });

    const verimorData = await verimorResponse.text();
    
    if (!verimorResponse.ok) {
      console.error('Verimor API error:', verimorData);
      return new Response(JSON.stringify({ error: `SMS sending failed: ${verimorData}` }), {
        status: verimorResponse.status,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Return success
    return new Response(JSON.stringify({ 
      success: true, 
      message: 'OTP sent successfully',
      campaignId: verimorData
    }), {
      status: 200,
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
    
  } catch (error) {
    console.error('Error sending OTP:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}) 