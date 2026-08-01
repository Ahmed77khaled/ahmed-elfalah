const { Client } = require('./tmp-init/node_modules/pg');

const client = new Client({
  connectionString: 'postgresql://postgres.eidlyvsiroyxvccmzlfm:ahmedkhaled18102005@aws-0-eu-west-3.pooler.supabase.com:6543/postgres',
  ssl: { rejectUnauthorized: false }
});

async function run() {
  await client.connect();
  console.log('Connected to Supabase!');

  await client.query(`
    UPDATE projects 
    SET gallery_images = $1::jsonb 
    WHERE title LIKE '%Energy Monitoring%'
  `, [JSON.stringify([
    "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80",
    "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80"
  ])]);

  await client.query(`
    UPDATE projects 
    SET gallery_images = $1::jsonb 
    WHERE title LIKE '%Smart Blind Stick%'
  `, [JSON.stringify([
    "https://images.unsplash.com/photo-1508873696983-2df515122519?w=800&q=80",
    "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&q=80"
  ])]);

  await client.query(`
    UPDATE projects 
    SET gallery_images = $1::jsonb 
    WHERE title LIKE '%CodeLens%'
  `, [JSON.stringify([
    "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80",
    "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&q=80"
  ])]);

  console.log('Successfully updated sample gallery images!');
  await client.end();
}

run().catch(e => { console.error('Error:', e.message); process.exit(1); });
