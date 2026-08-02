const sharp = require('./tmp-init/node_modules/sharp');
const fs = require('fs');
const path = require('path');
const { Client } = require('./tmp-init/node_modules/pg');

const ccnaDir = path.join(__dirname, 'artifacts', 'portfolio', 'public', 'labs', 'ccna');
const webpDir = ccnaDir; // overwrite in same dir, just change extension

const MAX_WIDTH = 1920;
const WEBP_QUALITY = 78; // Good balance: quality vs file size

async function compressImages() {
  const files = fs.readdirSync(ccnaDir).filter(f => /\.(jpg|jpeg|png)$/i.test(f));
  const results = [];

  console.log(`\nFound ${files.length} images to compress...\n`);

  for (const file of files) {
    const srcPath = path.join(ccnaDir, file);
    const baseName = path.parse(file).name;
    const destName = `${baseName}.webp`;
    const destPath = path.join(webpDir, destName);

    try {
      const srcSize = fs.statSync(srcPath).size;
      
      await sharp(srcPath)
        .resize({ width: MAX_WIDTH, withoutEnlargement: true })
        .webp({ quality: WEBP_QUALITY, effort: 4 })
        .toFile(destPath);

      const destSize = fs.statSync(destPath).size;
      const saved = Math.round((1 - destSize / srcSize) * 100);
      
      console.log(`✅ ${file} → ${destName}`);
      console.log(`   ${(srcSize/1024/1024).toFixed(2)}MB → ${(destSize/1024/1024).toFixed(2)}MB (${saved}% smaller)`);
      
      results.push({ original: `/labs/ccna/${file}`, webp: `/labs/ccna/${destName}` });
    } catch (err) {
      console.log(`❌ Failed: ${file} — ${err.message}`);
    }
  }

  return results;
}

async function updateDatabase(results) {
  const client = new Client({
    connectionString: 'postgresql://postgres.eidlyvsiroyxvccmzlfm:ahmedkhaled18102005@aws-0-eu-west-3.pooler.supabase.com:6543/postgres',
    ssl: { rejectUnauthorized: false }
  });

  await client.connect();

  // Get CCNA project
  const { rows } = await client.query("SELECT id, cover_image, gallery_images FROM projects WHERE title LIKE '%CCNA%'");
  if (!rows.length) { console.log('No CCNA project found'); await client.end(); return; }

  const project = rows[0];

  // Build a map: original → webp
  const map = {};
  results.forEach(r => { map[r.original] = r.webp; });

  // Update cover_image
  const newCover = map[project.cover_image] || project.cover_image;

  // Update gallery_images
  const gallery = Array.isArray(project.gallery_images) ? project.gallery_images : JSON.parse(project.gallery_images);
  const newGallery = gallery.map(url => map[url] || url);

  await client.query(
    'UPDATE projects SET cover_image = $1, gallery_images = $2::jsonb, updated_at = NOW() WHERE id = $3',
    [newCover, JSON.stringify(newGallery), project.id]
  );

  console.log(`\n✅ Updated CCNA project in DB:`);
  console.log(`   cover: ${newCover}`);
  console.log(`   gallery: ${newGallery.length} images updated`);

  await client.end();
}

async function run() {
  console.log('🚀 Starting image compression...\n');
  const results = await compressImages();
  console.log(`\n✅ Compressed ${results.length} images`);
  await updateDatabase(results);
  console.log('\n🎉 Done! WebP images ready and DB updated.');
}

run().catch(console.error);
