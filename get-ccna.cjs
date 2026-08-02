const { Client } = require('./tmp-init/node_modules/pg');

const client = new Client({
  connectionString: 'postgresql://postgres.eidlyvsiroyxvccmzlfm:ahmedkhaled18102005@aws-0-eu-west-3.pooler.supabase.com:6543/postgres',
  ssl: { rejectUnauthorized: false }
});

async function run() {
  await client.connect();
  const res = await client.query("SELECT id, title, subtitle, short_description, long_description, cover_image, gallery_images, demo_url, github_url, tech_stack, features FROM projects WHERE title LIKE '%CCNA%'");
  console.log(JSON.stringify(res.rows, null, 2));
  await client.end();
}

run().catch(console.error);
