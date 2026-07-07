-- Zoom Car Inspection - Supabase Schema
-- Production-ready version

CREATE TYPE user_role AS ENUM ('manager', 'inspector');
CREATE TYPE inspection_status AS ENUM ('draft', 'in_progress', 'completed', 'cancelled');

CREATE TABLE companies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  logo_url TEXT,
  address TEXT,
  phone TEXT,
  email TEXT,
  settings JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  company_id UUID REFERENCES companies(id) ON DELETE SET NULL,
  email TEXT NOT NULL,
  full_name TEXT NOT NULL,
  role user_role NOT NULL DEFAULT 'inspector',
  phone TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  mobile TEXT NOT NULL,
  email TEXT,
  emirates_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE vehicles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
  vin TEXT,
  plate_number TEXT NOT NULL,
  make TEXT, model TEXT, trim TEXT,
  year INTEGER, mileage INTEGER,
  engine_size TEXT, fuel_type TEXT, transmission TEXT,
  color TEXT, chassis_number TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE inspections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  vehicle_id UUID REFERENCES vehicles(id) ON DELETE SET NULL,
  customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
  inspector_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  status inspection_status NOT NULL DEFAULT 'draft',
  current_step INTEGER DEFAULT 1,
  customer_data JSONB DEFAULT '{}'::jsonb,
  vehicle_data JSONB DEFAULT '{}'::jsonb,
  exterior_data JSONB DEFAULT '{}'::jsonb,
  paint_data JSONB DEFAULT '{}'::jsonb,
  chassis_data JSONB DEFAULT '{}'::jsonb,
  engine_data JSONB DEFAULT '{}'::jsonb,
  transmission_data JSONB DEFAULT '{}'::jsonb,
  suspension_data JSONB DEFAULT '{}'::jsonb,
  brakes_data JSONB DEFAULT '{}'::jsonb,
  steering_data JSONB DEFAULT '{}'::jsonb,
  tires_data JSONB DEFAULT '{}'::jsonb,
  interior_data JSONB DEFAULT '{}'::jsonb,
  electronics_data JSONB DEFAULT '{}'::jsonb,
  road_test_data JSONB DEFAULT '{}'::jsonb,
  photos_data JSONB DEFAULT '{}'::jsonb,
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  inspection_time_minutes INTEGER,
  price DECIMAL(10,2),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE inspection_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  template_data JSONB DEFAULT '{}'::jsonb,
  is_default BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE pricing (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  base_price DECIMAL(10,2) NOT NULL,
  description TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at=NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_companies_updated BEFORE UPDATE ON companies FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER trg_profiles_updated BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER trg_customers_updated BEFORE UPDATE ON customers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER trg_vehicles_updated BEFORE UPDATE ON vehicles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER trg_inspections_updated BEFORE UPDATE ON inspections FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER trg_templates_updated BEFORE UPDATE ON inspection_templates FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER trg_pricing_updated BEFORE UPDATE ON pricing FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE inspections ENABLE ROW LEVEL SECURITY;
ALTER TABLE inspection_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE pricing ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Company members view profiles" ON profiles FOR SELECT
USING (company_id=(SELECT company_id FROM profiles WHERE id=auth.uid()) OR auth.uid()=id);

CREATE POLICY "Users update own profile" ON profiles FOR UPDATE
USING (auth.uid()=id) WITH CHECK (auth.uid()=id);

CREATE POLICY "Company members view company" ON companies FOR SELECT
USING (id=(SELECT company_id FROM profiles WHERE id=auth.uid()));

CREATE POLICY "Company members access customers" ON customers FOR ALL
USING (company_id=(SELECT company_id FROM profiles WHERE id=auth.uid()))
WITH CHECK (company_id=(SELECT company_id FROM profiles WHERE id=auth.uid()));

CREATE POLICY "Company members access vehicles" ON vehicles FOR ALL
USING (company_id=(SELECT company_id FROM profiles WHERE id=auth.uid()))
WITH CHECK (company_id=(SELECT company_id FROM profiles WHERE id=auth.uid()));

CREATE POLICY "Company members access inspections" ON inspections FOR ALL
USING (company_id=(SELECT company_id FROM profiles WHERE id=auth.uid()))
WITH CHECK (company_id=(SELECT company_id FROM profiles WHERE id=auth.uid()));

CREATE POLICY "Company members access templates" ON inspection_templates FOR ALL
USING (company_id=(SELECT company_id FROM profiles WHERE id=auth.uid()))
WITH CHECK (company_id=(SELECT company_id FROM profiles WHERE id=auth.uid()));

CREATE POLICY "Company members access pricing" ON pricing FOR ALL
USING (company_id=(SELECT company_id FROM profiles WHERE id=auth.uid()))
WITH CHECK (company_id=(SELECT company_id FROM profiles WHERE id=auth.uid()));

CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles(id,email,full_name,role)
  VALUES(
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name',split_part(NEW.email,'@',1)),
    'inspector'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION handle_new_user();

CREATE INDEX idx_inspections_company ON inspections(company_id);
CREATE INDEX idx_inspections_status ON inspections(status);
CREATE INDEX idx_inspections_inspector ON inspections(inspector_id);
CREATE INDEX idx_inspections_created ON inspections(created_at DESC);
