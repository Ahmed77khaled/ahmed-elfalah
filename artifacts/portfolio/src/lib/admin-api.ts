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

async function request<T>(
  method: string,
  path: string,
  body?: unknown,
): Promise<T> {
  const token = getToken();
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error((err as { error?: string }).error ?? res.statusText);
  }
  return res.json() as Promise<T>;
}

export const api = {
  login: (password: string) =>
    request<{ token: string }>("POST", "/auth/login", { password }),

  stats: () =>
    request<{
      projects: number;
      skills: number;
      experience: number;
      messages: number;
      unreadMessages: number;
    }>("GET", "/admin/stats"),

  // Projects
  getProjects: () => request<ProjectRow[]>("GET", "/admin/projects"),
  createProject: (data: ProjectPayload) =>
    request<ProjectRow>("POST", "/admin/projects", data),
  updateProject: (id: number, data: Partial<ProjectPayload>) =>
    request<ProjectRow>("PUT", `/admin/projects/${id}`, data),
  deleteProject: (id: number) =>
    request<{ ok: boolean }>("DELETE", `/admin/projects/${id}`),

  // Skills
  getSkills: () => request<SkillRow[]>("GET", "/admin/skills"),
  createSkill: (data: SkillPayload) =>
    request<SkillRow>("POST", "/admin/skills", data),
  updateSkill: (id: number, data: Partial<SkillPayload>) =>
    request<SkillRow>("PUT", `/admin/skills/${id}`, data),
  deleteSkill: (id: number) =>
    request<{ ok: boolean }>("DELETE", `/admin/skills/${id}`),

  // Experience
  getExperience: () => request<ExperienceRow[]>("GET", "/admin/experience"),
  createExperience: (data: ExperiencePayload) =>
    request<ExperienceRow>("POST", "/admin/experience", data),
  updateExperience: (id: number, data: Partial<ExperiencePayload>) =>
    request<ExperienceRow>("PUT", `/admin/experience/${id}`, data),
  deleteExperience: (id: number) =>
    request<{ ok: boolean }>("DELETE", `/admin/experience/${id}`),

  // Messages
  getMessages: () => request<MessageRow[]>("GET", "/admin/messages"),
  markRead: (id: number) =>
    request<MessageRow>("PUT", `/admin/messages/${id}/read`),
  deleteMessage: (id: number) =>
    request<{ ok: boolean }>("DELETE", `/admin/messages/${id}`),

  // Settings
  getSettings: () => request<Record<string, string>>("GET", "/admin/settings"),
  saveSettings: (data: Record<string, string>) =>
    request<{ ok: boolean }>("PUT", "/admin/settings", data),
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
