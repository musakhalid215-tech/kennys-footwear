import { el, icon, money, fmtDate, toast, confirmDialog, modal, loading, clear, debounce } from "../ui.js";
import * as api from "../api.js";
import { pageHeader, statusBadge, thumb, GENDERS } from "./shared.js";

export async function render(page) {
  page.append(pageHeader("All Products", "Edit, update prices, change availability or delete",
    el("a", { class: "ka-btn ka-btn-primary", href: "#/products/new" }, icon("add"), "Add New Product")));

  let products = await api.listProducts();
  const cats = await api.listCategories();
  const catName = (slug) => (cats.find((c) => c.slug === slug) || {}).name || slug;

  const search = el("input", { type: "search", class: "ka-input", placeholder: "Search by name…", "aria-label": "Search products" });
  const statusSel = el("select", { class: "ka-input", "aria-label": "Filter by availability" },
    el("option", { value: "", text: "All availability" }), el("option", { value: "available", text: "Available" }),
    el("option", { value: "sold_out", text: "Sold Out" }), el("option", { value: "hidden", text: "Hidden" }));
  const catSel = el("select", { class: "ka-input", "aria-label": "Filter by category" },
    el("option", { value: "", text: "All categories" }), cats.map((c) => el("option", { value: c.slug, text: c.name })));
  page.append(el("div", { class: "ka-filters" }, search, statusSel, catSel));

  const host = el("div", {});
  page.append(host);

  function draw() {
    clear(host);
    const q = search.value.trim().toLowerCase();
    const list = products.filter((p) =>
      (!q || p.name.toLowerCase().includes(q)) &&
      (!statusSel.value || p.status === statusSel.value) &&
      (!catSel.value || p.category === catSel.value));

    if (!products.length) { host.append(el("div", { class: "ka-card ka-empty" }, el("p", { text: "You have not added any products yet." }), el("a", { class: "ka-btn ka-btn-primary", href: "#/products/new" }, "Add your first product"))); return; }
    if (!list.length) { host.append(el("div", { class: "ka-card ka-empty", text: "No products match your search." })); return; }

    const rows = list.map((p) => {
      const statusPick = el("select", { class: "ka-input ka-status-select ka-st-" + p.status, "aria-label": "Availability for " + p.name },
        ["available", "sold_out", "hidden"].map((s) => el("option", { value: s, selected: s === p.status, text: { available: "Available", sold_out: "Sold Out", hidden: "Hidden" }[s] })));
      statusPick.addEventListener("change", async () => {
        const prev = p.status, next = statusPick.value;
        statusPick.disabled = true;
        try {
          await api.setProductStatus(p.id, next);
          p.status = next;
          toast(`"${p.name}" is now ${{ available: "Available", sold_out: "Sold Out", hidden: "Hidden" }[next]}.`);
          draw();
        } catch (e) {
          statusPick.value = prev; statusPick.disabled = false;
          toast(api.friendlyError(e), "error");
        }
      });

      return el("tr", {},
        el("td", { "data-label": "Image", class: "ka-td-img" }, thumb(p)),
        el("td", { "data-label": "Product", class: "ka-td-name" }, el("strong", { text: p.name }), el("span", { class: "ka-muted", text: GENDERS[p.gender] })),
        el("td", { "data-label": "Price" }, el("span", { text: money(p.price) }),
          p.previous_price !== null ? el("s", { class: "ka-muted ka-prev", text: money(p.previous_price) }) : null),
        el("td", { "data-label": "Category", text: catName(p.category) }),
        el("td", { "data-label": "Availability" }, statusPick),
        el("td", { "data-label": "Uploaded", text: fmtDate(p.created_at) }),
        el("td", { "data-label": "Actions", class: "ka-td-actions" },
          el("a", { class: "ka-btn ka-btn-sm", href: "#/products/edit/" + p.id, title: "Edit product" }, icon("edit"), "Edit"),
          el("button", { class: "ka-btn ka-btn-sm", type: "button", title: "Update price", onClick: () => priceDialog(p) }, icon("sell"), "Price"),
          el("button", { class: "ka-btn ka-btn-sm ka-btn-danger-ghost", type: "button", title: "Delete product", onClick: () => remove(p) }, icon("delete"), "Delete")));
    });

    host.append(el("div", { class: "ka-card ka-tablewrap" },
      el("table", { class: "ka-table" },
        el("thead", {}, el("tr", {}, ["Image", "Product", "Price", "Category", "Availability", "Uploaded", "Actions"].map((h) => el("th", { scope: "col", text: h })))),
        el("tbody", {}, rows))),
      el("p", { class: "ka-muted ka-count", text: `${list.length} of ${products.length} product${products.length === 1 ? "" : "s"}` }));
  }

  function priceDialog(p) {
    const price = el("input", { class: "ka-input", type: "number", min: "0", step: "0.01", inputmode: "decimal", value: p.price ?? "", placeholder: "Leave empty for “Contact for price”" });
    const prev = el("input", { class: "ka-input", type: "number", min: "0", step: "0.01", inputmode: "decimal", value: p.previous_price ?? "", placeholder: "Optional" });
    const err = el("p", { class: "ka-error", role: "alert" });
    const save = el("button", { class: "ka-btn ka-btn-primary", type: "button" }, "Save price");
    let m;
    save.addEventListener("click", async () => {
      err.textContent = ""; save.disabled = true;
      try {
        await api.setProductPrice(p.id, price.value, prev.value);
        p.price = price.value === "" ? null : Number(price.value);
        p.previous_price = prev.value === "" ? null : Number(prev.value);
        m.close(); toast("Price updated."); draw();
      } catch (e) { err.textContent = api.friendlyError(e); save.disabled = false; }
    });
    m = modal({
      title: "Update price – " + p.name,
      body: el("div", { class: "ka-modal-form" },
        el("label", { class: "ka-label" }, "Selling price (₦)", price),
        el("label", { class: "ka-label" }, "Previous price (₦) – shown crossed out", prev), err),
      actions: [el("button", { class: "ka-btn", type: "button", onClick: () => m.close() }, "Cancel"), save]
    });
  }

  async function remove(p) {
    const ok = await confirmDialog({
      title: "Delete this product?",
      message: `"${p.name}" will be permanently removed from your website, and its uploaded pictures will be deleted. This cannot be undone. (To hide it temporarily instead, set it to Hidden.)`,
      confirmText: "Yes, delete permanently", danger: true
    });
    if (!ok) return;
    try {
      const r = await api.deleteProduct(p);
      products = products.filter((x) => x.id !== p.id);
      toast(r.leftovers ? `Product deleted, but ${r.leftovers} picture file(s) could not be removed from storage.` : "Product deleted.", r.leftovers ? "info" : "success");
      draw();
    } catch (e) { toast(api.friendlyError(e), "error"); }
  }

  search.addEventListener("input", debounce(draw, 150));
  statusSel.addEventListener("change", draw);
  catSel.addEventListener("change", draw);
  draw();
}
