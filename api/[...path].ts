import "../artifacts/api-server/src/lib/env.js";
import app from "../artifacts/api-server/src/app.js";

// Vercel serves this catch-all function at /api/*; the Express app owns routing below it.
export default app;
