-- Create a function to update profile on login
CREATE OR REPLACE FUNCTION public.handle_auth_sign_in() 
RETURNS TRIGGER AS $$
BEGIN
  -- First ensure profile exists
  INSERT INTO public.profiles (
    id, 
    full_name,
    email,
    phone_number,
    created_at, 
    updated_at,
    role
  ) 
  VALUES (
    new.id, 
    COALESCE((SELECT full_name FROM public.profiles WHERE id = new.id), COALESCE(new.raw_user_meta_data->>'full_name', '')),
    new.email,
    new.phone,
    COALESCE((SELECT created_at FROM public.profiles WHERE id = new.id), new.created_at),
    now(),
    COALESCE((SELECT role FROM public.profiles WHERE id = new.id), 'user')
  )
  ON CONFLICT (id) DO UPDATE
  SET 
    email = EXCLUDED.email,
    phone_number = EXCLUDED.phone,
    updated_at = EXCLUDED.updated_at;
    
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Check if trigger exists and drop it if it does
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'on_auth_sign_in') THEN
    DROP TRIGGER IF EXISTS on_auth_sign_in ON auth.users;
  END IF;
END $$;

-- Create the trigger on the auth.users table
-- This will trigger whenever a user signs in (which updates last_sign_in_at)
CREATE TRIGGER on_auth_sign_in
AFTER UPDATE OF last_sign_in_at ON auth.users
FOR EACH ROW 
WHEN (OLD.last_sign_in_at IS DISTINCT FROM NEW.last_sign_in_at)
EXECUTE PROCEDURE public.handle_auth_sign_in();

-- Add a comment explaining the trigger
COMMENT ON TRIGGER on_auth_sign_in ON auth.users IS 'Updates profile data from auth data on each sign in';

-- For debugging: Test if this update would work
SELECT id, email, phone FROM auth.users 
WHERE last_sign_in_at IS NOT NULL 
ORDER BY last_sign_in_at DESC 
LIMIT 5; 