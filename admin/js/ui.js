/* Small UI toolkit for the admin dashboard.
   Everything is built with DOM methods (never innerHTML with data), so
   product names / descriptions can never inject markup. */

export function el(tag, props, ...kids) {
  const n = document.createElement(tag);
  for (const [k, v] of Object.entries(props || {})) {
    if (v === null || v === undefined || v === false) continue;
    if (k === "class") n.className = v;
    else if (k === "text") n.textContent = v;
    else if (k === "value") n.value = v;
    else if (/^on[A-Z]/.test(k) && typeof v === "function") n.addEventListener(k.slice(2).toLowerCase(), v);
    else if (["checked", "disabled", "hidden", "selected", "required", "multiple"].includes(k)) n[k] = !!v;
    else n.setAttribute(k, v === true ? "" : String(v));
  }
  kids.flat(Infinity).forEach((c) => {
    if (c === null || c === undefined || c === false) return;
    n.append(c.nodeType ? c : document.createTextNode(String(c)));
  });
  return n;
}

// Icons use the Material Symbols font. If that font cannot load (offline /
// blocked network) html gets class "ka-nofont" and each icon shows a plain
// text glyph from this map instead, so buttons never turn into raw words.
const GLYPH = {
  add: "+", add_circle: "+", add_photo_alternate: "+", arrow_back: "\u2190", chevron_right: "\u203A", chevron_left: "\u2039",
  close: "\u2715", delete: "\u2715", edit: "\u270E", menu: "\u2630", open_in_new: "\u2197", star: "\u2605",
  swap_horiz: "\u21C4", visibility: "\u25C9", check_circle: "\u2713", error: "!", info: "i", sell: "\u20A6",
  cloud_upload: "\u2191", dashboard: "\u25A6", inventory_2: "\u25A3", category: "\u25A4", settings: "\u2699", logout: "\u21E5"
};
export const icon = (name, cls = "") =>
  el("span", { class: "material-symbols-outlined " + cls, "aria-hidden": "true", "data-g": GLYPH[name] || "", text: name });

export function clear(node) { while (node.firstChild) node.removeChild(node.firstChild); return node; }

export function debounce(fn, ms = 250) {
  let t;
  return (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), ms); };
}

export function slugify(s) {
  return String(s).toLowerCase().normalize("NFKD").replace(/[̀-ͯ]/g, "")
    .replace(/&/g, " and ").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 60);
}

export function fmtDate(iso) {
  try { return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }); }
  catch { return ""; }
}

export function money(n) {
  return n === null || n === undefined ? "Contact for price"
    : "₦" + Number(n).toLocaleString("en-NG", { maximumFractionDigits: 2 });
}

// ---------- toast ----------
export function toast(message, type = "success", ms = 4500) {
  const host = document.getElementById("toasts");
  if (!host) return;
  const t = el("div", { class: "ka-toast ka-toast-" + type, role: type === "error" ? "alert" : "status" },
    icon(type === "error" ? "error" : type === "success" ? "check_circle" : "info"),
    el("span", { text: message }),
    el("button", { class: "ka-toast-x", type: "button", "aria-label": "Dismiss", onClick: () => t.remove() }, icon("close")));
  host.append(t);
  if (ms) setTimeout(() => t.remove(), ms);
}

// ---------- modal / confirm ----------
export function modal({ title, body, actions }) {
  const previous = document.activeElement;
  const scrim = el("div", { class: "ka-scrim-modal" });
  const box = el("div", { class: "ka-modal", role: "dialog", "aria-modal": "true", "aria-label": title },
    el("h2", { text: title }), body, el("div", { class: "ka-modal-actions" }, actions));
  scrim.append(box);
  const close = () => {
    document.removeEventListener("keydown", onKey);
    scrim.remove();
    if (previous && previous.focus) previous.focus();
  };
  const onKey = (e) => {
    if (e.key === "Escape") close();
    if (e.key === "Tab") {
      const f = box.querySelectorAll("button, input, select, textarea, a[href]");
      if (!f.length) return;
      const first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  };
  document.addEventListener("keydown", onKey);
  scrim.addEventListener("mousedown", (e) => { if (e.target === scrim) close(); });
  document.body.append(scrim);
  const focusTarget = box.querySelector("input, select, textarea") || box.querySelector("button.ka-btn-primary, button.ka-btn-danger") || box.querySelector("button");
  if (focusTarget) focusTarget.focus();
  return { close, box };
}

export function confirmDialog({ title, message, confirmText = "Confirm", danger = false }) {
  return new Promise((resolve) => {
    let m;
    const done = (v) => { m.close(); resolve(v); };
    m = modal({
      title,
      body: el("p", { class: "ka-modal-text", text: message }),
      actions: [
        el("button", { class: "ka-btn", type: "button", onClick: () => done(false) }, "Cancel"),
        el("button", { class: "ka-btn " + (danger ? "ka-btn-danger" : "ka-btn-primary"), type: "button", onClick: () => done(true) }, confirmText)
      ]
    });
  });
}

export function loading(text = "Loading…") {
  return el("div", { class: "ka-loading", role: "status" }, el("span", { class: "ka-spin" }), el("span", { text }));
}

export function setBusy(button, busy, label) {
  button.disabled = busy;
  button.classList.toggle("ka-busy", busy);
  if (label !== undefined) button.dataset.label = label;
}
