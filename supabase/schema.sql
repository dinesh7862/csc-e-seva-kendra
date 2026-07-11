-- ============================================================
-- E Seva Kendra — Supabase Database Schema
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ── Users ──
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE,
  phone VARCHAR(20),
  avatar_url TEXT,
  auth_provider VARCHAR(50) DEFAULT 'email', -- email, google, otp
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── Admins ──
CREATE TABLE admins (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role VARCHAR(50) DEFAULT 'admin' CHECK (role IN ('super_admin', 'admin', 'operator')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── Categories ──
CREATE TABLE categories (
  id VARCHAR(100) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  icon VARCHAR(100),
  description TEXT,
  color VARCHAR(100),
  sort_order INT DEFAULT 0,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── Services ──
CREATE TABLE services (
  id VARCHAR(100) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  icon VARCHAR(100),
  description TEXT,
  long_description TEXT,
  category_id VARCHAR(100) REFERENCES categories(id),
  processing_time VARCHAR(100),
  government_fee DECIMAL(10,2) DEFAULT 0,
  service_charge DECIMAL(10,2) DEFAULT 0,
  eligibility JSONB DEFAULT '[]',
  featured BOOLEAN DEFAULT false,
  active BOOLEAN DEFAULT true,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── Required Documents ──
CREATE TABLE required_documents (
  id VARCHAR(100) PRIMARY KEY,
  service_id VARCHAR(100) REFERENCES services(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  accepted_formats JSONB DEFAULT '["pdf","jpg","png"]',
  max_size_mb INT DEFAULT 10,
  required BOOLEAN DEFAULT true,
  sort_order INT DEFAULT 0
);

-- ── Form Fields ──
CREATE TABLE form_fields (
  id VARCHAR(100) PRIMARY KEY,
  service_id VARCHAR(100) REFERENCES services(id) ON DELETE CASCADE,
  label VARCHAR(255) NOT NULL,
  type VARCHAR(50) NOT NULL CHECK (type IN ('text','number','date','dropdown','radio','checkbox','file','email','tel','textarea')),
  placeholder TEXT,
  required BOOLEAN DEFAULT false,
  options JSONB DEFAULT '[]',
  validation JSONB,
  sort_order INT DEFAULT 0
);

-- ── Applications ──
CREATE TABLE applications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  application_number VARCHAR(20) UNIQUE NOT NULL,
  service_id VARCHAR(100) REFERENCES services(id),
  service_name VARCHAR(255) NOT NULL,
  user_id UUID REFERENCES users(id),
  user_name VARCHAR(255) NOT NULL,
  user_email VARCHAR(255),
  user_phone VARCHAR(20),
  form_data JSONB DEFAULT '{}',
  current_status VARCHAR(50) DEFAULT 'submitted'
    CHECK (current_status IN ('submitted','documents_verified','under_review','approved','rejected','completed','more_documents_needed')),
  government_fee DECIMAL(10,2) DEFAULT 0,
  service_charge DECIMAL(10,2) DEFAULT 0,
  total_amount DECIMAL(10,2) DEFAULT 0,
  payment_status VARCHAR(50) DEFAULT 'pending' CHECK (payment_status IN ('pending','paid','failed','refunded')),
  payment_id VARCHAR(255),
  notes TEXT,
  submitted_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── Status History ──
CREATE TABLE status_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  application_id UUID REFERENCES applications(id) ON DELETE CASCADE,
  status VARCHAR(50) NOT NULL,
  note TEXT,
  updated_by UUID, -- admin or system
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── Uploaded Files ──
CREATE TABLE uploaded_files (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  application_id UUID REFERENCES applications(id) ON DELETE CASCADE,
  document_id VARCHAR(100), -- Links to required_documents.id
  file_name VARCHAR(500) NOT NULL,
  file_size BIGINT,
  file_type VARCHAR(100),
  storage_path TEXT NOT NULL,
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending','verified','rejected')),
  uploaded_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── Payments ──
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  application_id UUID REFERENCES applications(id),
  amount DECIMAL(10,2) NOT NULL,
  method VARCHAR(50) CHECK (method IN ('razorpay','upi','phonepe','paytm')),
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending','success','failed','refunded')),
  transaction_id VARCHAR(255),
  gateway_response JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── Notifications ──
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  message TEXT,
  type VARCHAR(50) DEFAULT 'info' CHECK (type IN ('info','success','warning','error')),
  read BOOLEAN DEFAULT false,
  link TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── Application Counter (for sequential numbers) ──
CREATE SEQUENCE application_counter START WITH 1 INCREMENT BY 1;

-- ── Indexes ──
CREATE INDEX idx_applications_user ON applications(user_id);
CREATE INDEX idx_applications_service ON applications(service_id);
CREATE INDEX idx_applications_status ON applications(current_status);
CREATE INDEX idx_applications_number ON applications(application_number);
CREATE INDEX idx_status_history_app ON status_history(application_id);
CREATE INDEX idx_uploaded_files_app ON uploaded_files(application_id);
CREATE INDEX idx_notifications_user ON notifications(user_id, read);
CREATE INDEX idx_services_category ON services(category_id);

-- ── Row Level Security ──
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE uploaded_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Users can read/update their own data
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid() = id);

-- Users can view their own applications
CREATE POLICY "Users can view own applications" ON applications
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can insert applications" ON applications
  FOR INSERT WITH CHECK (user_id = auth.uid());

-- Users can view their own files
CREATE POLICY "Users can view own files" ON uploaded_files
  FOR SELECT USING (
    application_id IN (SELECT id FROM applications WHERE user_id = auth.uid())
  );

-- Users can view their own notifications
CREATE POLICY "Users can view own notifications" ON notifications
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can update own notifications" ON notifications
  FOR UPDATE USING (user_id = auth.uid());
