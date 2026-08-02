const { Client } = require('./tmp-init/node_modules/pg');

const client = new Client({
  connectionString: 'postgresql://postgres.eidlyvsiroyxvccmzlfm:ahmedkhaled18102005@aws-0-eu-west-3.pooler.supabase.com:6543/postgres',
  ssl: { rejectUnauthorized: false }
});

async function run() {
  await client.connect();
  console.log('Connected to Supabase!');

  // 1. AI-Based Fire Detection System
  await client.query(`
    UPDATE projects 
    SET gallery_images = $1::jsonb 
    WHERE title LIKE '%Fire Detection%'
  `, [JSON.stringify([
    "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&q=80",
    "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&q=80",
    "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&q=80"
  ])]);

  // 2. Electronic Eye & Light Blocker Safety System
  await client.query(`
    UPDATE projects 
    SET gallery_images = $1::jsonb 
    WHERE title LIKE '%Electronic Eye%'
  `, [JSON.stringify([
    "https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=800&q=80",
    "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&q=80",
    "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80"
  ])]);

  // 3. Full Stack Portfolio & CMS Architecture
  await client.query(`
    UPDATE projects 
    SET gallery_images = $1::jsonb 
    WHERE title LIKE '%Full Stack Portfolio%'
  `, [JSON.stringify([
    "https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=800&q=80",
    "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80",
    "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=800&q=80"
  ])]);

  // 4. IoT-Based Energy Monitoring System
  await client.query(`
    UPDATE projects 
    SET gallery_images = $1::jsonb 
    WHERE title LIKE '%Energy Monitoring%'
  `, [JSON.stringify([
    "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80",
    "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80",
    "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&q=80"
  ])]);

  console.log('Successfully updated gallery images for multiple projects!');
  await client.end();
}

run().catch(e => { console.error('Error:', e.message); process.exit(1); });
