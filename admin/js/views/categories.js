import { el, icon, toast, confirmDialog, modal, clear } from "../ui.js";
import * as api from "../api.js";
import { pageHeader } from "./shared.js";

export async function render(page) {
  page.append(pageHeader("Categories", "Organise your footwear into collections. Men's and Women's are set on each product."));

  let cats = await api.listCategories();

  const input = el("input", { class: "ka-input", type: "text", maxlength: "60", placeholder: "New category name, e.g. Loafers", "aria-label": "New category name" });
  const addBtn = el("button", { class: "ka-btn ka-btn-primary", type: "submit" }, icon("add"), "Add category");
  const addForm = el("form", { class: "ka-inline-form" }, input, addBtn);
  addForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    addBtn.disabled = true;
    try {
      await api.addCategory(input.value);
      input.value = ""; cats = await api.listCategories(); draw(); toast("Category added.");
    } catch (err) { toast(api.friendlyError(err), "error"); }
    addBtn.disabled = false;
  });
  page.append(el("div", { class: "ka-card" }, el("h2", { text: "Add a category" }), addForm));

  const host = el("div", { class: "ka-card" });
  page.append(host);

  function rename(c) {
    const field = el("input", { class: "ka-input", type: "text", maxlength: "60", value: c.name, "aria-label": "Category name" });
    const err = el("p", { class: "ka-error", role: "alert" });
    const save = el("button", { class: "ka-btn ka-btn-primary", type: "button" }, "Save");
    let m;
    save.addEventListener("click", async () => {
      save.disabled = true; err.textContent = "";
      try { await api.renameCategory(c.id, field.value); m.close(); cats = await api.listCategories(); draw(); toast("Category renamed."); }
      catch (e) { err.textContent = api.friendlyError(e); save.disabled = false; }
    });
    field.addEventListener("keydown", (e) => { if (e.key === "Enter") { e.preventDefault(); save.click(); } });
    m = modal({ title: "Rename category", body: el("div", { class: "ka-modal-form" }, field, err), actions: [el("button", { class: "ka-btn", type: "button", onClick: () => m.close() }, "Cancel"), save] });
  }

  async function remove(c) {
    if (c.count > 0) { toast(`"${c.name}" is used by ${c.count} product${c.count === 1 ? "" : "s"}. Move or delete them first.`, "error"); return; }
    if (!(await confirmDialog({ title: "Delete category?", message: `"${c.name}" will be removed. No products use it.`, confirmText: "Delete category", danger: true }))) return;
    try { await api.deleteCategory(c.id); cats = await api.listCategories(); draw(); toast("Category deleted."); }
    catch (e) { toast(api.friendlyError(e), "error"); }
  }

  function draw() {
    clear(host);
    host.append(el("h2", { text: "Your categories" }));
    if (!cats.length) { host.append(el("p", { class: "ka-empty", text: "No categories yet." })); return; }
    host.append(el("ul", { class: "ka-catlist" }, cats.map((c) =>
      el("li", {},
        el("div", { class: "ka-catname" }, el("strong", { text: c.name }), el("span", { class: "ka-muted", text: `${c.count} product${c.count === 1 ? "" : "s"}` })),
        el("div", { class: "ka-catactions" },
          el("button", { class: "ka-btn ka-btn-sm", type: "button", onClick: () => rename(c) }, icon("edit"), "Rename"),
          el("button", { class: "ka-btn ka-btn-sm ka-btn-danger-ghost", type: "button", onClick: () => remove(c) }, icon("delete"), "Delete"))))));
  }
  draw();
}
