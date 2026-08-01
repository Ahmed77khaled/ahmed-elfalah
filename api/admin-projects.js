import store from "./_store.js";

export default function handler(req, res) {
  if (req.method === "GET") {
    return res.status(200).json({ success: true, data: store.projects });
  }
  if (req.method === "POST") {
    let body = req.body;
    if (typeof body === "string") { try { body = JSON.parse(body); } catch(e){} }
    body = body || {};
    const newProj = {
      id: Date.now(),
      title: body.title || "New Project",
      subtitle: body.subtitle || "",
      shortDescription: body.shortDescription || "",
      longDescription: body.longDescription || "",
      coverImage: body.coverImage || "",
      galleryImages: body.galleryImages || [],
      githubUrl: body.githubUrl || "",
      demoUrl: body.demoUrl || "",
      techStack: body.techStack || [],
      features: body.features || [],
      category: body.category || "General",
      status: body.status || "draft",
      featured: Boolean(body.featured),
      displayOrder: body.displayOrder || store.projects.length + 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    store.projects.push(newProj);
    return res.status(200).json({ success: true, data: newProj });
  }
  return res.status(405).json({ error: "Method not allowed" });
}
