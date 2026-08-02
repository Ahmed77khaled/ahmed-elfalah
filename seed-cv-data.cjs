const { Client } = require('./tmp-init/node_modules/pg');

const client = new Client({
  connectionString: 'postgresql://postgres.eidlyvsiroyxvccmzlfm:ahmedkhaled18102005@aws-0-eu-west-3.pooler.supabase.com:6543/postgres',
  ssl: { rejectUnauthorized: false }
});

// Real skills from CV
const skills = [
  // Networking
  { name: 'Networking & CCNA', icon: 'network', percentage: 98, category: 'Networking', order: 1 },
  { name: 'Cisco Technologies', icon: 'router', percentage: 95, category: 'Networking', order: 2 },

  // Security & AI
  { name: 'Cybersecurity & SOC', icon: 'shield', percentage: 85, category: 'Security & AI', order: 3 },
  { name: 'Artificial Intelligence', icon: 'brain', percentage: 100, category: 'Security & AI', order: 4 },
  { name: 'Prompt Engineering', icon: 'bot', percentage: 82, category: 'Security & AI', order: 5 },

  // Programming
  { name: 'Python', icon: 'code', percentage: 88, category: 'Programming', order: 6 },
  { name: 'C++', icon: 'terminal', percentage: 80, category: 'Programming', order: 7 },
  { name: 'SQL & Databases', icon: 'database', percentage: 75, category: 'Programming', order: 8 },

  // DevOps
  { name: 'DevOps & CI/CD', icon: 'git-branch', percentage: 78, category: 'DevOps', order: 9 },
  { name: 'Linux CLI', icon: 'terminal', percentage: 80, category: 'DevOps', order: 10 },
  { name: 'Docker (Concepts)', icon: 'box', percentage: 70, category: 'DevOps', order: 11 },

  // Engineering
  { name: 'MATLAB & Simulink', icon: 'cpu', percentage: 85, category: 'Engineering', order: 12 },
  { name: 'IoT & Embedded (ESP32)', icon: 'wifi', percentage: 82, category: 'Engineering', order: 13 },

  // Web & Design
  { name: 'React & TypeScript', icon: 'layout', percentage: 78, category: 'Web & Design', order: 14 },
  { name: 'UI/UX Design', icon: 'pen-tool', percentage: 72, category: 'Web & Design', order: 15 },
];

// Real experience from CV
const experiences = [
  {
    company: 'Smart Medical Company',
    position: 'Data Entry Clerk & Digital Systems Operator',
    description: 'Digitized and structured large-scale medical and financial records — demonstrating end-to-end data pipeline management core to DevOps culture. Maintained 99%+ accuracy in large datasets using MS Excel with data validation and automated error-reduction workflows. Enforced strict data confidentiality and compliance policies mirroring SOC access control and information security governance.',
    start_date: '2025-01-01',
    end_date: '2025-07-01',
    current: false,
    order: 1
  },
  {
    company: 'NDETI — Higher Institute of Engineering & Technology',
    position: 'Team Secretary & Operations Coordinator — ACPC Engineering Team',
    description: 'Managed automated tracking databases for 20+ team members using Excel & Google Sheets — analogous to system health monitoring and dashboards in DevOps. Coordinated multi-site training operations, ACPC preparation schedules, and inter-university logistics both remotely and on-site. Maintained comprehensive technical documentation, incident tracking, and progress reports.',
    start_date: '2024-01-01',
    end_date: '',
    current: true,
    order: 2
  },
  {
    company: 'E& Egypt Senior Student Program 2026',
    position: 'DevOps Engineer & SOC Specialist — Student Program',
    description: 'Selected for the prestigious E& Egypt Senior Student Program 2026 as a DevOps Engineer and SOC Specialist. Applying CCNA (98% score, 120 hrs), AI (100% score, 80 hrs), and cybersecurity knowledge in a professional environment. Focused on networking, security operations, and cloud infrastructure management.',
    start_date: '2026-01-01',
    end_date: '',
    current: true,
    order: 3
  }
];

async function run() {
  await client.connect();
  console.log('Connected to Supabase!');

  // Update Skills
  await client.query('DELETE FROM skills');
  console.log('Cleared old skills');

  for (const s of skills) {
    await client.query(
      `INSERT INTO skills (name, icon, percentage, category, visible, display_order)
       VALUES ($1, $2, $3, $4, true, $5)`,
      [s.name, s.icon, s.percentage, s.category, s.order]
    );
    console.log('Added skill:', s.name);
  }

  // Update Experience
  await client.query('DELETE FROM experience');
  console.log('\nCleared old experience');

  for (const e of experiences) {
    await client.query(
      `INSERT INTO experience (company, position, description, start_date, end_date, current_position, company_logo, display_order)
       VALUES ($1, $2, $3, $4, $5, $6, '', $7)`,
      [e.company, e.position, e.description, e.start_date, e.end_date, e.current, e.order]
    );
    console.log('Added experience:', e.position, 'at', e.company);
  }

  await client.end();
  console.log('\nAll data updated successfully!');
}

run().catch(e => { console.error('Error:', e.message); process.exit(1); });
