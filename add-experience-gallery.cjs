const { Client } = require('./tmp-init/node_modules/pg');

const client = new Client({
  connectionString: 'postgresql://postgres.eidlyvsiroyxvccmzlfm:ahmedkhaled18102005@aws-0-eu-west-3.pooler.supabase.com:6543/postgres',
  ssl: { rejectUnauthorized: false }
});

async function run() {
  await client.connect();

  // Add type column
  const checkType = await client.query(`
    SELECT column_name FROM information_schema.columns
    WHERE table_name='experience' AND column_name='type'
  `);
  if (checkType.rowCount === 0) {
    await client.query(`ALTER TABLE experience ADD COLUMN type TEXT NOT NULL DEFAULT 'Training / Internship'`);
    console.log('✅ Added type column to experience table.');
  }

  // Add gallery_images column
  const checkGallery = await client.query(`
    SELECT column_name FROM information_schema.columns
    WHERE table_name='experience' AND column_name='gallery_images'
  `);
  if (checkGallery.rowCount === 0) {
    await client.query(`ALTER TABLE experience ADD COLUMN gallery_images JSONB NOT NULL DEFAULT '[]'::jsonb`);
    console.log('✅ Added gallery_images column to experience table.');
  }

  await client.end();
}

run().catch(console.error);
