// Writes supabase-config.js from Netlify environment variables.
//   SUPABASE_URL       e.g. https://abcdxyz.supabase.co
//   SUPABASE_ANON_KEY  the PUBLIC "anon" / "publishable" key
// Refuses to continue if a SECRET key is supplied by mistake.
const fs = require("fs");
const path = require("path");

const url = (process.env.SUPABASE_URL || "").trim();
const key = (process.env.SUPABASE_ANON_KEY || "").trim();
const bucket = (process.env.SUPABASE_STORAGE_BUCKET || "product-images").trim();

if (!url && !key) {
  console.log("[build-config] SUPABASE_URL / SUPABASE_ANON_KEY not set - keeping supabase-config.js as committed.");
  process.exit(0);
}
if (!url || !key) {
  console.error("[build-config] Set BOTH SUPABASE_URL and SUPABASE_ANON_KEY (or neither).");
  process.exit(1);
}
if (!/^https:\/\/[a-z0-9-]+\.supabase\.(co|in)$/i.test(url.replace(/\/$/, ""))) {
  console.error("[build-config] SUPABASE_URL does not look like https://<project>.supabase.co");
  process.exit(1);
}

function isSecret(k) {
  if (/^sb_secret_/i.test(k)) return true;
  try {
    const payload = JSON.parse(Buffer.from(k.split(".")[1], "base64url").toString("utf8"));
    return payload.role === "service_role";
  } catch (e) {
    return false;
  }
}
if (isSecret(key)) {
  console.error("[build-config] STOP: that is a SECRET (service_role) key. Never put it in the website. Use the public anon/publishable key.");
  process.exit(1);
}

const out =
  "/* Generated at build time from Netlify environment variables. Public values only. */\n" +
  "window.KENNYS_CONFIG = " +
  JSON.stringify({ SUPABASE_URL: url.replace(/\/$/, ""), SUPABASE_ANON_KEY: key, STORAGE_BUCKET: bucket }, null, 2) +
  ";\n";
fs.writeFileSync(path.join(__dirname, "..", "supabase-config.js"), out);
console.log("[build-config] supabase-config.js written for " + url);
