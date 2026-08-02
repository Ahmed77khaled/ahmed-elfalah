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

function endSession(): void {
  clearToken();
  window.dispatchEvent(new Event("admin-session-expired"));
}

export async function validateSession(): Promise<boolean> {
  const token = getToken();
  if (!token) return false;

  try {
    const res = await fetch(`${BASE}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) return true;
  } catch {
    return false;
  }

  endSession();
  return false;
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
  try {
    const res = await fetch(`${BASE}${path}`, {
      method,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
    });
    if (res.status === 401 || res.status === 403) {
      endSession();
      throw new Error("Session expired");
    }
    const payload = await res.json() as { success?: boolean; data?: T; error?: string };
    if (res.ok && payload.success) {
      if (method !== "GET") window.dispatchEvent(new Event("cms-data-changed"));
      return payload.data as T;
    }
    throw new Error(payload.error ?? "Request failed");
  } catch {
    throw new Error("Request failed");
  }
}

export const api = {
  login: async (password: string): Promise<{ token: string }> => {
    const res = await fetch(`${BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    if (!res.ok) throw new Error("Invalid password");
    return res.json();
  },

  stats: () => request<DashboardStats>("GET", "/admin/stats"),
  health: async (): Promise<{ status: string }> => {
    const res = await fetch(`${BASE}/healthz`);
    if (!res.ok) throw new Error("Health check failed");
    return res.json() as Promise<{ status: string }>;
  },
  getPublicProjects: () => request<ProjectRow[]>("GET", "/projects"),
  getPublicSkills: () => request<SkillRow[]>("GET", "/skills"),
  getPublicExperience: () => request<ExperienceRow[]>("GET", "/experience"),

  // Reminders
  getReminders: () => request<ReminderRow[]>("GET", "/admin/reminders"),
  createReminder: (data: ReminderPayload) => request<ReminderRow>("POST", "/admin/reminders", data),
  updateReminder: (id: number, data: ReminderPayload) => request<ReminderRow>("PUT", `/admin/reminders/${id}`, data),
  deleteReminder: (id: number) => request<{ id: number }>("DELETE", `/admin/reminders/${id}`),

  // Projects
  getProjects: () => request<ProjectRow[]>("GET", "/admin/projects"),
  createProject: (data: ProjectPayload) =>
    request<ProjectRow>("POST", "/admin/projects", data),
  updateProject: (id: number, data: Partial<ProjectPayload>) =>
    request<ProjectRow>("PUT", `/admin/projects/${id}`, data),
  deleteProject: (id: number) =>
    request<{ id: number }>("DELETE", `/admin/projects/${id}`),

  // Gallery media
  uploadMedia: async (file: File): Promise<MediaUpload> => {
    const supported = ["image/png", "image/jpeg", "image/webp"];
    if (!supported.includes(file.type)) throw new Error("Use a PNG, JPG, or WebP image");
    if (file.size > 3 * 1024 * 1024) throw new Error("Image must be 3 MB or smaller");
    const dataUrl = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = () => reject(new Error("Could not read image"));
      reader.onload = () => resolve(String(reader.result));
      reader.readAsDataURL(file);
    });
    return request<MediaUpload>("POST", "/admin/media", { filename: file.name, dataUrl });
  },
  deleteMedia: (id: number) => request<{ id: number }>("DELETE", `/admin/media/${id}`),

  // Skills
  getSkills: () => request<SkillRow[]>("GET", "/admin/skills"),
  createSkill: (data: SkillPayload) =>
    request<SkillRow>("POST", "/admin/skills", data),
  updateSkill: (id: number, data: Partial<SkillPayload>) =>
    request<SkillRow>("PUT", `/admin/skills/${id}`, data),
  deleteSkill: (id: number) =>
    request<{ id: number }>("DELETE", `/admin/skills/${id}`),

  // Experience
  getExperience: () => request<ExperienceRow[]>("GET", "/admin/experience"),
  createExperience: (data: ExperiencePayload) =>
    request<ExperienceRow>("POST", "/admin/experience", data),
  updateExperience: (id: number, data: Partial<ExperiencePayload>) =>
    request<ExperienceRow>("PUT", `/admin/experience/${id}`, data),
  deleteExperience: (id: number) =>
    request<{ id: number }>("DELETE", `/admin/experience/${id}`),

  // Messages
  getMessages: () => request<MessageRow[]>("GET", "/admin/messages"),
  markRead: (id: number) =>
    request<MessageRow>("PUT", `/admin/messages/${id}/read`),
  deleteMessage: (id: number) =>
    request<{ id: number }>("DELETE", `/admin/messages/${id}`),

  // Settings
  getSettings: () => request<Record<string, string>>("GET", "/admin/settings"),
  saveSettings: (data: Record<string, string>) =>
    request<{ ok: boolean }>("PUT", "/admin/settings", data),
};

export interface DashboardStats { projects: number; skills: number; experience: number; messages: number; unreadMessages: number; }

export interface MediaUpload {
  id: number;
  filename: string;
  mimeType: string;
  createdAt: string;
  url: string;
}

export interface ReminderRow {
  id: number;
  title: string;
  dueDate: string;
  notes: string;
  status: "pending" | "completed";
  notifiedBefore: boolean;
  notifiedDue: boolean;
  createdAt: string;
  completedAt: string | null;
}
export type ReminderPayload = Pick<ReminderRow, "title" | "dueDate" | "notes" | "status">;

// Shared types (mirrors DB schema)
export interface ProjectRow {
  id: number;
  title: string;
  subtitle: string;
  shortDescription: string;
  longDescription: string;
  coverImage: string;
  coverImagePosition: string;
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
  type?: string;
  galleryImages?: string[];
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
