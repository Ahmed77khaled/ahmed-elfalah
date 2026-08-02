CREATE TABLE IF NOT EXISTS projects (
  id SERIAL PRIMARY KEY, title TEXT NOT NULL, subtitle TEXT NOT NULL DEFAULT '',
  short_description TEXT NOT NULL DEFAULT '', long_description TEXT NOT NULL DEFAULT '',
  cover_image TEXT NOT NULL DEFAULT '', cover_image_position TEXT NOT NULL DEFAULT 'center center', gallery_images JSONB NOT NULL DEFAULT '[]'::jsonb,
  github_url TEXT NOT NULL DEFAULT '', demo_url TEXT NOT NULL DEFAULT '',
  tech_stack JSONB NOT NULL DEFAULT '[]'::jsonb, features JSONB NOT NULL DEFAULT '[]'::jsonb,
  category TEXT NOT NULL DEFAULT '', status TEXT NOT NULL DEFAULT 'published', featured BOOLEAN NOT NULL DEFAULT FALSE,
  display_order INTEGER NOT NULL DEFAULT 0, created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(), updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS skills (
  id SERIAL PRIMARY KEY, name TEXT NOT NULL, icon TEXT NOT NULL DEFAULT '', percentage INTEGER NOT NULL DEFAULT 0,
  category TEXT NOT NULL DEFAULT '', visible BOOLEAN NOT NULL DEFAULT TRUE, display_order INTEGER NOT NULL DEFAULT 0
);
CREATE TABLE IF NOT EXISTS experience (
  id SERIAL PRIMARY KEY, company TEXT NOT NULL, position TEXT NOT NULL, description TEXT NOT NULL DEFAULT '',
  start_date TEXT NOT NULL DEFAULT '', end_date TEXT NOT NULL DEFAULT '', current_position BOOLEAN NOT NULL DEFAULT FALSE,
  company_logo TEXT NOT NULL DEFAULT '', display_order INTEGER NOT NULL DEFAULT 0, created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS messages (
  id SERIAL PRIMARY KEY, name TEXT NOT NULL, email TEXT NOT NULL, subject TEXT NOT NULL, message TEXT NOT NULL,
  read BOOLEAN NOT NULL DEFAULT FALSE, created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
  CREATE TABLE IF NOT EXISTS settings (
  id SERIAL PRIMARY KEY, key TEXT NOT NULL UNIQUE, value TEXT NOT NULL DEFAULT '', updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  );
  CREATE TABLE IF NOT EXISTS reminders (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    due_date DATE NOT NULL,
    notes TEXT NOT NULL DEFAULT '',
    status TEXT NOT NULL DEFAULT 'pending',
    notified_before BOOLEAN NOT NULL DEFAULT FALSE,
    notified_due BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    completed_at TIMESTAMPTZ
  );
  CREATE TABLE IF NOT EXISTS media (
    id SERIAL PRIMARY KEY,
    filename TEXT NOT NULL,
    mime_type TEXT NOT NULL,
    bytes BYTEA NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  );

-- Initial portfolio content. Existing rows are never overwritten.
INSERT INTO projects (title, subtitle, short_description, long_description, cover_image, github_url, demo_url, tech_stack, features, category, status, featured, display_order)
SELECT 'DevOps & Infrastructure Automation Platform', 'Automated CI/CD and Container Orchestration', 'Enterprise-grade Kubernetes cluster management and CI/CD pipelines.', 'Built an automated infrastructure deployment system using Terraform, Docker, and Kubernetes.', 'https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=800&q=80', 'https://github.com/Ahmed77khaled', '', '["Docker","Kubernetes","Terraform","GitHub Actions","Python"]'::jsonb, '["Automated Deployments","Cluster Monitoring","Infrastructure as Code"]'::jsonb, 'DevOps', 'published', true, 1
WHERE NOT EXISTS (SELECT 1 FROM projects);

INSERT INTO projects (title, subtitle, short_description, long_description, cover_image, github_url, demo_url, tech_stack, features, category, status, featured, display_order)
SELECT 'Full Stack Portfolio & CMS Architecture', 'High Performance Personal Portfolio', 'Modern portfolio built with React, Vite, Express, and PostgreSQL.', 'Complete portfolio ecosystem with content management system and dynamic analytics.', 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80', 'https://github.com/Ahmed77khaled', '', '["React","TypeScript","Vite","Node.js","PostgreSQL","TailwindCSS"]'::jsonb, '["Responsive Design","Custom CMS","Dark Mode"]'::jsonb, 'Web Development', 'published', true, 2
WHERE NOT EXISTS (SELECT 1 FROM projects WHERE display_order = 2);

INSERT INTO skills (name, icon, percentage, category, visible, display_order)
SELECT * FROM (VALUES
  ('Python', 'code', 90, 'Backend', true, 1),
  ('DevOps & Docker', 'container', 85, 'DevOps', true, 2),
  ('Linux Administration', 'terminal', 88, 'Infrastructure', true, 3),
  ('React & TypeScript', 'layout', 82, 'Frontend', true, 4),
  ('Networking & Security', 'shield', 80, 'Networking', true, 5)
) AS seed(name, icon, percentage, category, visible, display_order)
WHERE NOT EXISTS (SELECT 1 FROM skills);

INSERT INTO experience (company, position, description, start_date, end_date, current_position, display_order)
SELECT 'Freelance', 'Full Stack & DevOps Engineer', 'Designing modern web applications and cloud infrastructure solutions for global clients.', '2023-01-01', 'Present', true, 1
WHERE NOT EXISTS (SELECT 1 FROM experience);

INSERT INTO settings (key, value) VALUES
  ('siteTitle', 'Ahmed El-Falah | Portfolio'),
  ('adminEmail', 'ahmed@example.com'),
  ('maintenanceMode', 'false')
ON CONFLICT (key) DO NOTHING;
