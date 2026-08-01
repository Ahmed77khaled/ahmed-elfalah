const { Client } = require('./tmp-init/node_modules/pg');

const client = new Client({
  connectionString: 'postgresql://postgres.eidlyvsiroyxvccmzlfm:ahmedkhaled18102005@aws-0-eu-west-3.pooler.supabase.com:6543/postgres',
  ssl: { rejectUnauthorized: false }
});

const sql = `
-- Enable Row Level Security (RLS) on tables
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE experience ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- Create policies for public access safely
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public Read Projects') THEN
    CREATE POLICY "Public Read Projects" ON projects FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public Read Skills') THEN
    CREATE POLICY "Public Read Skills" ON skills FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public Read Experience') THEN
    CREATE POLICY "Public Read Experience" ON experience FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public Read Settings') THEN
    CREATE POLICY "Public Read Settings" ON settings FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public Insert Messages') THEN
    CREATE POLICY "Public Insert Messages" ON messages FOR INSERT WITH CHECK (true);
  END IF;
END $$;

-- Enable Realtime publication for messages table
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM pg_publication WHERE pubname = 'supabase_realtime') THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE messages;
  END IF;
EXCEPTION WHEN OTHERS THEN
  NULL;
END $$;
`;

async function run() {
  await client.connect();
  console.log('Connected to Supabase!');
  await client.query(sql);
  console.log('Successfully enabled RLS Policies, Public Access rules, and Supabase Realtime!');
  await client.end();
}

run().catch(e => { console.error('Error:', e.message); process.exit(1); });
