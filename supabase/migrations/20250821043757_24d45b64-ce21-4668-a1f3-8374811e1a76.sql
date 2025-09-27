-- Ensure the two allowed users are recognized as admins via profiles so RLS permits inserts/updates
-- 1) Elevate existing profiles for the two emails to super_admin
UPDATE public.profiles p
SET role = 'super_admin'::user_role, updated_at = now()
FROM auth.users u
WHERE p.user_id = u.id
  AND u.email IN ('championschool38@gmail.com', 'bhaskaradhikari2061@gmail.com');

-- 2) Insert profiles for these users if missing
INSERT INTO public.profiles (user_id, full_name, role)
SELECT u.id,
       COALESCE(u.raw_user_meta_data->>'full_name', split_part(u.email, '@', 1)) AS full_name,
       'super_admin'::user_role
FROM auth.users u
LEFT JOIN public.profiles p ON p.user_id = u.id
WHERE u.email IN ('championschool38@gmail.com', 'bhaskaradhikari2061@gmail.com')
  AND p.user_id IS NULL;

-- 3) (Optional safety) Allow users to insert their own profile if we later need it
-- Create INSERT policy only if it doesn't already exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'profiles' AND policyname = 'Users can insert their own profile'
  ) THEN
    CREATE POLICY "Users can insert their own profile"
    ON public.profiles
    FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;
