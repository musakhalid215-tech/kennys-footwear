/* Admin dashboard entry: auth gate, shell, router. */
import { el, icon, clear, loading, toast } from "./ui.js";
import * as api from "./api.js";

const app = document.getElementById("app");
const IDLE_MS = 60 * 60 * 1000; // sign out after 60 minutes of inactivity

const ROUTES = [
  { re: /^#\/dashboard$/, nav: "dashboard", load: () => import("./views/dashboard.js") },
  { re: /^#\/products\/new$/, nav: "new", load: () => import("./views/product-form.js") },
  { re: /^#\/products\/edit\/([0-9a-f-]{36})$/i, nav: "products", load: () => import("./views/product-form.js") },
  { re: /^#\/products$/, nav: "products", load: () => import("./views/products.js") },
  { re: /^#\/categories$/, nav: "categories", load: () => import("./views/categories.js") },
  { re: /^#\/settings$/, nav: "settings", load: () => import("./views/settings.js") }
];

// ---------------- screens ----------------
function showFatal(title, message) {
  clear(app).append(el("div", { class: "ka-center" }, el("div", { class: "ka-card ka-login" },
    el("h1", { text: title }), el("p", { class: "ka-muted", text: message }))));
}

function showLogin(note) {
  window.onhashchange = null; // no routing while signed out
  document.title = "Sign in | Kenny's Authentic Footwear Admin";
  const email = el("input", { class: "ka-input", id: "email", type: "email", autocomplete: "username", required: true, placeholder: "you@example.com" });
  const pass = el("input", { class: "ka-input", id: "password", type: "password", autocomplete: "current-password", required: true });
  const err = el("p", { class: "ka-error", role: "alert", text: note || "" });
  const btn = el("button", { class: "ka-btn ka-btn-primary ka-btn-lg ka-btn-block", type: "submit" }, "Sign in");
  const toggle = el("button", { class: "ka-iconbtn ka-pass-toggle", type: "button", "aria-label": "Show password", onClick: () => {
    const show = pass.type === "password"; pass.type = show ? "text" : "password";
    toggle.setAttribute("aria-label", show ? "Hide password" : "Show password");
  } }, icon("visibility"));
  const form = el("form", { class: "ka-loginform", novalidate: true },
    el("div", { class: "ka-field" }, el("label", { class: "ka-label", for: "email" }, "Email"), email),
    el("div", { class: "ka-field" }, el("label", { class: "ka-label", for: "password" }, "Password"), el("div", { class: "ka-passwrap" }, pass, toggle)),
    err, btn);
  form.addEventListener("submit", async (e) => {
    e.preventDefault(); err.textContent = "";
    if (!email.value.trim() || !pass.value) { err.textContent = "Enter your email and password."; return; }
    btn.disabled = true; btn.textContent = "Signing in…";
    try {
      await api.signIn(email.value.trim(), pass.value);
      if (!(await api.isAdmin())) {
        await api.signOut();
        throw new Error("This account is not authorised to use the dashboard.");
      }
      await startShell();
    } catch (ex) {
      err.textContent = ex.message || "Could not sign in.";
      btn.disabled = false; btn.textContent = "Sign in";
    }
  });
  clear(app).append(el("div", { class: "ka-center" }, el("div", { class: "ka-card ka-login" },
    el("div", { class: "ka-brand ka-brand-lg" }, el("span", { class: "ka-brand-name", text: "KENNY'S" }), el("span", { class: "ka-brand-sub", text: "Admin Dashboard" })),
    form, el("p", { class: "ka-muted ka-foot", text: "Authorised administrators only." }))));
  email.focus();
}

// ---------------- shell ----------------
let session = null;
let routeToken = 0;

const NAV = [
  ["dashboard", "Dashboard", "dashboard", "#/dashboard"],
  ["new", "Add Product", "add_circle", "#/products/new"],
  ["products", "All Products", "inventory_2", "#/products"],
  ["categories", "Categories", "category", "#/categories"],
  ["settings", "Settings", "settings", "#/settings"]
];

async function logout() {
  await api.signOut();
  stopIdle();
  showLogin();
}

async function startShell() {
  session = await api.getSession();
  if (!session) return showLogin();

  const nav = el("nav", { class: "ka-nav", "aria-label": "Admin" },
    NAV.map(([key, label, ic, href]) => el("a", { class: "ka-navlink", href, "data-nav": key }, icon(ic), label)),
    el("button", { class: "ka-navlink ka-navbtn", type: "button", onClick: logout }, icon("logout"), "Logout"));

  const shell = el("div", { class: "ka-app" });
  const closeNav = () => shell.classList.remove("ka-nav-open");
  const sidebar = el("aside", { class: "ka-sidebar", id: "sidebar" },
    el("div", { class: "ka-brand" }, el("span", { class: "ka-brand-name", text: "KENNY'S" }), el("span", { class: "ka-brand-sub", text: "Admin Dashboard" })),
    nav,
    el("a", { class: "ka-sitelink", href: "/", target: "_blank", rel: "noopener" }, icon("open_in_new"), "View website"));
  const topbar = el("header", { class: "ka-topbar" },
    el("button", { class: "ka-iconbtn", type: "button", "aria-label": "Open menu", "aria-controls": "sidebar", onClick: () => shell.classList.add("ka-nav-open") }, icon("menu")),
    el("span", { class: "ka-brand-name", text: "KENNY'S ADMIN" }));
  const main = el("main", { class: "ka-main", id: "main", tabindex: "-1" });
  const scrim = el("div", { class: "ka-scrim", onClick: closeNav });
  shell.append(sidebar, topbar, main, scrim);
  nav.addEventListener("click", (e) => { if (e.target.closest("a, button")) closeNav(); });
  clear(app).append(shell);

  async function route() {
    const hash = location.hash || "#/dashboard";
    const token = ++routeToken;
    const match = ROUTES.map((r) => ({ r, m: hash.match(r.re) })).find((x) => x.m);
    if (!match) { location.hash = "#/dashboard"; return; }

    nav.querySelectorAll("[data-nav]").forEach((a) => a.classList.toggle("is-active", a.dataset.nav === match.r.nav));
    document.title = (NAV.find((n) => n[0] === match.r.nav) || [0, "Admin"])[1] + " | Kenny's Admin";
    const page = el("div", { class: "ka-page" }, loading());
    clear(main).append(page);
    window.scrollTo(0, 0);
    try {
      const mod = await match.r.load();
      if (token !== routeToken) return;
      clear(page);
      await mod.render(page, { email: session.user.email, logout }, match.m);
    } catch (err) {
      if (token !== routeToken) return;
      clear(page).append(el("div", { class: "ka-card ka-empty" },
        el("p", { text: api.friendlyError(err) }),
        el("button", { class: "ka-btn", type: "button", onClick: route }, "Try again")));
    }
  }
  startIdle();
  window.onhashchange = route; // set AFTER startIdle (which resets timers only)
  await route();
}

// ---------------- inactivity sign-out ----------------
let idleTimer = null, lastActive = Date.now(), idleHandler = null;
function startIdle() {
  stopIdle();
  lastActive = Date.now();
  idleHandler = () => { lastActive = Date.now(); };
  ["click", "keydown", "touchstart", "mousemove"].forEach((ev) => window.addEventListener(ev, idleHandler, { passive: true }));
  idleTimer = setInterval(async () => {
    if (Date.now() - lastActive > IDLE_MS) {
      await api.signOut();
      stopIdle();
      showLogin("You were signed out after a period of inactivity.");
    }
  }, 30000);
}
function stopIdle() {
  if (idleTimer) clearInterval(idleTimer);
  if (idleHandler) ["click", "keydown", "touchstart", "mousemove"].forEach((ev) => window.removeEventListener(ev, idleHandler));
  idleTimer = idleHandler = null;
}

// ---------------- icon font fallback ----------------
(function watchIconFont() {
  const mark = () => document.documentElement.classList.add("ka-nofont");
  try {
    const t = setTimeout(() => { if (!document.fonts.check('20px "Material Symbols Outlined"')) mark(); }, 3500);
    document.fonts.load('20px "Material Symbols Outlined"', "menu").then((f) => { if (!f.length) { clearTimeout(t); mark(); } }).catch(mark);
  } catch (e) { mark(); }
})();

// ---------------- boot ----------------
(async function boot() {
  if (api.configProblem) {
    showFatal("Setup needed", api.configProblem + " Open supabase-config.js (or set the Netlify environment variables) — see SETUP.md.");
    return;
  }
  try {
    const s = await api.getSession();
    if (s && (await api.isAdmin())) await startShell();
    else { if (s) await api.signOut(); showLogin(); }
  } catch (e) {
    showLogin();
  }
  api.client.auth.onAuthStateChange((event) => {
    if (event === "SIGNED_OUT" && session) { session = null; stopIdle(); showLogin(); }
  });
})();
