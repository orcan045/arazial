# Phone Verification with Verimor SMS API

This documentation explains how to set up and use the phone verification system with Verimor SMS API.

## Overview

The system consists of two Supabase Edge Functions:
1. `send-otp`: Sends a verification code via SMS
2. `verify-otp`: Verifies the code and creates/signs in the user

## Database Setup

Run the SQL migration to create the necessary tables:
```sql
-- From migrations/20240401_add_phone_auth_codes.sql
```

## Environment Variables

You need to configure the following environment variables in the Supabase dashboard:

1. Go to your Supabase project dashboard
2. Navigate to Settings > API > Edge Functions
3. Add the following secrets:
   - `VERIMOR_USERNAME`: Your Verimor account phone number (e.g., 905XXXXXXXX)
   - `VERIMOR_PASSWORD`: Your Verimor API password
   - `VERIMOR_SOURCE_ADDR`: Your SMS sender ID/header (e.g., ARAZIAL)

## Deploying Edge Functions

1. Install Supabase CLI if you haven't already:
   ```
   npm install -g supabase
   ```

2. Login to Supabase:
   ```
   supabase login
   ```

3. Link your project:
   ```
   supabase link --project-ref <your-project-id>
   ```

4. Deploy the functions:
   ```
   supabase functions deploy send-otp
   supabase functions deploy verify-otp
   ```

## Testing the Functions

You can test the functions with the following curl commands:

```bash
# Send OTP
curl -X POST https://<your-project-id>.supabase.co/functions/v1/send-otp \
  -H "Content-Type: application/json" \
  -d '{"phoneNumber":"905XXXXXXXXX"}'

# Verify OTP
curl -X POST https://<your-project-id>.supabase.co/functions/v1/verify-otp \
  -H "Content-Type: application/json" \
  -d '{"phoneNumber":"905XXXXXXXXX", "otp":"123456", "password":"secure_password"}'
```

## Integration with Web App

The web app already has the necessary components to work with these functions. Make sure to:

1. Configure the appropriate environment variables in your web app:
   ```
   REACT_APP_SUPABASE_URL=https://<your-project-id>.supabase.co
   ```

2. The `PhoneSignup` component will use these environment variables to call the edge functions. 