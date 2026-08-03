import crypto from "node:crypto";
import pg from "pg";

// ─── DB ───────────────────────────────────────────────────────────────────────
const { Pool } = pg;
const globalForDb = globalThis;

function database() {
  if (!process.env.DATABASE_URL) {
    const error = new Error("DATABASE_URL is not configured");
    error.statusCode = 503;
    throw error;
  }
  if (!globalForDb.portfolioPool) {
    globalForDb.portfolioPool = new Pool({ connectionString: process.env.DATABASE_URL, max: 1 });
  }
  return globalForDb.portfolioPool;
}

async function query(sql, values = []) {
  return database().query(sql, values);
}

function sendDatabaseError(res, error) {
  const status = error?.statusCode === 503 ? 503 : 500;
  return res.status(status).json({ success: false, error: status === 503 ? error.message : "Database request failed" });
}

// ─── JWT ──────────────────────────────────────────────────────────────────────
function encode(value) {
  return Buffer.from(JSON.stringify(value)).toString("base64url");
}

function timingSafeEqual(left, right) {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);
  return leftBuffer.length === rightBuffer.length && crypto.timingSafeEqual(leftBuffer, rightBuffer);
}

function signAdminToken() {
  const secret = process.env.SESSION_SECRET;
  if (!secret) throw new Error("SESSION_SECRET is not configured");
  const header = encode({ alg: "HS256", typ: "JWT" });
  const payload = encode({ role: "admin", exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7 });
  const signature = crypto.createHmac("sha256", secret).update(`${header}.${payload}`).digest("base64url");
  return `${header}.${payload}.${signature}`;
}

function requireAdmin(req, res) {
  const secret = process.env.SESSION_SECRET;
  const token = (req.headers.authorization || "").replace(/^Bearer\s+/i, "").trim();
  const [header, payload, signature] = token.split(".");
  if (!secret || !header || !payload || !signature) { res.status(401).json({ error: "Unauthorized" }); return false; }
  const expected = crypto.createHmac("sha256", secret).update(`${header}.${payload}`).digest("base64url");
  try {
    const claims = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
    if (!timingSafeEqual(signature, expected) || claims.role !== "admin" || claims.exp * 1000 <= Date.now()) {
      res.status(401).json({ error: "Unauthorized" }); return false;
    }
  } catch { res.status(401).json({ error: "Unauthorized" }); return false; }
  return true;
}

// ─── CMS Columns ─────────────────────────────────────────────────────────────
const projectColumns = `id, title, subtitle, short_description AS "shortDescription", long_description AS "longDescription", cover_image AS "coverImage", cover_image_position AS "coverImagePosition", gallery_images AS "galleryImages", github_url AS "githubUrl", demo_url AS "demoUrl", tech_stack AS "techStack", features, category, status, featured, display_order AS "displayOrder", created_at AS "createdAt", updated_at AS "updatedAt"`;
const skillColumns = `id, name, icon, percentage, category, visible, display_order AS "displayOrder"`;
const experienceColumns = `id, company, position, description, start_date AS "startDate", end_date AS "endDate", current_position AS "currentPosition", company_logo AS "companyLogo", type, gallery_images AS "galleryImages", display_order AS "displayOrder", created_at AS "createdAt"`;
const messageColumns = `id, name, email, subject, message, read, created_at AS "createdAt"`;
const reminderColumns = `id, title, TO_CHAR(due_date, 'YYYY-MM-DD') AS "dueDate", notes, status, notified_before AS "notifiedBefore", notified_due AS "notifiedDue", created_at AS "createdAt", completed_at AS "completedAt"`;
const mediaColumns = `id, filename, mime_type AS "mimeType", created_at AS "createdAt"`;
const journeyColumns = `id, title, subtitle, description, TO_CHAR(event_date, 'YYYY-MM-DD') AS "eventDate", category, tags, image_url AS "imageUrl", image_caption AS "imageCaption", gallery_images AS "galleryImages", highlight, display_order AS "displayOrder", created_at AS "createdAt"`;

async function saveProject(body, id) {
  const values = [body.title ?? "", body.subtitle ?? "", body.shortDescription ?? "", body.longDescription ?? "", body.coverImage ?? "", body.coverImagePosition ?? "center center", JSON.stringify(body.galleryImages ?? []), body.githubUrl ?? "", body.demoUrl ?? "", JSON.stringify(body.techStack ?? []), JSON.stringify(body.features ?? []), body.category ?? "", body.status ?? "published", body.featured ?? false, body.displayOrder ?? 0];
  if (!id) return query(`INSERT INTO projects (title,subtitle,short_description,long_description,cover_image,cover_image_position,gallery_images,github_url,demo_url,tech_stack,features,category,status,featured,display_order) VALUES ($1,$2,$3,$4,$5,$6,$7::jsonb,$8,$9,$10::jsonb,$11::jsonb,$12,$13,$14,$15) RETURNING ${projectColumns}`, values);
  return query(`UPDATE projects SET title=$1,subtitle=$2,short_description=$3,long_description=$4,cover_image=$5,cover_image_position=$6,gallery_images=$7::jsonb,github_url=$8,demo_url=$9,tech_stack=$10::jsonb,features=$11::jsonb,category=$12,status=$13,featured=$14,display_order=$15,updated_at=NOW() WHERE id=$16 RETURNING ${projectColumns}`, [...values, id]);
}

// ─── CORS Helper ──────────────────────────────────────────────────────────────
function setCors(req, res) {
  const origin = process.env.CORS_ORIGIN || "*";
  res.setHeader("Access-Control-Allow-Origin", origin);
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type,Authorization");
  if (req.method === "OPTIONS") { res.status(204).end(); return true; }
  return false;
}

// ─── Route Handlers ───────────────────────────────────────────────────────────

async function handleHealthz(req, res) {
  return res.status(200).json({ status: "ok" });
}

async function handleProjects(req, res) {
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });
  try {
    res.setHeader("Cache-Control", "public, max-age=60, s-maxage=300, stale-while-revalidate=600");
    const { rows } = await query(`SELECT ${projectColumns} FROM projects WHERE status = 'published' ORDER BY display_order, id`);
    return res.status(200).json({ success: true, data: rows });
  } catch (error) { return sendDatabaseError(res, error); }
}

async function handleSkills(req, res) {
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });
  try {
    res.setHeader("Cache-Control", "public, max-age=60, s-maxage=300, stale-while-revalidate=600");
    const { rows } = await query(`SELECT ${skillColumns} FROM skills WHERE visible = true ORDER BY display_order, id`);
    return res.status(200).json({ success: true, data: rows });
  } catch (error) { return sendDatabaseError(res, error); }
}

async function handleExperience(req, res) {
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });
  try {
    res.setHeader("Cache-Control", "public, max-age=60, s-maxage=300, stale-while-revalidate=600");
    const { rows } = await query(`SELECT ${experienceColumns} FROM experience ORDER BY display_order, id`);
    return res.status(200).json({ success: true, data: rows });
  } catch (error) { return sendDatabaseError(res, error); }
}

let journeyTableEnsured = false;
async function ensureJourneyTable() {
  if (journeyTableEnsured) return;
  await query(`CREATE TABLE IF NOT EXISTS journey (
    id            SERIAL PRIMARY KEY,
    title         TEXT NOT NULL,
    subtitle      TEXT NOT NULL DEFAULT '',
    description   TEXT NOT NULL DEFAULT '',
    event_date    DATE NOT NULL,
    category      TEXT NOT NULL DEFAULT 'education',
    tags          JSONB NOT NULL DEFAULT '[]'::jsonb,
    image_url     TEXT NOT NULL DEFAULT '',
    image_caption TEXT NOT NULL DEFAULT '',
    gallery_images JSONB NOT NULL DEFAULT '[]'::jsonb,
    highlight     BOOLEAN NOT NULL DEFAULT FALSE,
    display_order INTEGER NOT NULL DEFAULT 0,
    created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
  )`);
  await query(`ALTER TABLE journey ADD COLUMN IF NOT EXISTS gallery_images JSONB NOT NULL DEFAULT '[]'::jsonb`);
  journeyTableEnsured = true;
}

async function handleJourney(req, res) {
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });
  try {
    await ensureJourneyTable();
    res.setHeader("Cache-Control", "public, max-age=60, s-maxage=300, stale-while-revalidate=600");
    const { rows } = await query(`SELECT ${journeyColumns} FROM journey ORDER BY event_date ASC, display_order ASC, id ASC`);
    return res.status(200).json({ success: true, data: rows });
  } catch (error) { return sendDatabaseError(res, error); }
}

async function handleAdminJourney(req, res, rawId) {
  if (!requireAdmin(req, res)) return;
  const id = rawId !== undefined ? Number(rawId) : undefined;
  try {
    await ensureJourneyTable();
    if (req.method === "GET") {
      const { rows } = await query(`SELECT ${journeyColumns} FROM journey ORDER BY event_date ASC, display_order ASC, id ASC`);
      return res.status(200).json({ success: true, data: rows });
    }
    if (req.method === "POST") {
      const b = req.body ?? {};
      const values = [b.title ?? "", b.subtitle ?? "", b.description ?? "", b.eventDate ?? new Date().toISOString().slice(0, 10), b.category ?? "education", JSON.stringify(b.tags ?? []), b.imageUrl ?? "", b.imageCaption ?? "", JSON.stringify(b.galleryImages ?? []), b.highlight ?? false, b.displayOrder ?? 0];
      const { rows } = await query(`INSERT INTO journey (title,subtitle,description,event_date,category,tags,image_url,image_caption,gallery_images,highlight,display_order) VALUES ($1,$2,$3,$4,$5,$6::jsonb,$7,$8,$9::jsonb,$10,$11) RETURNING ${journeyColumns}`, values);
      return res.status(201).json({ success: true, data: rows[0] });
    }
    if (req.method === "PUT" && id && !Number.isNaN(id)) {
      const b = req.body ?? {};
      const values = [b.title ?? "", b.subtitle ?? "", b.description ?? "", b.eventDate ?? new Date().toISOString().slice(0, 10), b.category ?? "education", JSON.stringify(b.tags ?? []), b.imageUrl ?? "", b.imageCaption ?? "", JSON.stringify(b.galleryImages ?? []), b.highlight ?? false, b.displayOrder ?? 0, id];
      const { rows } = await query(`UPDATE journey SET title=$1,subtitle=$2,description=$3,event_date=$4,category=$5,tags=$6::jsonb,image_url=$7,image_caption=$8,gallery_images=$9::jsonb,highlight=$10,display_order=$11 WHERE id=$12 RETURNING ${journeyColumns}`, values);
      return rows[0] ? res.status(200).json({ success: true, data: rows[0] }) : res.status(404).json({ error: "Journey entry not found" });
    }
    if (req.method === "DELETE") {
      if (id === undefined || Number.isNaN(id)) {
        const { rows } = await query("DELETE FROM journey RETURNING id");
        return res.status(200).json({ success: true, deletedCount: rows.length });
      }
      const { rows } = await query("DELETE FROM journey WHERE id=$1 RETURNING id", [id]);
      return rows[0] ? res.status(200).json({ success: true, data: rows[0] }) : res.status(404).json({ error: "Journey entry not found" });
    }
    return res.status(405).json({ error: "Method not allowed" });
  } catch (error) { return sendDatabaseError(res, error); }
}

// ─── Notifications (Telegram & Email) ──────────────────────────────────────
// ─── Notifications (Telegram & Email) ──────────────────────────────────────
async function sendTelegramNotification(text, botType = "messages") {
  const token = botType === "visitors"
    ? (process.env.TELEGRAM_VISITORS_BOT_TOKEN || "8352050648:AAGLq-QTCZ-bxUNCDPVICq15n9XK6a71NpI")
    : (process.env.TELEGRAM_MESSAGES_BOT_TOKEN || "8790393178:AAEJKEMwituS7Exp9xmcDrLESF1_fUYqc8c");

  const chatId = process.env.TELEGRAM_CHAT_ID || "8275645729";
  if (!token || !chatId) return;

  try {
    await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: "HTML",
        disable_web_page_preview: true,
      }),
    });
  } catch (err) {
    console.error(`Telegram ${botType} notification error:`, err?.message || err);
  }
}

async function sendEmailNotification(name, email, subject, message) {
  const notifyEmail = process.env.NOTIFY_EMAIL || "ahmed.khaled.elfalah@gmail.com";

  try {
    // 1. Try Resend if API key configured
    if (process.env.RESEND_API_KEY) {
      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "Portfolio Notifications <onboarding@resend.dev>",
          to: [notifyEmail],
          subject: `📬 New Contact Message: ${subject}`,
          html: `<div style="font-family: sans-serif; padding: 20px;"><h2>New Contact Message</h2><p><b>From:</b> ${name} (${email})</p><p><b>Subject:</b> ${subject}</p><p><b>Message:</b></p><blockquote>${message}</blockquote></div>`,
        }),
      });
      return;
    }

    // 2. Fallback to FormSubmit for instant email delivery to Gmail
    await fetch(`https://formsubmit.co/ajax/${notifyEmail}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify({
        name,
        email,
        _subject: `📬 Portfolio Contact: ${subject}`,
        message: `From: ${name} (${email})\nSubject: ${subject}\n\nMessage:\n${message}`,
      }),
    });
  } catch (e) {
    console.error("Email notification error:", e?.message);
  }
}

async function handleMessages(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  const { name = "", email = "", subject = "", message = "" } = req.body || {};
  if (![name, email, subject, message].every((v) => typeof v === "string" && v.trim())) return res.status(400).json({ error: "All message fields are required" });
  try {
    await query("INSERT INTO messages (name,email,subject,message) VALUES ($1,$2,$3,$4)", [name.trim(), email.trim(), subject.trim(), message.trim()]);

    const tgText = `📬 <b>New Contact Form Submission</b>\n\n👤 <b>Name:</b> ${name.trim()}\n📧 <b>Email:</b> ${email.trim()}\n📌 <b>Subject:</b> ${subject.trim()}\n\n💬 <b>Message:</b>\n${message.trim()}`;

    // Await notifications before Vercel freezes execution
    await Promise.allSettled([
      sendTelegramNotification(tgText, "messages"),
      sendEmailNotification(name.trim(), email.trim(), subject.trim(), message.trim()),
    ]);

    return res.status(201).json({ success: true, data: { ok: true } });
  } catch (error) { return sendDatabaseError(res, error); }
}

async function handleTrackVisitor(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  const { page = "/", referrer = "" } = req.body || {};
  const ip = req.headers["x-forwarded-for"] || req.socket?.remoteAddress || "Unknown";

  const tgText = `👁️ <b>New Visitor on Website</b>\n\n📄 <b>Page:</b> ${page}\n🔗 <b>Referrer:</b> ${referrer || 'Direct / Bookmark'}\n🌐 <b>IP:</b> ${ip}`;
  await sendTelegramNotification(tgText, "visitors").catch(() => {});

  return res.status(200).json({ success: true });
}

async function handleAuthLogin(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  let body = req.body;
  if (typeof body === "string") { try { body = JSON.parse(body); } catch(e){} }
  body = body || {};
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword || !process.env.SESSION_SECRET) return res.status(503).json({ error: "Admin authentication is not configured" });
  if (body.password !== adminPassword) {
    await sendTelegramNotification(`⚠️ <b>Failed Admin Login Attempt</b>\nAn invalid password was entered for the Admin Dashboard.`, "visitors").catch(() => {});
    return res.status(401).json({ error: "Invalid password" });
  }
  await sendTelegramNotification(`🔐 <b>Successful Admin Login</b>\nAdmin logged into the Portfolio Dashboard.`, "visitors").catch(() => {});
  return res.status(200).json({ token: signAdminToken() });
}

async function handleAuthMe(req, res) {
  if (!requireAdmin(req, res)) return;
  return res.status(200).json({ authenticated: true, role: "admin" });
}

async function handleAdminProjects(req, res, id) {
  if (!requireAdmin(req, res)) return;
  try {
    if (req.method === "GET") return res.status(200).json({ success: true, data: (await query(`SELECT ${projectColumns} FROM projects ORDER BY display_order, id`)).rows });
    if (req.method === "POST") return res.status(201).json({ success: true, data: (await saveProject(req.body || {})).rows[0] });
    if (req.method === "PUT" && Number.isInteger(id)) { const row = (await saveProject(req.body || {}, id)).rows[0]; return row ? res.status(200).json({ success: true, data: row }) : res.status(404).json({ error: "Project not found" }); }
    if (req.method === "DELETE" && Number.isInteger(id)) { const row = (await query("DELETE FROM projects WHERE id=$1 RETURNING id", [id])).rows[0]; return row ? res.status(200).json({ success: true, data: row }) : res.status(404).json({ error: "Project not found" }); }
    return res.status(405).json({ error: "Method not allowed" });
  } catch (error) { return sendDatabaseError(res, error); }
}

async function handleAdminSkills(req, res, id) {
  if (!requireAdmin(req, res)) return;
  try {
    const body = req.body || {};
    if (req.method === "GET") return res.status(200).json({ success: true, data: (await query(`SELECT ${skillColumns} FROM skills ORDER BY display_order, id`)).rows });
    if (req.method === "POST") return res.status(201).json({ success: true, data: (await query(`INSERT INTO skills (name,icon,percentage,category,visible,display_order) VALUES ($1,$2,$3,$4,$5,$6) RETURNING ${skillColumns}`, [body.name || "", body.icon || "", body.percentage || 0, body.category || "", body.visible ?? true, body.displayOrder || 0])).rows[0] });
    if (req.method === "PUT" && Number.isInteger(id)) { const row = (await query(`UPDATE skills SET name=$1,icon=$2,percentage=$3,category=$4,visible=$5,display_order=$6 WHERE id=$7 RETURNING ${skillColumns}`, [body.name || "", body.icon || "", body.percentage || 0, body.category || "", body.visible ?? true, body.displayOrder || 0, id])).rows[0]; return row ? res.status(200).json({ success: true, data: row }) : res.status(404).json({ error: "Skill not found" }); }
    if (req.method === "DELETE" && Number.isInteger(id)) { const row = (await query("DELETE FROM skills WHERE id=$1 RETURNING id", [id])).rows[0]; return row ? res.status(200).json({ success: true, data: row }) : res.status(404).json({ error: "Skill not found" }); }
    return res.status(405).json({ error: "Method not allowed" });
  } catch (error) { return sendDatabaseError(res, error); }
}

async function handleAdminExperience(req, res, id) {
  if (!requireAdmin(req, res)) return;
  try {
    const body = req.body || {};
    const values = [body.company || "", body.position || "", body.description || "", body.startDate || "", body.endDate || "", body.currentPosition ?? false, body.companyLogo || "", body.type || "Training / Internship", JSON.stringify(body.galleryImages || []), body.displayOrder || 0];
    if (req.method === "GET") return res.status(200).json({ success: true, data: (await query(`SELECT ${experienceColumns} FROM experience ORDER BY display_order, id`)).rows });
    if (req.method === "POST") return res.status(201).json({ success: true, data: (await query(`INSERT INTO experience (company,position,description,start_date,end_date,current_position,company_logo,type,gallery_images,display_order) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9::jsonb,$10) RETURNING ${experienceColumns}`, values)).rows[0] });
    if (req.method === "PUT" && Number.isInteger(id)) { const row = (await query(`UPDATE experience SET company=$1,position=$2,description=$3,start_date=$4,end_date=$5,current_position=$6,company_logo=$7,type=$8,gallery_images=$9::jsonb,display_order=$10 WHERE id=$11 RETURNING ${experienceColumns}`, [...values, id])).rows[0]; return row ? res.status(200).json({ success: true, data: row }) : res.status(404).json({ error: "Experience not found" }); }
    if (req.method === "DELETE" && Number.isInteger(id)) { const row = (await query("DELETE FROM experience WHERE id=$1 RETURNING id", [id])).rows[0]; return row ? res.status(200).json({ success: true, data: row }) : res.status(404).json({ error: "Experience not found" }); }
    return res.status(405).json({ error: "Method not allowed" });
  } catch (error) { return sendDatabaseError(res, error); }
}

async function handleAdminMessages(req, res, id, action) {
  if (!requireAdmin(req, res)) return;
  try {
    if (req.method === "GET") return res.status(200).json({ success: true, data: (await query(`SELECT ${messageColumns} FROM messages ORDER BY created_at DESC`)).rows });
    if (req.method === "PUT" && action === "read" && Number.isInteger(id)) { const row = (await query(`UPDATE messages SET read=true WHERE id=$1 RETURNING ${messageColumns}`, [id])).rows[0]; return row ? res.status(200).json({ success: true, data: row }) : res.status(404).json({ error: "Message not found" }); }
    if (req.method === "DELETE" && Number.isInteger(id)) { const row = (await query("DELETE FROM messages WHERE id=$1 RETURNING id", [id])).rows[0]; return row ? res.status(200).json({ success: true, data: row }) : res.status(404).json({ error: "Message not found" }); }
    return res.status(405).json({ error: "Method not allowed" });
  } catch (error) { return sendDatabaseError(res, error); }
}

async function handleAdminSettings(req, res) {
  if (!requireAdmin(req, res)) return;
  try {
    if (req.method === "GET") { const { rows } = await query("SELECT key, value FROM settings ORDER BY key"); return res.status(200).json({ success: true, data: Object.fromEntries(rows.map((row) => [row.key, row.value])) }); }
    if (req.method === "PUT") { const entries = Object.entries(req.body || {}).filter(([key, value]) => typeof key === "string" && typeof value === "string"); await Promise.all(entries.map(([key, value]) => query("INSERT INTO settings (key,value,updated_at) VALUES ($1,$2,NOW()) ON CONFLICT (key) DO UPDATE SET value=EXCLUDED.value,updated_at=NOW()", [key, value]))); return res.status(200).json({ success: true, data: { ok: true } }); }
    return res.status(405).json({ error: "Method not allowed" });
  } catch (error) { return sendDatabaseError(res, error); }
}

async function handleAdminStats(req, res) {
  if (!requireAdmin(req, res)) return;
  try {
    const { rows: [stats] } = await query(`SELECT (SELECT count(*)::int FROM projects) AS projects, (SELECT count(*)::int FROM skills) AS skills, (SELECT count(*)::int FROM experience) AS experience, (SELECT count(*)::int FROM messages) AS messages, (SELECT count(*)::int FROM messages WHERE read=false) AS "unreadMessages"`);
    return res.status(200).json({ success: true, data: stats });
  } catch (error) { return sendDatabaseError(res, error); }
}

async function handleAdminReminders(req, res, id) {
  if (!requireAdmin(req, res)) return;
  try {
    const body = req.body || {};
    const values = [String(body.title || "").trim(), String(body.dueDate || "").trim(), String(body.notes || "").trim(), body.status === "completed" ? "completed" : "pending"];
    if (req.method === "GET") return res.status(200).json({ success: true, data: (await query(`SELECT ${reminderColumns} FROM reminders ORDER BY due_date ASC, id ASC`)).rows });
    if (req.method === "POST") {
      if (!values[0] || !/^\d{4}-\d{2}-\d{2}$/.test(values[1])) return res.status(400).json({ error: "Title and a valid due date are required" });
      const row = (await query(`INSERT INTO reminders (title,due_date,notes,status) VALUES ($1,$2,$3,$4) RETURNING ${reminderColumns}`, values)).rows[0];
      return res.status(201).json({ success: true, data: row });
    }
    if (req.method === "PUT" && Number.isInteger(id)) {
      if (!values[0] || !/^\d{4}-\d{2}-\d{2}$/.test(values[1])) return res.status(400).json({ error: "Title and a valid due date are required" });
      const row = (await query(`UPDATE reminders SET title=$1,due_date=$2,notes=$3,status=$4,completed_at=CASE WHEN $4='completed' THEN COALESCE(completed_at,NOW()) ELSE NULL END WHERE id=$5 RETURNING ${reminderColumns}`, [...values, id])).rows[0];
      return row ? res.status(200).json({ success: true, data: row }) : res.status(404).json({ error: "Reminder not found" });
    }
    if (req.method === "DELETE" && Number.isInteger(id)) { const row = (await query("DELETE FROM reminders WHERE id=$1 RETURNING id", [id])).rows[0]; return row ? res.status(200).json({ success: true, data: row }) : res.status(404).json({ error: "Reminder not found" }); }
    return res.status(405).json({ error: "Method not allowed" });
  } catch (error) { return sendDatabaseError(res, error); }
}

function cairoDate(offset = 0) {
  const parts = new Intl.DateTimeFormat("en-CA", { timeZone: "Africa/Cairo", year: "numeric", month: "2-digit", day: "2-digit" }).formatToParts(new Date());
  const get = (type) => parts.find((part) => part.type === type)?.value;
  const date = new Date(Date.UTC(Number(get("year")), Number(get("month")) - 1, Number(get("day")) + offset));
  return date.toISOString().slice(0, 10);
}

async function handleReminderCron(req, res) {
  const secret = process.env.CRON_SECRET;
  if (!secret || req.headers.authorization !== `Bearer ${secret}`) return res.status(401).json({ error: "Unauthorized" });
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });
  try {
    const today = cairoDate();
    const tomorrow = cairoDate(1);
    const { rows } = await query(`SELECT ${reminderColumns} FROM reminders WHERE status='pending' AND ((due_date=$1 AND notified_due=false) OR (due_date=$2 AND notified_before=false))`, [today, tomorrow]);
    const sent = [];
    for (const reminder of rows) {
      const dueToday = reminder.dueDate === today;
      const flag = dueToday ? "notified_due" : "notified_before";
      const updated = (await query(`UPDATE reminders SET ${flag}=true WHERE id=$1 AND ${flag}=false RETURNING id`, [reminder.id])).rows[0];
      if (!updated) continue;
      const timing = dueToday ? "is due today" : "is due tomorrow";
      const text = `⏰ <b>Portfolio follow-up reminder</b>\n\n<b>${reminder.title}</b> ${timing}.\n\nNext steps:\n• Add certificate or completion proof\n• Add clear photos/screenshots\n• Add verification link or credential ID\n• Add labs/project outcomes\n${reminder.notes ? `\nNotes: ${reminder.notes}` : ""}`;
      await Promise.allSettled([sendTelegramNotification(text, "messages")]);
      sent.push(reminder.id);
    }
    return res.status(200).json({ success: true, checked: rows.length, sent });
  } catch (error) { return sendDatabaseError(res, error); }
}

async function handlePublicMedia(req, res, id) {
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });
  try {
    const row = (await query("SELECT mime_type, bytes FROM media WHERE id=$1", [id])).rows[0];
    if (!row) return res.status(404).end();
    res.setHeader("Content-Type", row.mime_type);
    res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
    return res.status(200).send(row.bytes);
  } catch (error) { return sendDatabaseError(res, error); }
}

async function handleAdminMedia(req, res, id) {
  if (!requireAdmin(req, res)) return;
  try {
    if (req.method === "POST") {
      const { filename = "image", dataUrl = "" } = req.body || {};
      const match = typeof dataUrl === "string" && dataUrl.match(/^data:(image\/(?:png|jpe?g|webp));base64,([A-Za-z0-9+/=]+)$/i);
      if (!match) return res.status(400).json({ error: "Upload a PNG, JPG, or WebP image" });
      const bytes = Buffer.from(match[2], "base64");
      if (bytes.length > 3 * 1024 * 1024) return res.status(413).json({ error: "Image must be 3 MB or smaller" });
      const row = (await query(`INSERT INTO media (filename,mime_type,bytes) VALUES ($1,$2,$3) RETURNING ${mediaColumns}`, [String(filename).slice(0, 180), match[1].toLowerCase(), bytes])).rows[0];
      return res.status(201).json({ success: true, data: { ...row, url: `/api/media/${row.id}` } });
    }
    if (req.method === "DELETE" && Number.isInteger(id)) { const row = (await query("DELETE FROM media WHERE id=$1 RETURNING id", [id])).rows[0]; return row ? res.status(200).json({ success: true, data: row }) : res.status(404).json({ error: "Media not found" }); }
    return res.status(405).json({ error: "Method not allowed" });
  } catch (error) { return sendDatabaseError(res, error); }
}

// ─── Main Router ──────────────────────────────────────────────────────────────
export default async function handler(req, res) {
  if (setCors(req, res)) return;

  // Parse body if JSON
  if (req.body === undefined && req.headers["content-type"]?.includes("application/json")) {
    try {
      const chunks = [];
      for await (const chunk of req) chunks.push(chunk);
      req.body = JSON.parse(Buffer.concat(chunks).toString());
    } catch { req.body = {}; }
  }

  const url = req.url || "";
  // Strip query string for routing
  const path = url.split("?")[0];

  // Parse query params manually
  const qIdx = url.indexOf("?");
  const qs = qIdx >= 0 ? new URLSearchParams(url.slice(qIdx + 1)) : new URLSearchParams();
  req.query = Object.fromEntries(qs.entries());

  // ── Public routes ──────────────────────────────────────────────────────────
  if (path === "/api/healthz") return handleHealthz(req, res);
  if (path === "/api/projects") return handleProjects(req, res);
  if (path === "/api/skills") return handleSkills(req, res);
  if (path === "/api/experience") return handleExperience(req, res);
  if (path === "/api/journey") return handleJourney(req, res);
  if (path === "/api/messages") return handleMessages(req, res);
  if (path === "/api/track-visitor") return handleTrackVisitor(req, res);
  if (path === "/api/cron/reminders") return handleReminderCron(req, res);
  const publicMediaMatch = path.match(/^\/api\/media\/(\d+)$/);
  if (publicMediaMatch) return handlePublicMedia(req, res, Number(publicMediaMatch[1]));

  // ── Auth routes ────────────────────────────────────────────────────────────
  if (path === "/api/auth/login") return handleAuthLogin(req, res);
  if (path === "/api/auth/me") return handleAuthMe(req, res);

  // ── Admin routes ───────────────────────────────────────────────────────────
  // /api/admin/projects/:id?
  const projectMatch = path.match(/^\/api\/admin\/projects(?:\/(\d+))?$/);
  if (projectMatch) return handleAdminProjects(req, res, projectMatch[1] ? Number(projectMatch[1]) : undefined);

  // /api/admin/skills/:id?
  const skillMatch = path.match(/^\/api\/admin\/skills(?:\/(\d+))?$/);
  if (skillMatch) return handleAdminSkills(req, res, skillMatch[1] ? Number(skillMatch[1]) : undefined);

  // /api/admin/experience/:id?
  const expMatch = path.match(/^\/api\/admin\/experience(?:\/(\d+))?$/);
  if (expMatch) return handleAdminExperience(req, res, expMatch[1] ? Number(expMatch[1]) : undefined);

  // /api/admin/messages/:id/read  OR  /api/admin/messages/:id?  OR  /api/admin/messages
  const msgReadMatch = path.match(/^\/api\/admin\/messages\/(\d+)\/read$/);
  if (msgReadMatch) return handleAdminMessages(req, res, Number(msgReadMatch[1]), "read");
  const msgMatch = path.match(/^\/api\/admin\/messages(?:\/(\d+))?$/);
  if (msgMatch) return handleAdminMessages(req, res, msgMatch[1] ? Number(msgMatch[1]) : undefined, undefined);

  if (path === "/api/admin/settings") return handleAdminSettings(req, res);
  if (path === "/api/admin/stats") return handleAdminStats(req, res);
  const reminderMatch = path.match(/^\/api\/admin\/reminders(?:\/(\d+))?$/);
  if (reminderMatch) return handleAdminReminders(req, res, reminderMatch[1] ? Number(reminderMatch[1]) : undefined);
  const mediaMatch = path.match(/^\/api\/admin\/media(?:\/(\d+))?$/);
  if (mediaMatch) return handleAdminMedia(req, res, mediaMatch[1] ? Number(mediaMatch[1]) : undefined);
  const journeyMatch = path.match(/^\/api\/admin\/journey(?:\/(\d+))?$/);
  if (journeyMatch) return handleAdminJourney(req, res, journeyMatch[1] ? Number(journeyMatch[1]) : undefined);

  return res.status(404).json({ error: "Not found" });
}
