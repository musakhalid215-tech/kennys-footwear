import { el, icon, toast, loading, clear } from "../ui.js";
import * as api from "../api.js";
import { pageHeader, adminImg } from "./shared.js";

const PRESET_SIZES = ["36", "37", "38", "39", "40", "41", "42", "43", "44", "45", "46", "47"];
const uid = () => Math.random().toString(36).slice(2);

export async function render(page, ctx, match) {
  const editId = match && match[1] ? match[1] : null;
  const [cats, existing] = await Promise.all([api.listCategories(), editId ? api.getProduct(editId) : null]);

  if (editId && !existing) {
    page.append(pageHeader("Product not found"), el("div", { class: "ka-card ka-empty" },
      el("p", { text: "This product no longer exists." }), el("a", { class: "ka-btn", href: "#/products" }, "Back to All Products")));
    return;
  }
  if (!cats.length) {
    page.append(pageHeader("Add Product"), el("div", { class: "ka-card ka-empty" },
      el("p", { text: "Create at least one category before adding products." }), el("a", { class: "ka-btn ka-btn-primary", href: "#/categories" }, "Go to Categories")));
    return;
  }

  // ---------- state ----------
  const state = {
    images: existing ? existing.product_images.map((i) => ({ key: uid(), id: i.id, url: i.url, storagePath: i.storage_path })) : [],
    removed: [],
    sizes: new Set(existing ? existing.sizes : []),
    gender: existing ? existing.gender : "",
    status: existing ? existing.status : "available",
    saving: false
  };

  page.append(pageHeader(editId ? "Edit Product" : "Add New Product",
    editId ? "Changes appear on your website as soon as you save." : "Fill in the details, add pictures, then publish.",
    el("a", { class: "ka-btn", href: "#/products" }, icon("arrow_back"), "All Products")));

  // ---------- helpers ----------
  const errors = {};
  const errEls = {};
  const field = (key, label, control, hint, opts = {}) => {
    const e = el("p", { class: "ka-error", id: "err-" + key, role: "alert" });
    errEls[key] = e;
    return el("div", { class: "ka-field " + (opts.cls || "") },
      el("label", { class: "ka-label", for: opts.noFor ? null : "f-" + key }, label, opts.required ? el("span", { class: "ka-req", "aria-hidden": "true", text: " *" }) : null),
      control, hint ? el("p", { class: "ka-hint", text: hint }) : null, e);
  };
  const showErrors = (errs) => {
    Object.keys(errEls).forEach((k) => { errEls[k].textContent = errs[k] || ""; });
    const first = Object.keys(errs)[0];
    if (first) {
      const target = document.getElementById("f-" + first) || errEls[first];
      if (target) { target.scrollIntoView({ behavior: "smooth", block: "center" }); if (target.focus) target.focus({ preventScroll: true }); }
    }
  };

  // ---------- inputs ----------
  const name = el("input", { class: "ka-input", id: "f-name", type: "text", maxlength: "120", autocomplete: "off", value: existing ? existing.name : "", placeholder: "e.g. The Classic Slide" });
  const price = el("input", { class: "ka-input ka-input-money", id: "f-price", type: "number", min: "0", step: "0.01", inputmode: "decimal", value: existing && existing.price !== null ? existing.price : "", placeholder: "0.00" });
  const prev = el("input", { class: "ka-input ka-input-money", id: "f-previous_price", type: "number", min: "0", step: "0.01", inputmode: "decimal", value: existing && existing.previous_price !== null ? existing.previous_price : "", placeholder: "Optional" });
  const desc = el("textarea", { class: "ka-input", id: "f-description", rows: "5", maxlength: "2000", placeholder: "Describe the material, comfort, style…" });
  desc.value = existing ? existing.description : "";
  const descCount = el("span", { class: "ka-hint ka-count-chars" });
  const updateCount = () => { descCount.textContent = `${desc.value.length} / 2000`; };
  desc.addEventListener("input", updateCount); updateCount();

  const category = el("select", { class: "ka-input", id: "f-category" },
    el("option", { value: "", text: "Choose a category…" }), cats.map((c) => el("option", { value: c.slug, text: c.name })));
  category.value = existing ? existing.category : "";
  const colour = el("input", { class: "ka-input", id: "f-colour", type: "text", maxlength: "60", value: existing && existing.colour ? existing.colour : "", placeholder: "e.g. Black, Tan, As shown" });

  // gender (segmented control)
  const genderBox = el("div", { class: "ka-seg", role: "radiogroup", "aria-label": "Gender category", id: "f-gender", tabindex: "-1" });
  const clearErr = (k) => { if (errEls[k]) errEls[k].textContent = ""; };
  const drawGender = () => {
    clearErr("gender");
    clear(genderBox);
    [["men", "Men"], ["women", "Women"], ["unisex", "Unisex"]].forEach(([v, l]) =>
      genderBox.append(el("button", { type: "button", role: "radio", "aria-checked": String(state.gender === v), class: "ka-seg-btn" + (state.gender === v ? " is-on" : ""), onClick: () => { state.gender = v; drawGender(); } }, l)));
  };
  drawGender();

  // availability (radio cards)
  const statusBox = el("div", { class: "ka-radios", role: "radiogroup", "aria-label": "Availability", id: "f-status", tabindex: "-1" });
  const STATUS_OPTS = [
    ["available", "Available", "Shown on the website and open for enquiries."],
    ["sold_out", "Sold Out", "Shown on the website with a clear “Sold Out” label."],
    ["hidden", "Hidden / Unpublished", "Not shown to customers. Use for drafts."]
  ];
  const drawStatus = () => {
    clear(statusBox);
    STATUS_OPTS.forEach(([v, l, d]) => statusBox.append(
      el("button", { type: "button", role: "radio", "aria-checked": String(state.status === v), class: "ka-radio" + (state.status === v ? " is-on" : ""), onClick: () => { state.status = v; drawStatus(); } },
        el("span", { class: "ka-radio-dot" }), el("span", {}, el("strong", { text: l }), el("small", { text: d })))));
  };
  drawStatus();

  // sizes
  const sizeBox = el("div", { class: "ka-chips", id: "f-sizes", tabindex: "-1", role: "group", "aria-label": "Available sizes" });
  const customSize = el("input", { class: "ka-input ka-input-sm", type: "text", maxlength: "10", placeholder: "Other size", "aria-label": "Add a custom size" });
  const drawSizes = () => {
    clearErr("sizes");
    clear(sizeBox);
    const all = api.sortSizes([...PRESET_SIZES, ...state.sizes]);
    all.forEach((s) => sizeBox.append(el("button", { type: "button", class: "ka-chip" + (state.sizes.has(s) ? " is-on" : ""), "aria-pressed": String(state.sizes.has(s)), onClick: () => { state.sizes.has(s) ? state.sizes.delete(s) : state.sizes.add(s); drawSizes(); } }, s)));
  };
  const addCustom = () => {
    const v = customSize.value.trim();
    if (!v) return;
    if (!/^[A-Za-z0-9./ -]{1,10}$/.test(v)) { toast("Sizes can only contain letters, numbers, spaces, / . and -", "error"); return; }
    state.sizes.add(v); customSize.value = ""; drawSizes();
  };
  customSize.addEventListener("keydown", (e) => { if (e.key === "Enter") { e.preventDefault(); addCustom(); } });
  const preset = (label, list) => el("button", { type: "button", class: "ka-btn ka-btn-sm", onClick: () => { state.sizes = new Set(list); drawSizes(); } }, label);
  drawSizes();

  // ---------- pictures ----------
  const gallery = el("div", { class: "ka-tiles", id: "f-images", tabindex: "-1" });
  const fileInput = el("input", { type: "file", id: "f-file", class: "ka-sr", accept: "image/jpeg,image/png,image/webp", multiple: true });
  const dropLabel = el("label", { class: "ka-drop", for: "f-file" }, icon("add_photo_alternate"),
    el("strong", { text: "Add pictures" }), el("span", { text: "Tap to choose, or drop pictures here. JPG, PNG or WebP." }));
  const busy = el("p", { class: "ka-hint", hidden: true });

  const revoke = (img) => { if (img.preview) URL.revokeObjectURL(img.preview); };

  async function toItem(file) {
    const { blob, type } = await api.prepareImage(file);
    return { key: uid(), blob, type, name: file.name, preview: URL.createObjectURL(blob) };
  }

  async function addFiles(fileList) {
    const files = [...fileList];
    if (!files.length) return;
    busy.hidden = false; busy.textContent = "Preparing pictures…";
    for (const f of files) {
      if (state.images.length >= api.LIMITS.maxImages) { toast(`You can add up to ${api.LIMITS.maxImages} pictures.`, "error"); break; }
      try { state.images.push(await toItem(f)); drawImages(); }
      catch (e) { toast(e.message, "error"); }
    }
    busy.hidden = true; fileInput.value = "";
  }
  fileInput.addEventListener("change", () => addFiles(fileInput.files));
  ["dragenter", "dragover"].forEach((ev) => dropLabel.addEventListener(ev, (e) => { e.preventDefault(); dropLabel.classList.add("is-over"); }));
  ["dragleave", "drop"].forEach((ev) => dropLabel.addEventListener(ev, (e) => { e.preventDefault(); dropLabel.classList.remove("is-over"); }));
  dropLabel.addEventListener("drop", (e) => addFiles(e.dataTransfer.files));

  function move(i, to) {
    const [it] = state.images.splice(i, 1);
    state.images.splice(to, 0, it);
    drawImages();
  }
  function removeImage(i) {
    const [it] = state.images.splice(i, 1);
    if (it.id && !it.blob) state.removed.push({ id: it.id, storagePath: it.storagePath });
    revoke(it); drawImages();
  }
  function replaceImage(i) {
    const inp = el("input", { type: "file", accept: "image/jpeg,image/png,image/webp" });
    inp.addEventListener("change", async () => {
      if (!inp.files[0]) return;
      try {
        const item = await toItem(inp.files[0]);
        const old = state.images[i];
        if (old.id && !old.blob) state.removed.push({ id: old.id, storagePath: old.storagePath });
        revoke(old);
        state.images[i] = item; drawImages();
      } catch (e) { toast(e.message, "error"); }
    });
    inp.click();
  }

  const iconBtn = (name, label, fn) => el("button", { type: "button", class: "ka-iconbtn", title: label, "aria-label": label, onClick: fn }, icon(name));
  function drawImages() {
    if (state.images.length) clearErr("images");
    clear(gallery);
    state.images.forEach((img, i) => {
      gallery.append(el("div", { class: "ka-tile" + (i === 0 ? " is-main" : "") },
        el("img", { src: img.preview || adminImg(img.url), alt: `Picture ${i + 1}` }),
        i === 0 ? el("span", { class: "ka-tile-tag", text: "Main picture" }) : (img.blob ? el("span", { class: "ka-tile-tag ka-tile-new", text: "New" }) : null),
        el("div", { class: "ka-tile-actions" },
          i > 0 ? iconBtn("star", "Make main picture", () => move(i, 0)) : null,
          i > 0 ? iconBtn("chevron_left", "Move earlier", () => move(i, i - 1)) : null,
          i < state.images.length - 1 ? iconBtn("chevron_right", "Move later", () => move(i, i + 1)) : null,
          iconBtn("swap_horiz", "Replace picture", () => replaceImage(i)),
          iconBtn("delete", "Remove picture", () => removeImage(i)))));
    });
    gallery.classList.toggle("is-empty", !state.images.length);
    dropLabel.hidden = state.images.length >= api.LIMITS.maxImages;
  }
  drawImages();

  // ---------- layout ----------
  const form = el("form", { class: "ka-form", novalidate: true });
  const progress = el("p", { class: "ka-progress", role: "status", hidden: true });
  const saveBtn = el("button", { class: "ka-btn ka-btn-primary ka-btn-lg", type: "submit" },
    icon("cloud_upload"), editId ? "Save changes" : "Publish product");

  form.append(
    el("div", { class: "ka-card" }, el("h2", { text: "Basic information" }),
      field("name", "Product name", name, null, { required: true }),
      el("div", { class: "ka-cols" },
        field("price", "Price (₦)", price, "Leave empty to show “Contact for price”."),
        field("previous_price", "Previous price (₦)", prev, "Optional. Shown crossed out to highlight a discount.")),
      field("description", "Description", el("div", {}, desc, descCount))),
    el("div", { class: "ka-card" }, el("h2", { text: "Organise" }),
      el("div", { class: "ka-cols" },
        field("category", "Category", category, null, { required: true }),
        field("colour", "Colour", colour)),
      field("gender", "Gender category", genderBox, null, { required: true, noFor: true })),
    el("div", { class: "ka-card" }, el("h2", { text: "Sizes" }),
      field("sizes", "Available sizes", el("div", {}, el("div", { class: "ka-presets" }, preset("Men 40–44", ["40", "41", "42", "43", "44"]), preset("Women 37–41", ["37", "38", "39", "40", "41"]), preset("Clear", [])), sizeBox,
        el("div", { class: "ka-addsize" }, customSize, el("button", { type: "button", class: "ka-btn ka-btn-sm", onClick: addCustom }, icon("add"), "Add size"))), null, { required: true, noFor: true })),
    el("div", { class: "ka-card" }, el("h2", { text: "Pictures" }),
      el("p", { class: "ka-hint", text: "The first picture is the main picture shown on the catalogue. Use the buttons on each picture to make it main, reorder, replace or remove it." }),
      field("images", "Product pictures", el("div", {}, gallery, dropLabel, fileInput, busy), null, { required: true, noFor: true })),
    el("div", { class: "ka-card" }, el("h2", { text: "Availability" }),
      field("status", "Who can see this product?", statusBox, null, { noFor: true })),
    el("div", { class: "ka-savebar" }, progress,
      el("a", { class: "ka-btn", href: "#/products" }, "Cancel"), saveBtn));

  const setSaving = (on, text) => {
    state.saving = on;
    saveBtn.disabled = on; form.classList.toggle("is-saving", on);
    progress.hidden = !on; if (text !== undefined) progress.textContent = text;
  };

  [["name", name], ["price", price], ["previous_price", prev], ["description", desc], ["category", category], ["colour", colour]]
    .forEach(([k, n]) => n.addEventListener("input", () => clearErr(k)));

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (state.saving) return;
    const fields = {
      name: name.value, price: price.value, previous_price: prev.value, description: desc.value,
      category: category.value, gender: state.gender, sizes: [...state.sizes], colour: colour.value, status: state.status
    };
    const errs = api.validateProduct(fields, state.images.length);
    showErrors(errs);
    if (Object.keys(errs).length) { toast("Please fix the highlighted fields.", "error"); return; }

    setSaving(true, "Starting…");
    try {
      if (editId) {
        const r = await api.updateProduct(editId, fields, state.images, state.removed, (t) => setSaving(true, t));
        toast(r.leftovers ? "Saved. Some old picture files could not be cleaned up from storage." : "Product updated. It's live on your website.", r.leftovers ? "info" : "success");
      } else {
        await api.createProduct(fields, state.images, (t) => setSaving(true, t));
        toast(fields.status === "hidden" ? "Product saved as Hidden." : "Product published. It's live on your website.");
      }
      state.images.forEach(revoke);
      location.hash = "#/products";
    } catch (err) {
      setSaving(false);
      toast(api.friendlyError(err), "error", 8000);
    }
  });

  page.append(form);
}
