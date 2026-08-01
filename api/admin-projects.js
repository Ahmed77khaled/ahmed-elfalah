import process from "node:process";

const sampleProjects = [
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

export default function handler(req, res) {
  if (req.method === "GET") {
    return res.status(200).json({ success: true, data: sampleProjects });
  }
  if (req.method === "POST") {
    let body = req.body;
    if (typeof body === "string") { try { body = JSON.parse(body); } catch(e){} }
    body = body || {};
    const newProj = { id: Date.now(), title: body.title || "New Project", status: body.status || "draft", ...body };
    return res.status(200).json({ success: true, data: newProj });
  }
  return res.status(405).json({ error: "Method not allowed" });
}
