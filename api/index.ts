import app from "../artifacts/api-server/src/app";

function handler(req: any, res: any) {
  if (req.url && !req.url.startsWith("/api")) {
    req.url = "/api" + (req.url.startsWith("/") ? "" : "/") + req.url;
  }
  return app(req, res);
}

export default handler;
module.exports = handler;
