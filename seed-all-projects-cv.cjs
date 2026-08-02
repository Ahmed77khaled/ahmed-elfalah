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
    title: 'CodeLens — Automated Code Language & Tag Detection',
    subtitle: 'Machine Learning Language Classifier & Smart Tagging System',
    short_desc: 'Intelligent developer tool that instantly detects programming languages and suggests relevant tags from code snippets.',
    long_desc: 'Engineered CodeLens, a machine learning powered tool designed to parse code syntax, analyze structural patterns and keywords, and instantly categorize code snippets by programming language while generating context-aware tags. Reduces manual tagging overhead for large codebases and streamlines question routing on developer platforms.',
    cover: 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=800&q=80',
    github: 'https://github.com/Ahmed77khaled',
    demo: '',
    tech: JSON.stringify(['Python', 'Machine Learning', 'Syntax Parsing', 'GitHub API', 'NLP']),
    features: JSON.stringify(['Automatic Language Detection', 'Context-Aware Tagging', 'Syntax Pattern Analysis', 'ML Code Classification']),
    category: 'AI & Software',
    featured: true,
    order: 3
  },
  {
    title: 'Smart Blind Stick — Assistive IoT System',
    subtitle: 'Ultrasonic Sensor Array & Haptic Navigation Cane',
    short_desc: 'Smart assistive cane for visually impaired individuals utilizing multi-directional ultrasonic sensors and real-time audio/haptic feedback.',
    long_desc: 'Engineered an assistive smart cane for visually impaired individuals featuring multi-directional ultrasonic sensors powered by Arduino microcontrollers. The system continuously scans for obstacles in front, left, and right directions, providing instant buzzer and haptic alerts to ensure collision-free navigation. Enclosed in custom 3D CAD modeled casing.',
    cover: 'https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=800&q=80',
    github: 'https://github.com/Ahmed77khaled',
    demo: '',
    tech: JSON.stringify(['Arduino', 'Embedded C++', 'Ultrasonic Sensors', '3D CAD (Blender)', 'Haptic Feedback']),
    features: JSON.stringify(['Multi-Directional Sensing', 'Audio & Haptic Alerts', 'Custom 3D Enclosure', 'Low-Power Embedded System']),
    category: 'IoT & Embedded',
    featured: true,
    order: 4
  },
  {
    title: 'Electronic Eye & Light Blocker Safety System',
    subtitle: 'Optical IR Barrier Detection & Relay Control System',
    short_desc: 'Optical beam interruption detection system using NE555 timer pulse generation and infrared sensing.',
    long_desc: 'Designed an optical barrier detection system utilizing NE555 timer pulse generators, IR transmitters, and sensitive photodiode receivers. Integrated transistor switching and high-voltage relay automation to trigger security alarms and safety cut-offs upon beam interruption. Includes custom 3D enclosure modeling and detailed component calibration.',
    cover: 'https://images.unsplash.com/photo-1508873696983-2df515122519?w=800&q=80',
    github: 'https://github.com/Ahmed77khaled',
    demo: '',
    tech: JSON.stringify(['NE555 Timer', 'IR Sensors', 'Relay Control', 'Transistors', '3D CAD (Blender)']),
    features: JSON.stringify(['IR Beam Interruption Detection', 'Relay Automation', 'Alarm Trigger System', 'Circuit Frequency Tuning']),
    category: 'Engineering & Hardware',
    featured: false,
    order: 5
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
    order: 6
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
    order: 7
  },
  {
    title: 'Metal Indicator & Frequency Oscillator Circuit',
    subtitle: 'Beat Frequency Oscillator (BFO) Metal Detection System',
    short_desc: 'High-sensitivity metal detection circuit using NE555 timer frequency oscillation and inductive LC resonance.',
    long_desc: 'Designed and assembled a Variable Frequency Oscillator (VFO/BFO) metal detection circuit powered by an NE555 timer IC and an inductive LC resonant coil. The circuit senses electromagnetic field disturbances caused by nearby metallic objects, converting inductance variations into audible frequency tone shifts through a speaker.',
    cover: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80',
    github: 'https://github.com/Ahmed77khaled',
    demo: '',
    tech: JSON.stringify(['NE555 Timer', 'Inductive LC Resonator', 'Control Logic', 'Signal Processing', 'BFO Circuit']),
    features: JSON.stringify(['Inductance Shift Sensing', 'Frequency-to-Audio Conversion', 'Resonant Tuning', 'Breadboard Prototyping']),
    category: 'Engineering & Hardware',
    featured: false,
    order: 8
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
    order: 9
  }
];

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
  { name: 'C++ & Arduino', icon: 'terminal', percentage: 82, category: 'Programming', order: 7 },
  { name: 'SQL & Databases', icon: 'database', percentage: 75, category: 'Programming', order: 8 },

  // DevOps
  { name: 'DevOps & CI/CD', icon: 'git-branch', percentage: 78, category: 'DevOps', order: 9 },
  { name: 'Linux CLI', icon: 'terminal', percentage: 80, category: 'DevOps', order: 10 },
  { name: 'Docker (Concepts)', icon: 'box', percentage: 70, category: 'DevOps', order: 11 },

  // Engineering & Embedded
  { name: 'Arduino & Microcontrollers', icon: 'cpu', percentage: 86, category: 'Engineering & Embedded', order: 12 },
  { name: 'MATLAB & Simulink', icon: 'activity', percentage: 85, category: 'Engineering & Embedded', order: 13 },
  { name: 'IoT & Sensors (ESP32 / Ultrasonic)', icon: 'wifi', percentage: 84, category: 'Engineering & Embedded', order: 14 },
  { name: '3D CAD Modeling (Blender)', icon: 'box', percentage: 75, category: 'Engineering & Embedded', order: 15 },

  // Web & Design
  { name: 'React & TypeScript', icon: 'layout', percentage: 78, category: 'Web & Design', order: 16 },
  { name: 'UI/UX Design', icon: 'pen-tool', percentage: 72, category: 'Web & Design', order: 17 },
];

async function run() {
  await client.connect();
  console.log('Connected to Supabase!');

  await client.query('DELETE FROM projects');
  console.log('Cleared old projects');

  for (const p of projects) {
    await client.query(
      `INSERT INTO projects (title, subtitle, short_description, long_description, cover_image, github_url, demo_url, tech_stack, features, category, status, featured, display_order)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8::jsonb,$9::jsonb,$10,'published',$11,$12)`,
      [p.title, p.subtitle, p.short_desc, p.long_desc, p.cover, p.github, p.demo, p.tech, p.features, p.category, p.featured, p.order]
    );
    console.log('Added project:', p.title);
  }

  await client.query('DELETE FROM skills');
  console.log('\nCleared old skills');

  for (const s of skills) {
    await client.query(
      `INSERT INTO skills (name, icon, percentage, category, visible, display_order)
       VALUES ($1, $2, $3, $4, true, $5)`,
      [s.name, s.icon, s.percentage, s.category, s.order]
    );
    console.log('Added skill:', s.name);
  }

  await client.end();
  console.log('\nDatabase populated with all 9 projects and updated skills!');
}

run().catch(e => { console.error('Error:', e.message); process.exit(1); });
