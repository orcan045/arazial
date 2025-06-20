-- migration:20240425000003
-- Create a function to check if a column exists in a table
CREATE OR REPLACE FUNCTION public.check_column_exists(table_name text, column_name text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    column_exists boolean;
BEGIN
    SELECT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_schema = 'public'
        AND table_name = check_column_exists.table_name
        AND column_name = check_column_exists.column_name
    ) INTO column_exists;
    
    RETURN column_exists;
END;
$$;

-- Grant execute privileges on function
GRANT EXECUTE ON FUNCTION public.check_column_exists TO authenticated;
GRANT EXECUTE ON FUNCTION public.check_column_exists TO anon;