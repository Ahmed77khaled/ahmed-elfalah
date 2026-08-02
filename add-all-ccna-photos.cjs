const fs = require('fs');
const path = require('path');
const { Client } = require('./tmp-init/node_modules/pg');

const targetDir = path.join(__dirname, 'artifacts', 'portfolio', 'public', 'labs', 'ccna');

const copies = [
  { src: 'D:\\fel7o tech\\CCNA\\gallery\\New folder\\IMG_4841.jpg', dest: 'ccna-lab-session-1.jpg' },
  { src: 'D:\\fel7o tech\\CCNA\\gallery\\New folder\\IMG_4867.jpg', dest: 'ccna-lab-session-2.jpg' },
  { src: 'D:\\fel7o tech\\CCNA\\gallery\\New folder\\Snapchat-780766894.jpg', dest: 'ccna-training-photo-1.jpg' },
  { src: 'D:\\fel7o tech\\CCNA\\gallery\\Snapchat-1414083968.jpg', dest: 'ccna-training-photo-2.jpg' },
  { src: 'D:\\fel7o tech\\CCNA\\gallery\\Snapchat-232035792.jpg', dest: 'ccna-training-photo-3.jpg' },
  { src: 'D:\\fel7o tech\\CCNA\\gallery\\IMG_20260129_141205.jpg', dest: 'ccna-hands-on-lab-jan29.jpg' },
  { src: 'D:\\fel7o tech\\CCNA\\gallery\\IMG_20260201_144503.jpg', dest: 'ccna-hands-on-lab-feb01.jpg' }
];

copies.forEach(({ src, dest }) => {
  if (fs.existsSync(src)) {
    const destPath = path.join(targetDir, dest);
    fs.copyFileSync(src, destPath);
    console.log(`Copied ${dest} (${fs.statSync(destPath).size} bytes)`);
  } else {
    console.log(`Source not found: ${src}`);
  }
});

const client = new Client({
  connectionString: 'postgresql://postgres.eidlyvsiroyxvccmzlfm:ahmedkhaled18102005@aws-0-eu-west-3.pooler.supabase.com:6543/postgres',
  ssl: { rejectUnauthorized: false }
});

const allCcnaGallery = [
  '/labs/ccna/hands-on-networking-training.jpg',
  '/labs/ccna/ccna-lab-session-1.jpg',
  '/labs/ccna/ccna-lab-session-2.jpg',
  '/labs/ccna/ccna-training-photo-1.jpg',
  '/labs/ccna/ccna-training-photo-2.jpg',
  '/labs/ccna/ccna-training-photo-3.jpg',
  '/labs/ccna/ccna-hands-on-lab-jan29.jpg',
  '/labs/ccna/ccna-hands-on-lab-feb01.jpg',
  '/labs/ccna/networking-presentation.jpg',
  '/labs/ccna/ccna-classroom.jpg',
  '/labs/ccna/ccna-training-room.jpg',
  '/labs/ccna/nti-ccna-group.jpg',
  '/labs/ccna/nti-training-event.jpg',
  '/labs/ccna/ip-configuration-check.png',
  '/labs/ccna/subnetting-plan.png',
  '/labs/ccna/vlan-topology.png',
  '/labs/ccna/ospf-adjacency.png',
  '/labs/ccna/switch-topology.png',
  '/labs/ccna/snmp-lab-sketch.png',
  '/labs/ccna/snmp-router-config.png',
  '/labs/ccna/snmp-design-notes.png',
  '/labs/ccna/snmp-manager-agent.png',
  '/labs/ccna/snmp-use-cases.png',
  '/labs/ccna/connectivity-troubleshooting.png',
  '/labs/ccna/connectivity-validation.png'
];

async function run() {
  await client.connect();
  const res = await client.query(
    "UPDATE projects SET cover_image = $1, gallery_images = $2::jsonb, updated_at = NOW() WHERE title LIKE '%CCNA%' RETURNING id",
    [allCcnaGallery[0], JSON.stringify(allCcnaGallery)]
  );
  console.log(`Updated CCNA project gallery in Supabase with ${allCcnaGallery.length} total images!`);
  await client.end();
}

run().catch(console.error);
