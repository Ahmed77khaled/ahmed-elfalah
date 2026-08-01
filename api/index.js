import crypto from "node:crypto";

const projects = [
  {
    id: 1,
    title: "DevOps & Infrastructure Automation Platform",
    subtitle: "Automated CI/CD and Container Orchestration",
    shortDescription: "Enterprise-grade Kubernetes cluster management and CI/CD pipelines.",
    longDescription: "Built an automated infrastructure deployment system using Terraform, Docker, and Kubernetes.",
    coverImage: "https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=800&q=80",
    galleryImages: [],
    githubUrl: "https://github.com/Ahmed77khaled",
    demoUrl: "https://ahmed-elfalah.vercel.app",
    techStack: ["Docker", "Kubernetes", "Terraform", "GitHub Actions", "Python"],
    features: ["Automated Deployments", "Cluster Monitoring", "Infrastructure as Code"],
    category: "DevOps",
    status: "published",
    featured: true,
    displayOrder: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 2,
    title: "Full Stack Portfolio & CMS Architecture",
    subtitle: "High Performance Personal Portfolio",
    shortDescription: "Modern portfolio built with React, Vite, Express, and PostgreSQL.",
    longDescription: "Complete portfolio ecosystem with content management system and dynamic analytics.",
    coverImage: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80",
    galleryImages: [],
    githubUrl: "https://github.com/Ahmed77khaled",
    demoUrl: "https://ahmed-elfalah.vercel.app",
    techStack: ["React", "TypeScript", "Vite", "Node.js", "Express", "TailwindCSS"],
    features: ["Responsive Design", "Custom CMS", "Dark Mode"],
    category: "Web Development",
    status: "published",
    featured: true,
    displayOrder: 2,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
];

const skills = [
  { id: 1, name: "Python", icon: "code", percentage: 90, category: "Backend", visible: true, displayOrder: 1 },
  { id: 2, name: "DevOps & Docker", icon: "container", percentage: 85, category: "DevOps", visible: true, displayOrder: 2 },
  { id: 3, name: "Linux Administration", icon: "terminal", percentage: 88, category: "Infrastructure", visible: true, displayOrder: 3 },
  { id: 4, name: "React & TypeScript", icon: "layout", percentage: 82, category: "Frontend", visible: true, displayOrder: 4 },
  { id: 5, name: "Networking & Security", icon: "shield", percentage: 80, category: "Networking", visible: true, displayOrder: 5 }
];

const experience = [
  {
    id: 1,
    company: "Freelance",
    position: "Full Stack & DevOps Engineer",
    description: "Designing modern web applications and cloud infrastructure solutions for global clients.",
    startDate: "2023-01-01",
    endDate: "Present",
    currentPosition: true,
    companyLogo: "",
    displayOrder: 1,
    createdAt: new Date().toISOString()
  }
];

const messages = [
  {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    subject: "Collaboration Opportunity",
    message: "Hello Ahmed, I liked your DevOps and Web development portfolio!",
    read: false,
    createdAt: new Date().toISOString()
  }
];

const settings = {
  siteTitle: "Ahmed El-Falah | Portfolio",
  adminEmail: "ahmed@example.com",
  maintenanceMode: "false"
};

function signJwt(payload, secret) {
  const header = Buffer.from(JSON.stringify({ alg: "HS256", typ: "JWT" })).toString("base64url");
  const body = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signature = crypto.createHmac("sha256", secret).update(`${header}.${body}`).digest("base64url");
  return `${header}.${body}.${signature}`;
}

export default function handler(req, res) {
  try {
    const rawUrl = req.headers["x-forwarded-uri"] || req.headers["x-matched-path"] || req.url || "";
    const pathname = rawUrl.split("?")[0].replace(/\/$/, "");

    if (pathname === "/api/auth/login") {
      if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
      let body = req.body;
      if (typeof body === "string") { try { body = JSON.parse(body); } catch(e){} }
      body = body || {};
      const adminPassword = process.env.ADMIN_PASSWORD || "ahmedkhaled18102005";
      if (body.password !== adminPassword) {
        return res.status(401).json({ error: "Invalid password" });
      }
      const token = signJwt({ role: "admin", exp: Math.floor(Date.now() / 1000) + 86400 * 7 }, process.env.SESSION_SECRET || "secret");
      return res.status(200).json({ token });
    }

    if (pathname === "/api/auth/me") {
      const auth = req.headers.authorization || "";
      const token = auth.replace("Bearer ", "").trim();
      if (!token) return res.status(401).json({ authenticated: false });
      return res.status(200).json({ authenticated: true, role: "admin" });
    }

    if (pathname === "/api/healthz") {
      return res.status(200).json({ status: "ok" });
    }

    if (pathname === "/api/admin/stats") {
      const unread = messages.filter(m => !m.read).length;
      return res.status(200).json({
        success: true,
        data: {
          projects: projects.length,
          skills: skills.length,
          experience: experience.length,
          messages: messages.length,
          unreadMessages: unread
        }
      });
    }

    if (pathname === "/api/admin/projects" || pathname === "/api/projects") {
      if (req.method === "GET") {
        const data = pathname === "/api/projects" ? projects.filter(p => p.status === "published") : projects;
        return res.status(200).json({ success: true, data });
      }
      if (req.method === "POST") {
        let body = req.body;
        if (typeof body === "string") { try { body = JSON.parse(body); } catch(e){} }
        body = body || {};
        const newProj = { id: Date.now(), title: body.title || "New Project", status: body.status || "draft", ...body };
        projects.push(newProj);
        return res.status(200).json({ success: true, data: newProj });
      }
    }

    if (pathname === "/api/admin/skills" || pathname === "/api/skills") {
      if (req.method === "GET") {
        const data = pathname === "/api/skills" ? skills.filter(s => s.visible) : skills;
        return res.status(200).json({ success: true, data });
      }
      if (req.method === "POST") {
        let body = req.body;
        if (typeof body === "string") { try { body = JSON.parse(body); } catch(e){} }
        body = body || {};
        const newSkill = { id: Date.now(), name: body.name || "New Skill", visible: true, ...body };
        skills.push(newSkill);
        return res.status(200).json({ success: true, data: newSkill });
      }
    }

    if (pathname === "/api/admin/experience" || pathname === "/api/experience") {
      if (req.method === "GET") {
        return res.status(200).json({ success: true, data: experience });
      }
      if (req.method === "POST") {
        let body = req.body;
        if (typeof body === "string") { try { body = JSON.parse(body); } catch(e){} }
        body = body || {};
        const newExp = { id: Date.now(), company: body.company || "Company", ...body };
        experience.push(newExp);
        return res.status(200).json({ success: true, data: newExp });
      }
    }

    if (pathname === "/api/admin/messages" || pathname === "/api/messages") {
      if (req.method === "GET") {
        return res.status(200).json({ success: true, data: messages });
      }
      if (req.method === "POST") {
        let body = req.body;
        if (typeof body === "string") { try { body = JSON.parse(body); } catch(e){} }
        body = body || {};
        const newMsg = { id: Date.now(), name: body.name || "Anonymous", read: false, ...body };
        messages.push(newMsg);
        return res.status(200).json({ success: true, data: { ok: true } });
      }
    }

    if (pathname === "/api/admin/settings") {
      if (req.method === "GET") {
        return res.status(200).json({ success: true, data: settings });
      }
      if (req.method === "PUT") {
        let body = req.body;
        if (typeof body === "string") { try { body = JSON.parse(body); } catch(e){} }
        Object.assign(settings, body || {});
        return res.status(200).json({ success: true, data: { ok: true } });
      }
    }

    return res.status(404).json({ error: `Route not found: ${pathname} (raw: ${rawUrl})` });
  } catch (err) {
    return res.status(500).json({ success: false, error: err ? err.message : "Server error" });
  }
}
