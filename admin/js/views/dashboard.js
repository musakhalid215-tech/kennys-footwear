import { el, icon, money, fmtDate } from "../ui.js";
import * as api from "../api.js";
import { pageHeader, statusBadge, thumb, GENDERS } from "./shared.js";

export async function render(page) {
  page.append(pageHeader("Dashboard", "A quick look at your catalogue",
    el("a", { class: "ka-btn ka-btn-primary", href: "#/products/new" }, icon("add"), "Add New Product")));

  const products = await api.listProducts();
  const count = (s) => products.filter((p) => p.status === s).length;

  const stat = (label, value, hint, cls) =>
    el("div", { class: "ka-stat " + (cls || "") }, el("span", { class: "ka-stat-label", text: label }),
      el("strong", { class: "ka-stat-value", text: String(value) }), el("span", { class: "ka-stat-hint", text: hint }));

  page.append(el("div", { class: "ka-stats" },
    stat("Total products", products.length, "All items you have uploaded"),
    stat("Available", count("available"), "Showing on the website", "ka-stat-ok"),
    stat("Sold out", count("sold_out"), "Shown with a Sold Out label", "ka-stat-warn"),
    stat("Hidden", count("hidden"), "Not visible to customers")));

  const recent = products.slice(0, 5);
  const list = recent.length
    ? el("ul", { class: "ka-recent" }, recent.map((p) =>
        el("li", {},
          thumb(p),
          el("div", { class: "ka-recent-main" },
            el("a", { href: "#/products/edit/" + p.id, text: p.name }),
            el("span", { class: "ka-muted", text: `${GENDERS[p.gender]} • ${fmtDate(p.created_at)}` })),
          el("span", { class: "ka-recent-price", text: money(p.price) }),
          statusBadge(p.status))))
    : el("p", { class: "ka-empty", text: "No products yet. Add your first one to get started." });

  page.append(el("div", { class: "ka-grid-2" },
    el("section", { class: "ka-card" }, el("h2", { text: "Recently added" }), list),
    el("section", { class: "ka-card" }, el("h2", { text: "Quick access" }),
      el("div", { class: "ka-quick" },
        el("a", { class: "ka-quick-link", href: "#/products/new" }, icon("add_circle"), el("span", {}, el("strong", { text: "Add product" }), el("small", { text: "Upload pictures, price and details" })), icon("chevron_right")),
        el("a", { class: "ka-quick-link", href: "#/products" }, icon("inventory_2"), el("span", {}, el("strong", { text: "Manage products" }), el("small", { text: "Edit, change availability or delete" })), icon("chevron_right")),
        el("a", { class: "ka-quick-link", href: "#/categories" }, icon("category"), el("span", {}, el("strong", { text: "Categories" }), el("small", { text: "Organise your collections" })), icon("chevron_right")),
        el("a", { class: "ka-quick-link", href: "/collections.html", target: "_blank", rel: "noopener" }, icon("open_in_new"), el("span", {}, el("strong", { text: "View live website" }), el("small", { text: "See what customers see" })), icon("chevron_right"))))));
}
