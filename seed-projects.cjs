const { Client } = require('./tmp-init/node_modules/pg');

const client = new Client({
  connectionString: 'postgresql://postgres.eidlyvsiroyxvccmzlfm:ahmedkhaled18102005@aws-0-eu-west-3.pooler.supabase.com:6543/postgres',
  ssl: { rejectUnauthorized: false }
});

const projects = [
  {
    title: 'IoT-Based Energy Monitoring System',
    subtitle: 'Real-Time Cloud Dashboard & DevOps Pipeline',
    short_desc: 'Full-stack IoT data pipeline using ESP32 with real-time cloud monitoring dashboard.',
    long_desc: 'Built a complete IoT data pipeline: ESP32 microcontroller for sensor data collection to local processing to cloud dashboard for real-time monitoring. Mirrors CI/CD DevOps methodology with full system ownership. Implemented real-time observability concepts similar to Prometheus/Grafana monitoring stacks.',
    cover: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
    github: 'https://github.com/Ahmed77khaled',
    demo: '',
    tech: JSON.stringify(['ESP32', 'C++', 'IoT', 'Cloud Dashboard', 'Python', 'Embedded Systems']),
    features: JSON.stringify(['Real-Time Monitoring', 'Cloud Integration', 'DevOps Pipeline', 'Sensor Data Collection']),
    category: 'IoT & Embedded',
    featured: true,
    order: 1
  },
  {
    title: 'AI-Based Fire Detection System',
    subtitle: 'SOC Threat Detection & Incident Response — Startup Concept',
    short_desc: 'AI-driven fire detection system with real-time alerts and automated incident response workflows.',
    long_desc: 'Developed an AI-driven threat detection system with real-time alerting and automated response workflows — directly mapping to SOC SIEM architecture. Pitched to industry stakeholders at Royal Company Entrepreneurship Program, demonstrating technical communication and business presentation skills.',
    cover: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80',
    github: 'https://github.com/Ahmed77khaled',
    demo: '',
    tech: JSON.stringify(['Python', 'AI/ML', 'SIEM Concepts', 'Incident Response', 'IoT Sensors']),
    features: JSON.stringify(['AI Threat Detection', 'Real-Time Alerts', 'Automated Response', 'SOC Integration']),
    category: 'AI & Security',
    featured: true,
    order: 2
  },
  {
    title: 'MATLAB/Simulink EV & Automotive Systems Simulation',
    subtitle: 'Electric Vehicle Design & Motor Control Simulation',
    short_desc: 'Complete automotive simulation covering EV design, Motor Control, Battery Management Systems, and Vehicle Dynamics.',
    long_desc: 'Applied MATLAB and Simulink tools for full automotive and electric vehicle simulation covering EV design, Motor Control, Battery Management Systems (BMS), Longitudinal and Lateral Vehicle Dynamics, Suspension, Steering, and 3D Visualization. Completed as part of MathWorks Online Awareness Campaign.',
    cover: 'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=800&q=80',
    github: 'https://github.com/Ahmed77khaled',
    demo: '',
    tech: JSON.stringify(['MATLAB', 'Simulink', 'Control Systems', 'EV Design', 'BMS', 'Vehicle Dynamics']),
    features: JSON.stringify(['EV Motor Control', 'Battery Management', 'Vehicle Dynamics Simulation', '3D Visualization']),
    category: 'Engineering & Simulation',
    featured: false,
    order: 3
  },
  {
    title: 'Binary Counter — Engine ECU & Fuel Injection Control',
    subtitle: 'Automation Logic & Control Systems Engineering',
    short_desc: 'Real-time control logic using binary counters in Engine Control Units for fuel injection automation.',
    long_desc: 'Modeled real-time control logic using binary counters in Engine Control Units (ECU) — foundational systems automation skills applied to fuel injection control. Delivered multi-format technical outputs: interactive HTML widget, Word documentation, and visual Arabic summary.',
    cover: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&q=80',
    github: 'https://github.com/Ahmed77khaled',
    demo: '',
    tech: JSON.stringify(['Control Systems', 'Binary Logic', 'Automation', 'MATLAB', 'ECU Design']),
    features: JSON.stringify(['ECU Control Logic', 'Fuel Injection Automation', 'Multi-Format Documentation', 'Real-Time Processing']),
    category: 'Engineering & Simulation',
    featured: false,
    order: 4
  },
  {
    title: 'Full Stack Portfolio & CMS Architecture',
    subtitle: 'High Performance Personal Portfolio with Admin Panel',
    short_desc: 'Modern portfolio built with React, Vite, Node.js, and PostgreSQL with a full content management system.',
    long_desc: 'Complete portfolio ecosystem with a dynamic content management system and admin dashboard. Built with React + TypeScript frontend, Node.js serverless API backend, and PostgreSQL (Supabase) database. Deployed on Vercel with auto CI/CD via GitHub. Features JWT authentication and CRUD operations for all portfolio content.',
    cover: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80',
    github: 'https://github.com/Ahmed77khaled/ahmed-elfalah',
    demo: 'https://ahmed-elfalah.vercel.app',
    tech: JSON.stringify(['React', 'TypeScript', 'Vite', 'Node.js', 'PostgreSQL', 'Supabase', 'Vercel']),
    features: JSON.stringify(['Responsive Design', 'Custom CMS', 'JWT Auth', 'CI/CD Pipeline', 'Supabase Integration']),
    category: 'Web Development',
    featured: true,
    order: 5
  }
];

async function run() {
  await client.connect();
  console.log('Connected to Supabase!');

  await client.query('DELETE FROM projects');
  console.log('Cleared old placeholder projects');

  for (const p of projects) {
    await client.query(
      `INSERT INTO projects (title, subtitle, short_description, long_description, cover_image, github_url, demo_url, tech_stack, features, category, status, featured, display_order)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8::jsonb,$9::jsonb,$10,'published',$11,$12)`,
      [p.title, p.subtitle, p.short_desc, p.long_desc, p.cover, p.github, p.demo, p.tech, p.features, p.category, p.featured, p.order]
    );
    console.log('Added:', p.title);
  }

  await client.end();
  console.log('\nAll projects added successfully!');
}

run().catch(e => { console.error('Error:', e.message); process.exit(1); });
