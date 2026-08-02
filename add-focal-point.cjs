const { Client } = require('./tmp-init/node_modules/pg');

const client = new Client({
  connectionString: 'postgresql://postgres.eidlyvsiroyxvccmzlfm:ahmedkhaled18102005@aws-0-eu-west-3.pooler.supabase.com:6543/postgres',
  ssl: { rejectUnauthorized: false }
});

async function run() {
  await client.connect();
  // Check if column already exists
  const check = await client.query(`
    SELECT column_name FROM information_schema.columns
    WHERE table_name='projects' AND column_name='cover_image_position'
  `);
  if (check.rowCount === 0) {
    await client.query(`ALTER TABLE projects ADD COLUMN cover_image_position TEXT NOT NULL DEFAULT 'center center'`);
    console.log('Added cover_image_position column to projects table.');
  } else {
    console.log('Column cover_image_position already exists.');
  }
  await client.end();
}

run().catch(console.error);
