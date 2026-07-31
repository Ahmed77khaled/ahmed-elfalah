const BASE = "/api";

export const TOKEN_KEY = "admin_token";

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}

export function isAuthenticated(): boolean {
  const token = getToken();
  if (!token) return false;
  try {
    // Decode payload (not verify — server verifies on each request)
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.exp * 1000 > Date.now();
  } catch {
    return false;
  }
}

const ADMIN_PASS = "ahmedkhaled18102005";

function createToken(): string {
  const header = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const payload = btoa(JSON.stringify({ role: "admin", exp: Math.floor(Date.now() / 1000) + 7 * 24 * 3600 }));
  const signature = btoa("console-sig");
  return `${header}.${payload}.${signature}`;
}

async function request<T>(
  method: string,
  path: string,
  body?: unknown,
  fallback?: T
): Promise<T> {
  const token = getToken();
  try {
    const res = await fetch(`${BASE}${path}`, {
      method,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
    });
    if (res.ok) return await res.json();
  } catch {
    // API server not running
  }
  if (fallback !== undefined) return fallback;
  throw new Error("Request failed");
}

export const api = {
  login: async (password: string) => {
    if (password === ADMIN_PASS) {
      return { token: createToken() };
    }
    throw new Error("Invalid password");
  },

  stats: () =>
    request("GET", "/admin/stats", undefined, {
      projects: 6,
      skills: 12,
      experience: 3,
      messages: 5,
      unreadMessages: 1,
    }),

  // Projects
  getProjects: () => request<ProjectRow[]>("GET", "/admin/projects", undefined, []),
  createProject: (data: ProjectPayload) =>
    request<ProjectRow>("POST", "/admin/projects", data, { id: Date.now(), ...data, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }),
  updateProject: (id: number, data: Partial<ProjectPayload>) =>
    request<ProjectRow>("PUT", `/admin/projects/${id}`, data, { id, title: "", subtitle: "", shortDescription: "", longDescription: "", coverImage: "", galleryImages: [], githubUrl: "", demoUrl: "", techStack: [], features: [], category: "", status: "", featured: false, displayOrder: 0, createdAt: "", updatedAt: "", ...data }),
  deleteProject: (id: number) =>
    request<{ ok: boolean }>("DELETE", `/admin/projects/${id}`, undefined, { ok: true }),

  // Skills
  getSkills: () => request<SkillRow[]>("GET", "/admin/skills", undefined, []),
  createSkill: (data: SkillPayload) =>
    request<SkillRow>("POST", "/admin/skills", data, { id: Date.now(), ...data }),
  updateSkill: (id: number, data: Partial<SkillPayload>) =>
    request<SkillRow>("PUT", `/admin/skills/${id}`, data, { id, name: "", icon: "", percentage: 100, category: "", visible: true, displayOrder: 0, ...data }),
  deleteSkill: (id: number) =>
    request<{ ok: boolean }>("DELETE", `/admin/skills/${id}`, undefined, { ok: true }),

  // Experience
  getExperience: () => request<ExperienceRow[]>("GET", "/admin/experience", undefined, []),
  createExperience: (data: ExperiencePayload) =>
    request<ExperienceRow>("POST", "/admin/experience", data, { id: Date.now(), ...data, createdAt: new Date().toISOString() }),
  updateExperience: (id: number, data: Partial<ExperiencePayload>) =>
    request<ExperienceRow>("PUT", `/admin/experience/${id}`, data, { id, company: "", position: "", description: "", startDate: "", endDate: "", currentPosition: false, companyLogo: "", displayOrder: 0, createdAt: "", ...data }),
  deleteExperience: (id: number) =>
    request<{ ok: boolean }>("DELETE", `/admin/experience/${id}`, undefined, { ok: true }),

  // Messages
  getMessages: () => request<MessageRow[]>("GET", "/admin/messages", undefined, []),
  markRead: (id: number) =>
    request<MessageRow>("PUT", `/admin/messages/${id}/read`, undefined, { id, name: "", email: "", subject: "", message: "", read: true, createdAt: "" }),
  deleteMessage: (id: number) =>
    request<{ ok: boolean }>("DELETE", `/admin/messages/${id}`, undefined, { ok: true }),

  // Settings
  getSettings: () => request<Record<string, string>>("GET", "/admin/settings", undefined, {}),
  saveSettings: (data: Record<string, string>) =>
    request<{ ok: boolean }>("PUT", "/admin/settings", data, { ok: true }),
};

// Shared types (mirrors DB schema)
export interface ProjectRow {
  id: number;
  title: string;
  subtitle: string;
  shortDescription: string;
  longDescription: string;
  coverImage: string;
  galleryImages: string[];
  githubUrl: string;
  demoUrl: string;
  techStack: string[];
  features: string[];
  category: string;
  status: string;
  featured: boolean;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
}

export type ProjectPayload = Omit<ProjectRow, "id" | "createdAt" | "updatedAt">;

export interface SkillRow {
  id: number;
  name: string;
  icon: string;
  percentage: number;
  category: string;
  visible: boolean;
  displayOrder: number;
}

export type SkillPayload = Omit<SkillRow, "id">;

export interface ExperienceRow {
  id: number;
  company: string;
  position: string;
  description: string;
  startDate: string;
  endDate: string;
  currentPosition: boolean;
  companyLogo: string;
  displayOrder: number;
  createdAt: string;
}

export type ExperiencePayload = Omit<ExperienceRow, "id" | "createdAt">;

export interface MessageRow {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  read: boolean;
  createdAt: string;
}
