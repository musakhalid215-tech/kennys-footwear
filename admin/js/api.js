/* Admin data layer: auth, products, images, categories, settings.
   Every write is also enforced server-side by Supabase row-level security
   (supabase/schema.sql); the checks here are for a friendly experience. */
import { slugify } from "./ui.js";

const KX = window.KX;
export const configProblem = KX.configProblem();
export const client = configProblem ? null : KX.createClient({
  auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: false }
});
const BUCKET = KX.bucket;

export const LIMITS = {
  maxImages: 8,
  maxOriginalBytes: 10 * 1024 * 1024,
  maxUploadBytes: 5 * 1024 * 1024,
  maxSide: 1600,
  maxPrice: 1000000000
};

// ---------- errors ----------
export function friendlyError(err) {
  const msg = (err && (err.message || err.error_description || err.msg)) || String(err || "Unknown error");
  const code = err && err.code;
  if (code === "23505") return "That name/URL is already in use. Please choose a different one.";
  if (code === "23503") return "This item is still in use, so it cannot be removed.";
  if (code === "42501" || /row-level security|permission denied/i.test(msg))
    return "You are not allowed to do that. Make sure you are signed in as an administrator.";
  if (/jwt expired|invalid jwt|not authenticated/i.test(msg)) return "Your session has expired. Please sign in again.";
  if (/failed to fetch|networkerror|load failed/i.test(msg)) return "Network problem. Check your internet connection and try again.";
  if (/mime|not supported|invalid_mime/i.test(msg)) return "That file type is not allowed. Use JPG, PNG or WebP.";
  if (/exceeded the maximum|too large|payload/i.test(msg)) return "That file is too large (maximum 5 MB after processing).";
  return msg;
}

// ---------- auth ----------
export async function getSession() {
  const { data } = await client.auth.getSession();
  return data.session;
}
export async function signIn(email, password) {
  const { data, error } = await client.auth.signInWithPassword({ email, password });
  if (error) throw new Error("Incorrect email or password.");
  return data;
}
export async function signOut() { await client.auth.signOut(); }
export async function isAdmin() {
  const { data, error } = await client.rpc("is_admin");
  if (error) throw error;
  return data === true;
}
export async function changePassword(password) {
  const { error } = await client.auth.updateUser({ password });
  if (error) throw error;
}

// ---------- validation ----------
export function validateProduct(f, imageCount) {
  const e = {};
  const name = (f.name || "").trim();
  if (name.length < 2) e.name = "Enter the product name (at least 2 characters).";
  else if (name.length > 120) e.name = "Name is too long (maximum 120 characters).";

  const price = f.price === "" || f.price === null ? null : Number(f.price);
  const prev = f.previous_price === "" || f.previous_price === null ? null : Number(f.previous_price);
  if (price !== null && (!isFinite(price) || price < 0 || price > LIMITS.maxPrice)) e.price = "Enter a valid price.";
  if (prev !== null) {
    if (!isFinite(prev) || prev < 0 || prev > LIMITS.maxPrice) e.previous_price = "Enter a valid previous price.";
    else if (price === null) e.previous_price = "Set the current price first.";
    else if (prev <= price) e.previous_price = "Previous price must be higher than the current price.";
  }
  if ((f.description || "").length > 2000) e.description = "Description is too long (maximum 2000 characters).";
  if (!f.category) e.category = "Choose a category.";
  if (!["men", "women", "unisex"].includes(f.gender)) e.gender = "Choose men, women or unisex.";
  if (!["available", "sold_out", "hidden"].includes(f.status)) e.status = "Choose the availability.";
  if ((f.colour || "").length > 60) e.colour = "Colour is too long (maximum 60 characters).";
  if (!f.sizes || !f.sizes.length) e.sizes = "Select at least one size.";
  if (imageCount < 1) e.images = "Add at least one picture (the first one is the main picture).";
  if (imageCount > LIMITS.maxImages) e.images = `You can add up to ${LIMITS.maxImages} pictures.`;
  return e;
}

export function sortSizes(sizes) {
  return [...new Set(sizes)].sort((a, b) => {
    const na = parseFloat(a), nb = parseFloat(b);
    if (!isNaN(na) && !isNaN(nb) && na !== nb) return na - nb;
    return String(a).localeCompare(String(b));
  });
}

function dbFields(f) {
  return {
    name: f.name.trim(),
    description: (f.description || "").trim(),
    price: f.price === "" || f.price === null ? null : Number(f.price),
    previous_price: f.previous_price === "" || f.previous_price === null ? null : Number(f.previous_price),
    category: f.category,
    gender: f.gender,
    sizes: sortSizes(f.sizes),
    colour: (f.colour || "").trim() || null,
    status: f.status
  };
}

// ---------- image validation + processing (runs in the browser) ----------
async function sniffType(file) {
  const b = new Uint8Array(await file.slice(0, 12).arrayBuffer());
  if (b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff) return "image/jpeg";
  if (b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4e && b[3] === 0x47) return "image/png";
  const s = String.fromCharCode(...b);
  if (s.slice(0, 4) === "RIFF" && s.slice(8, 12) === "WEBP") return "image/webp";
  return null;
}
const toBlob = (canvas, type, q) => new Promise((res) => canvas.toBlob(res, type, q));

/** Checks the real file signature (not just the extension), then shrinks big
    phone photos so uploads are fast and stay under the 5 MB bucket limit. */
export async function prepareImage(file) {
  const type = await sniffType(file);
  if (!type) throw new Error(`"${file.name}" is not a JPG, PNG or WebP picture.`);
  if (file.size > LIMITS.maxOriginalBytes) throw new Error(`"${file.name}" is larger than 10 MB.`);
  let bmp;
  try { bmp = await createImageBitmap(file); }
  catch { throw new Error(`"${file.name}" could not be read as a picture.`); }

  const scale = Math.min(1, LIMITS.maxSide / Math.max(bmp.width, bmp.height));
  let blob = file;
  if (scale < 1 || file.size > 1.5 * 1024 * 1024) {
    const w = Math.max(1, Math.round(bmp.width * scale)), h = Math.max(1, Math.round(bmp.height * scale));
    const canvas = document.createElement("canvas");
    canvas.width = w; canvas.height = h;
    canvas.getContext("2d").drawImage(bmp, 0, 0, w, h);
    let out = await toBlob(canvas, "image/webp", 0.85);
    if (!out || out.type !== "image/webp") {
      const c2 = document.createElement("canvas");
      c2.width = w; c2.height = h;
      const ctx = c2.getContext("2d");
      ctx.fillStyle = "#fff"; ctx.fillRect(0, 0, w, h); ctx.drawImage(bmp, 0, 0, w, h);
      out = await toBlob(c2, "image/jpeg", 0.88);
    }
    if (out && (scale < 1 || out.size < file.size)) blob = out;
  }
  if (bmp.close) bmp.close();
  if (blob.size > LIMITS.maxUploadBytes) throw new Error(`"${file.name}" is still over 5 MB after shrinking. Please use a smaller picture.`);
  return { blob, type: blob.type || type };
}

const EXT = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp" };

async function uploadNew(productId, images, onProgress, uploadedPaths) {
  const total = images.filter((i) => i.blob).length;
  let n = 0;
  const out = [];
  for (let idx = 0; idx < images.length; idx++) {
    const img = images[idx];
    if (!img.blob) {
      out.push({ id: img.id, url: img.url, storage_path: img.storagePath || null, position: idx });
      continue;
    }
    n++;
    if (onProgress) onProgress(`Uploading picture ${n} of ${total}…`);
    const type = img.type && EXT[img.type] ? img.type : "image/jpeg";
    const path = `products/${productId}/${crypto.randomUUID()}.${EXT[type]}`;
    const { error } = await client.storage.from(BUCKET).upload(path, img.blob, {
      contentType: type, cacheControl: "31536000", upsert: false
    });
    if (error) throw error;
    uploadedPaths.push(path);
    const { data } = client.storage.from(BUCKET).getPublicUrl(path);
    out.push({ id: crypto.randomUUID(), url: data.publicUrl, storage_path: path, position: idx });
  }
  return out;
}

async function removeFiles(paths) {
  const list = paths.filter(Boolean);
  if (!list.length) return 0;
  const { error } = await client.storage.from(BUCKET).remove(list);
  return error ? list.length : 0; // number of files that could not be removed
}

async function uniqueSlug(name) {
  const base = slugify(name) || "product";
  const { data, error } = await client.from("products").select("slug").like("slug", base + "%");
  if (error) throw error;
  const taken = new Set((data || []).map((r) => r.slug));
  if (!taken.has(base)) return base;
  let i = 2;
  while (taken.has(`${base}-${i}`)) i++;
  return `${base}-${i}`;
}

// ---------- products ----------
const PRODUCT_SELECT = "*, product_images(id,url,storage_path,position)";

export async function listProducts() {
  const { data, error } = await client.from("products").select(PRODUCT_SELECT).order("created_at", { ascending: false });
  if (error) throw error;
  return data.map((p) => ({ ...p, product_images: (p.product_images || []).sort((a, b) => a.position - b.position) }));
}

export async function getProduct(id) {
  const { data, error } = await client.from("products").select(PRODUCT_SELECT).eq("id", id).maybeSingle();
  if (error) throw error;
  if (!data) return null;
  data.product_images = (data.product_images || []).sort((a, b) => a.position - b.position);
  return data;
}

export async function createProduct(fields, images, onProgress) {
  const id = crypto.randomUUID();
  const uploaded = [];
  try {
    const items = await uploadNew(id, images, onProgress, uploaded);
    if (onProgress) onProgress("Saving product…");
    let slug = await uniqueSlug(fields.name);
    let res = await client.from("products").insert({ id, slug, ...dbFields(fields) });
    if (res.error && res.error.code === "23505") {
      slug = `${slug}-${Math.random().toString(36).slice(2, 6)}`;
      res = await client.from("products").insert({ id, slug, ...dbFields(fields) });
    }
    if (res.error) throw res.error;
    const imgRes = await client.from("product_images").insert(items.map((i) => ({ ...i, product_id: id })));
    if (imgRes.error) {
      await client.from("products").delete().eq("id", id);
      throw imgRes.error;
    }
    return id;
  } catch (err) {
    await removeFiles(uploaded);
    throw err;
  }
}

/** images: final ordered list (existing {id,url,storagePath} or new {blob});
    removed: [{id, storagePath}] saved pictures the admin took out. */
export async function updateProduct(id, fields, images, removed, onProgress) {
  const uploaded = [];
  try {
    const items = await uploadNew(id, images, onProgress, uploaded);
    if (onProgress) onProgress("Saving changes…");
    const upd = await client.from("products").update(dbFields(fields)).eq("id", id);
    if (upd.error) throw upd.error;
    const up = await client.from("product_images").upsert(items.map((i) => ({ ...i, product_id: id })));
    if (up.error) throw up.error;
    let leftovers = 0;
    if (removed.length) {
      const del = await client.from("product_images").delete().in("id", removed.map((r) => r.id));
      if (del.error) throw del.error;
      leftovers = await removeFiles(removed.map((r) => r.storagePath));
    }
    return { leftovers };
  } catch (err) {
    await removeFiles(uploaded);
    throw err;
  }
}

export async function setProductStatus(id, status) {
  const { error } = await client.from("products").update({ status }).eq("id", id);
  if (error) throw error;
}

export async function setProductPrice(id, price, previous) {
  const p = price === "" || price === null ? null : Number(price);
  const v = previous === "" || previous === null ? null : Number(previous);
  if (p !== null && (!isFinite(p) || p < 0 || p > LIMITS.maxPrice)) throw new Error("Enter a valid price.");
  if (v !== null) {
    if (!isFinite(v) || v < 0) throw new Error("Enter a valid previous price.");
    if (p === null) throw new Error("Set the current price before a previous price.");
    if (v <= p) throw new Error("Previous price must be higher than the current price.");
  }
  const { error } = await client.from("products").update({ price: p, previous_price: v }).eq("id", id);
  if (error) throw error;
}

/** Removes the product from the public site first, then cleans up its image files. */
export async function deleteProduct(product) {
  const paths = (product.product_images || []).map((i) => i.storage_path);
  const { error } = await client.from("products").delete().eq("id", product.id);
  if (error) throw error;
  return { leftovers: await removeFiles(paths) };
}

// ---------- categories ----------
export async function listCategories() {
  const [cats, prods] = await Promise.all([
    client.from("categories").select("*").order("sort_order").order("name"),
    client.from("products").select("category")
  ]);
  if (cats.error) throw cats.error;
  if (prods.error) throw prods.error;
  const counts = {};
  prods.data.forEach((p) => { counts[p.category] = (counts[p.category] || 0) + 1; });
  return cats.data.map((c) => ({ ...c, count: counts[c.slug] || 0 }));
}
export async function addCategory(name) {
  const clean = name.trim();
  if (clean.length < 2 || clean.length > 60) throw new Error("Category name must be 2–60 characters.");
  const slug = slugify(clean);
  if (!slug) throw new Error("Category name must contain letters or numbers.");
  const { data: last } = await client.from("categories").select("sort_order").order("sort_order", { ascending: false }).limit(1);
  const sort = last && last.length ? last[0].sort_order + 1 : 1;
  const { error } = await client.from("categories").insert({ name: clean, slug, sort_order: sort });
  if (error) throw error;
}
export async function renameCategory(id, name) {
  const clean = name.trim();
  if (clean.length < 2 || clean.length > 60) throw new Error("Category name must be 2–60 characters.");
  const { error } = await client.from("categories").update({ name: clean }).eq("id", id);
  if (error) throw error;
}
export async function deleteCategory(id) {
  const { error } = await client.from("categories").delete().eq("id", id);
  if (error) throw error;
}

// ---------- settings ----------
export async function getSettings() {
  const { data, error } = await client.from("site_settings").select("key,value");
  if (error) throw error;
  const out = {};
  data.forEach((r) => { out[r.key] = r.value; });
  return out;
}
export async function saveSetting(key, value) {
  const { error } = await client.from("site_settings").upsert({ key, value, updated_at: new Date().toISOString() });
  if (error) throw error;
}
