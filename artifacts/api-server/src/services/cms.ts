import { cmsRepository } from "../repositories/cms.js";

export class NotFoundError extends Error {}
const one = async <T>(operation: Promise<T[]>) => { const [row] = await operation; if (!row) throw new NotFoundError("Not found"); return row; };

export const cmsService = {
  getProjects: (publishedOnly = false) => cmsRepository.projects(publishedOnly),
  getSkills: (visibleOnly = false) => cmsRepository.skills(visibleOnly),
  getExperience: () => cmsRepository.experience(),
  getMessages: () => cmsRepository.messages(),
  createMessage: (data: Parameters<typeof cmsRepository.createMessage>[0]) => one(cmsRepository.createMessage(data)),
  getDashboardStats: () => cmsRepository.stats(),
  createProject: (data: Parameters<typeof cmsRepository.createProject>[0]) => one(cmsRepository.createProject(data)),
  updateProject: (id: number, data: Parameters<typeof cmsRepository.updateProject>[1]) => one(cmsRepository.updateProject(id, data)),
  deleteProject: (id: number) => one(cmsRepository.deleteProject(id)),
  createSkill: (data: Parameters<typeof cmsRepository.createSkill>[0]) => one(cmsRepository.createSkill(data)),
  updateSkill: (id: number, data: Parameters<typeof cmsRepository.updateSkill>[1]) => one(cmsRepository.updateSkill(id, data)),
  deleteSkill: (id: number) => one(cmsRepository.deleteSkill(id)),
  createExperience: (data: Parameters<typeof cmsRepository.createExperience>[0]) => one(cmsRepository.createExperience(data)),
  updateExperience: (id: number, data: Parameters<typeof cmsRepository.updateExperience>[1]) => one(cmsRepository.updateExperience(id, data)),
  deleteExperience: (id: number) => one(cmsRepository.deleteExperience(id)),
  markMessageRead: (id: number) => one(cmsRepository.markMessageRead(id)),
  deleteMessage: (id: number) => one(cmsRepository.deleteMessage(id)),
};
