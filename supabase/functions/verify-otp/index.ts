// Supabase Edge Function to verify OTP and sign up/in a user with phone number
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

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
    const { phoneNumber, otp, password } = await req.json();
    
    if (!phoneNumber || !otp) {
      return new Response(JSON.stringify({ error: 'Phone number and OTP are required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (!password) {
      return new Response(JSON.stringify({ error: 'Password is required' }), {
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

    // Get the stored OTP
    const { data: otpData, error: otpError } = await supabaseAdmin
      .from('phone_auth_codes')
      .select('*')
      .eq('phone_number', phoneNumber)
      .single();

    if (otpError || !otpData) {
      console.error('Error retrieving OTP:', otpError);
      return new Response(JSON.stringify({ error: 'No verification code found for this phone number' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Check if OTP is expired
    const expiresAt = new Date(otpData.expires_at);
    if (expiresAt < new Date()) {
      return new Response(JSON.stringify({ error: 'Verification code expired. Please request a new one.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Check if OTP matches
    if (otpData.code !== otp) {
      return new Response(JSON.stringify({ error: 'Invalid verification code' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Check if OTP has already been verified
    if (otpData.verified) {
      return new Response(JSON.stringify({ error: 'This verification code has already been used' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Mark OTP as verified
    const { error: updateError } = await supabaseAdmin
      .from('phone_auth_codes')
      .update({ verified: true })
      .eq('phone_number', phoneNumber);

    if (updateError) {
      console.error('Error updating OTP status:', updateError);
      return new Response(JSON.stringify({ error: 'Error updating verification status' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Check if a user with this phone number already exists
    // We'll check against a custom phone_number field in the profiles table
    const { data: existingUsers, error: userQueryError } = await supabaseAdmin
      .from('profiles')
      .select('id')
      .eq('phone_number', phoneNumber);

    if (userQueryError) {
      console.error('Error checking existing user:', userQueryError);
      return new Response(JSON.stringify({ error: 'Error checking user status' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    let userId;
    let isNewUser = false;

    if (!existingUsers || existingUsers.length === 0) {
      // Create a new user with email derived from phone number
      const email = `${phoneNumber}@phone.arazial.com`;
      
      const { data: authData, error: signUpError } = await supabaseAdmin.auth.admin.createUser({
        email,
        phone: phoneNumber,
        password,
        email_confirm: true, // Auto-confirm the email
        phone_confirm: true, // Auto-confirm the phone
        user_metadata: {
          phone_number: phoneNumber,
          registration_method: 'phone_otp'
        }
      });

      if (signUpError) {
        console.error('Error creating user:', signUpError);
        return new Response(JSON.stringify({ error: 'Error creating user account' }), {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      userId = authData.user.id;
      isNewUser = true;

      // Create a profile for the new user
      const { error: profileError } = await supabaseAdmin
        .from('profiles')
        .insert({
          id: userId,
          phone_number: phoneNumber,
        });

      if (profileError) {
        console.error('Error creating profile:', profileError);
        // Don't return error here, still proceed with login
      }
    } else {
      // User exists, find their user ID
      userId = existingUsers[0].id;
      
      // Get user by id
      const { data: user, error: userError } = await supabaseAdmin.auth.admin.getUserById(userId);
      
      if (userError) {
        console.error('Error getting user:', userError);
        return new Response(JSON.stringify({ error: 'Error retrieving user' }), {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        });
      }
      
      // Update password if provided
      const { error: updateUserError } = await supabaseAdmin.auth.admin.updateUserById(
        userId,
        { password }
      );
      
      if (updateUserError) {
        console.error('Error updating user password:', updateUserError);
        return new Response(JSON.stringify({ error: 'Error updating password' }), {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        });
      }
    }

    // Generate a sign in link for automatic login
    const { data: signInData, error: signInError } = await supabaseAdmin.auth.admin.generateLink({
      type: 'magiclink',
      email: `${phoneNumber}@phone.arazial.com`,
    });

    if (signInError) {
      console.error('Error generating sign in link:', signInError);
      return new Response(JSON.stringify({ 
        error: 'Phone verification successful but automatic login failed. Please login manually.' 
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Return success with token and session
    return new Response(JSON.stringify({
      success: true,
      message: isNewUser ? 'Account created and verification successful' : 'Verification successful',
      user: {
        id: userId,
        phone_number: phoneNumber,
        is_new_user: isNewUser
      },
      session: signInData
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
    
  } catch (error) {
    console.error('Error verifying OTP:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}) 