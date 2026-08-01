import { query } from "./_db.js";

export const projectColumns = `id, title, subtitle, short_description AS "shortDescription", long_description AS "longDescription", cover_image AS "coverImage", gallery_images AS "galleryImages", github_url AS "githubUrl", demo_url AS "demoUrl", tech_stack AS "techStack", features, category, status, featured, display_order AS "displayOrder", created_at AS "createdAt", updated_at AS "updatedAt"`;
export const skillColumns = `id, name, icon, percentage, category, visible, display_order AS "displayOrder"`;
export const experienceColumns = `id, company, position, description, start_date AS "startDate", end_date AS "endDate", current_position AS "currentPosition", company_logo AS "companyLogo", display_order AS "displayOrder", created_at AS "createdAt"`;
export const messageColumns = `id, name, email, subject, message, read, created_at AS "createdAt"`;

export async function saveProject(body, id) {
  const values = [body.title ?? "", body.subtitle ?? "", body.shortDescription ?? "", body.longDescription ?? "", body.coverImage ?? "", JSON.stringify(body.galleryImages ?? []), body.githubUrl ?? "", body.demoUrl ?? "", JSON.stringify(body.techStack ?? []), JSON.stringify(body.features ?? []), body.category ?? "", body.status ?? "published", body.featured ?? false, body.displayOrder ?? 0];
  if (!id) return query(`INSERT INTO projects (title,subtitle,short_description,long_description,cover_image,gallery_images,github_url,demo_url,tech_stack,features,category,status,featured,display_order) VALUES ($1,$2,$3,$4,$5,$6::jsonb,$7,$8,$9::jsonb,$10::jsonb,$11,$12,$13,$14) RETURNING ${projectColumns}`, values);
  return query(`UPDATE projects SET title=$1,subtitle=$2,short_description=$3,long_description=$4,cover_image=$5,gallery_images=$6::jsonb,github_url=$7,demo_url=$8,tech_stack=$9::jsonb,features=$10::jsonb,category=$11,status=$12,featured=$13,display_order=$14,updated_at=NOW() WHERE id=$15 RETURNING ${projectColumns}`, [...values, id]);
}
