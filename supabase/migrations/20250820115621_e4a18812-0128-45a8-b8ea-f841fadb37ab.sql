-- Create enum for user roles
CREATE TYPE public.user_role AS ENUM ('admin', 'super_admin');

-- Create profiles table for admin users
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  full_name TEXT NOT NULL,
  role user_role NOT NULL DEFAULT 'admin',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Create events table
CREATE TABLE public.events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  event_date DATE NOT NULL,
  image_url TEXT,
  created_by UUID REFERENCES auth.users(id) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create notices table
CREATE TABLE public.notices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  is_important BOOLEAN DEFAULT false,
  created_by UUID REFERENCES auth.users(id) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create gallery table
CREATE TABLE public.gallery (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT NOT NULL,
  category TEXT DEFAULT 'general',
  created_by UUID REFERENCES auth.users(id) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create results table
CREATE TABLE public.results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  file_url TEXT NOT NULL,
  result_type TEXT DEFAULT 'exam', -- exam, term, annual
  class_grade TEXT,
  created_by UUID REFERENCES auth.users(id) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create leadership table
CREATE TABLE public.leadership (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  position TEXT NOT NULL, -- Director, Principal, Vice Principal
  message TEXT NOT NULL,
  image_url TEXT,
  display_order INTEGER DEFAULT 1,
  is_active BOOLEAN DEFAULT true,
  created_by UUID REFERENCES auth.users(id) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create contact messages table
CREATE TABLE public.contact_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leadership ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

-- Create function to check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin(user_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.user_id = is_admin.user_id 
    AND role IN ('admin', 'super_admin')
  );
$$;

-- RLS Policies for profiles
CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Super admins can view all profiles" ON public.profiles
  FOR SELECT USING (public.is_admin(auth.uid()));

-- RLS Policies for events (public read, admin write)
CREATE POLICY "Anyone can view events" ON public.events
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage events" ON public.events
  FOR ALL USING (public.is_admin(auth.uid()));

-- RLS Policies for notices (public read, admin write)
CREATE POLICY "Anyone can view notices" ON public.notices
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage notices" ON public.notices
  FOR ALL USING (public.is_admin(auth.uid()));

-- RLS Policies for gallery (public read, admin write)
CREATE POLICY "Anyone can view gallery" ON public.gallery
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage gallery" ON public.gallery
  FOR ALL USING (public.is_admin(auth.uid()));

-- RLS Policies for results (public read, admin write)
CREATE POLICY "Anyone can view results" ON public.results
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage results" ON public.results
  FOR ALL USING (public.is_admin(auth.uid()));

-- RLS Policies for leadership (public read, admin write)
CREATE POLICY "Anyone can view leadership" ON public.leadership
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage leadership" ON public.leadership
  FOR ALL USING (public.is_admin(auth.uid()));

-- RLS Policies for contact messages (public create, admin read)
CREATE POLICY "Anyone can create contact messages" ON public.contact_messages
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can view contact messages" ON public.contact_messages
  FOR SELECT USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can update contact messages" ON public.contact_messages
  FOR UPDATE USING (public.is_admin(auth.uid()));

-- Create storage buckets for file uploads
INSERT INTO storage.buckets (id, name, public) VALUES 
  ('event-images', 'event-images', true),
  ('gallery-images', 'gallery-images', true),
  ('leadership-images', 'leadership-images', true),
  ('results-files', 'results-files', true);

-- Storage policies for event images
CREATE POLICY "Anyone can view event images" ON storage.objects
  FOR SELECT USING (bucket_id = 'event-images');

CREATE POLICY "Admins can upload event images" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'event-images' AND public.is_admin(auth.uid()));

CREATE POLICY "Admins can update event images" ON storage.objects
  FOR UPDATE USING (bucket_id = 'event-images' AND public.is_admin(auth.uid()));

CREATE POLICY "Admins can delete event images" ON storage.objects
  FOR DELETE USING (bucket_id = 'event-images' AND public.is_admin(auth.uid()));

-- Storage policies for gallery images
CREATE POLICY "Anyone can view gallery images" ON storage.objects
  FOR SELECT USING (bucket_id = 'gallery-images');

CREATE POLICY "Admins can upload gallery images" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'gallery-images' AND public.is_admin(auth.uid()));

CREATE POLICY "Admins can update gallery images" ON storage.objects
  FOR UPDATE USING (bucket_id = 'gallery-images' AND public.is_admin(auth.uid()));

CREATE POLICY "Admins can delete gallery images" ON storage.objects
  FOR DELETE USING (bucket_id = 'gallery-images' AND public.is_admin(auth.uid()));

-- Storage policies for leadership images
CREATE POLICY "Anyone can view leadership images" ON storage.objects
  FOR SELECT USING (bucket_id = 'leadership-images');

CREATE POLICY "Admins can upload leadership images" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'leadership-images' AND public.is_admin(auth.uid()));

CREATE POLICY "Admins can update leadership images" ON storage.objects
  FOR UPDATE USING (bucket_id = 'leadership-images' AND public.is_admin(auth.uid()));

CREATE POLICY "Admins can delete leadership images" ON storage.objects
  FOR DELETE USING (bucket_id = 'leadership-images' AND public.is_admin(auth.uid()));

-- Storage policies for results files
CREATE POLICY "Anyone can view results files" ON storage.objects
  FOR SELECT USING (bucket_id = 'results-files');

CREATE POLICY "Admins can upload results files" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'results-files' AND public.is_admin(auth.uid()));

CREATE POLICY "Admins can update results files" ON storage.objects
  FOR UPDATE USING (bucket_id = 'results-files' AND public.is_admin(auth.uid()));

CREATE POLICY "Admins can delete results files" ON storage.objects
  FOR DELETE USING (bucket_id = 'results-files' AND public.is_admin(auth.uid()));

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON public.events
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_notices_updated_at BEFORE UPDATE ON public.notices
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_gallery_updated_at BEFORE UPDATE ON public.gallery
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_results_updated_at BEFORE UPDATE ON public.results
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_leadership_updated_at BEFORE UPDATE ON public.leadership
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();