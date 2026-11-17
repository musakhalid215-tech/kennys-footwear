import { el } from "../ui.js";

// Original images are stored as "images/x.jpg" (relative to the site root);
// the admin lives at /admin/, so make them root-relative.
export const adminImg = (u) => (/^https?:\/\//i.test(u) ? u : "/" + encodeURI(String(u).replace(/^\//, "")));

export function pageHeader(title, subtitle, actions) {
  return el("div", { class: "ka-pagehead" },
    el("div", {}, el("h1", { text: title }), subtitle ? el("p", { class: "ka-sub", text: subtitle }) : null),
    actions ? el("div", { class: "ka-pagehead-actions" }, actions) : null);
}

const LABEL = { available: "Available", sold_out: "Sold Out", hidden: "Hidden" };
export const statusBadge = (s) => el("span", { class: "ka-badge ka-badge-" + s, text: LABEL[s] || s });

export function thumb(product, cls = "") {
  const url = product.product_images && product.product_images[0] && product.product_images[0].url;
  return url
    ? el("img", { class: "ka-thumb " + cls, src: adminImg(url), alt: "", loading: "lazy" })
    : el("span", { class: "ka-thumb ka-thumb-empty " + cls }, "No image");
}

export const GENDERS = { men: "Men's", women: "Women's", unisex: "Unisex" };
