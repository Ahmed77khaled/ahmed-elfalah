export const projects = [
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

export const skills = [
  { id: 1, name: "Python", icon: "code", percentage: 90, category: "Backend", visible: true, displayOrder: 1 },
  { id: 2, name: "DevOps & Docker", icon: "container", percentage: 85, category: "DevOps", visible: true, displayOrder: 2 },
  { id: 3, name: "Linux Administration", icon: "terminal", percentage: 88, category: "Infrastructure", visible: true, displayOrder: 3 },
  { id: 4, name: "React & TypeScript", icon: "layout", percentage: 82, category: "Frontend", visible: true, displayOrder: 4 },
  { id: 5, name: "Networking & Security", icon: "shield", percentage: 80, category: "Networking", visible: true, displayOrder: 5 }
];

export const experience = [
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

export const messages = [
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

export const settings = {
  siteTitle: "Ahmed El-Falah | Portfolio",
  adminEmail: "ahmed@example.com",
  maintenanceMode: "false"
};

const store = {
  projects,
  skills,
  experience,
  messages,
  settings,
};

export default store;
