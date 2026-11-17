import { el, icon, toast } from "../ui.js";
import * as api from "../api.js";
import { pageHeader } from "./shared.js";

export async function render(page, ctx) {
  page.append(pageHeader("Settings", "Your account and contact details"));
  const settings = await api.getSettings();

  // ----- account -----
  page.append(el("section", { class: "ka-card" }, el("h2", { text: "Account" }),
    el("p", {}, "Signed in as ", el("strong", { text: ctx.email || "" })),
    el("button", { class: "ka-btn", type: "button", onClick: ctx.logout }, icon("logout"), "Log out")));

  // ----- whatsapp -----
  const wa = el("input", { class: "ka-input", id: "wa", type: "tel", inputmode: "numeric", value: settings.whatsapp_number || "", placeholder: "2347038313960" });
  const waErr = el("p", { class: "ka-error", role: "alert" });
  const waBtn = el("button", { class: "ka-btn ka-btn-primary", type: "submit" }, "Save number");
  const waForm = el("form", { class: "ka-form-inline", novalidate: true },
    el("div", { class: "ka-field" }, el("label", { class: "ka-label", for: "wa" }, "WhatsApp number for customer enquiries"), wa,
      el("p", { class: "ka-hint", text: "Digits only, with country code and no + or spaces. Example: 2347038313960" }), waErr), waBtn);
  waForm.addEventListener("submit", async (e) => {
    e.preventDefault(); waErr.textContent = "";
    const v = wa.value.replace(/[\s+()-]/g, "");
    if (!/^\d{8,15}$/.test(v)) { waErr.textContent = "Enter 8–15 digits including the country code."; return; }
    waBtn.disabled = true;
    try { await api.saveSetting("whatsapp_number", v); wa.value = v; toast("WhatsApp number saved."); }
    catch (err) { toast(api.friendlyError(err), "error"); }
    waBtn.disabled = false;
  });
  page.append(el("section", { class: "ka-card" }, el("h2", { text: "Contact" }), waForm));

  // ----- password -----
  const p1 = el("input", { class: "ka-input", id: "p1", type: "password", autocomplete: "new-password" });
  const p2 = el("input", { class: "ka-input", id: "p2", type: "password", autocomplete: "new-password" });
  const pErr = el("p", { class: "ka-error", role: "alert" });
  const pBtn = el("button", { class: "ka-btn ka-btn-primary", type: "submit" }, "Change password");
  const pForm = el("form", { class: "ka-form-inline", novalidate: true },
    el("div", { class: "ka-field" }, el("label", { class: "ka-label", for: "p1" }, "New password"), p1,
      el("p", { class: "ka-hint", text: "At least 10 characters. Use a long phrase you don't use anywhere else." })),
    el("div", { class: "ka-field" }, el("label", { class: "ka-label", for: "p2" }, "Confirm new password"), p2, pErr), pBtn);
  pForm.addEventListener("submit", async (e) => {
    e.preventDefault(); pErr.textContent = "";
    if (p1.value.length < 10) { pErr.textContent = "Password must be at least 10 characters."; return; }
    if (p1.value !== p2.value) { pErr.textContent = "The two passwords do not match."; return; }
    pBtn.disabled = true;
    try { await api.changePassword(p1.value); p1.value = p2.value = ""; toast("Password changed."); }
    catch (err) { pErr.textContent = api.friendlyError(err); }
    pBtn.disabled = false;
  });
  page.append(el("section", { class: "ka-card" }, el("h2", { text: "Password" }), pForm));
}
