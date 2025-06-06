import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    )

    // Get request body
    const { phoneNumber, message, type } = await req.json()

    // Validate required fields
    if (!phoneNumber || !message) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Phone number and message are required' 
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    console.log(`[SMS] Sending ${type || 'notification'} to ${phoneNumber}`)

    // Prepare Verimor API request
    const verimorUrl = 'https://sms.verimor.com.tr/v2/send.json'
    const verimorUsername = Deno.env.get('VERIMOR_USERNAME')
    const verimorPassword = Deno.env.get('VERIMOR_PASSWORD')
    const verimorSource = Deno.env.get('VERIMOR_SOURCE') || 'ARAZIALCOM'

    if (!verimorUsername || !verimorPassword) {
      console.error('[SMS] Verimor credentials not configured')
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'SMS service not configured' 
        }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Format phone number for Verimor (ensure it starts with 90)
    let formattedPhone = phoneNumber.replace(/\D/g, '') // Remove non-digits
    if (formattedPhone.startsWith('0')) {
      formattedPhone = '90' + formattedPhone.slice(1)
    } else if (!formattedPhone.startsWith('90')) {
      formattedPhone = '90' + formattedPhone
    }

    // Prepare Verimor request payload
    const verimorPayload = {
      username: verimorUsername,
      password: verimorPassword,
      source_addr: verimorSource,
      messages: [
        {
          msg: message,
          dest: formattedPhone
        }
      ]
    }

    console.log(`[SMS] Sending to Verimor API: ${formattedPhone}`)

    // Send SMS via Verimor API
    const verimorResponse = await fetch(verimorUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(verimorPayload)
    })

    const verimorResult = await verimorResponse.json()

    console.log('[SMS] Verimor response:', verimorResult)

    // Check if the SMS was sent successfully
    if (verimorResponse.ok && verimorResult.status === 'success') {
      console.log(`[SMS] Successfully sent ${type || 'notification'} to ${formattedPhone}`)
      
      // Optionally log the SMS to database for tracking
      try {
        await supabaseClient
          .from('sms_logs')
          .insert({
            phone_number: formattedPhone,
            message: message,
            type: type || 'notification',
            status: 'sent',
            verimor_response: verimorResult,
            sent_at: new Date().toISOString()
          })
      } catch (logError) {
        console.error('[SMS] Failed to log SMS:', logError)
        // Don't fail the request if logging fails
      }

      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'SMS sent successfully',
          messageId: verimorResult.message_id
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    } else {
      console.error('[SMS] Verimor error:', verimorResult)
      
      // Log failed SMS attempt
      try {
        await supabaseClient
          .from('sms_logs')
          .insert({
            phone_number: formattedPhone,
            message: message,
            type: type || 'notification',
            status: 'failed',
            verimor_response: verimorResult,
            error: verimorResult.error || 'Unknown error',
            sent_at: new Date().toISOString()
          })
      } catch (logError) {
        console.error('[SMS] Failed to log failed SMS:', logError)
      }

      return new Response(
        JSON.stringify({ 
          success: false, 
          error: verimorResult.error || 'Failed to send SMS' 
        }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

  } catch (error) {
    console.error('[SMS] Exception:', error)
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: 'Internal server error' 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})