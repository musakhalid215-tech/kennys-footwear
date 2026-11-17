/* =====================================================================
   collections.html — dynamic product catalogue (search, filters, sort)
   Falls back to the original hard-coded cards if the database is not
   configured or cannot be reached, so the page never goes blank.
   ===================================================================== */
(function () {
  "use strict";
  var staticGrid = document.getElementById("kxStaticGrid");
  var filterBar = document.querySelector(".collection-filters");
  if (!staticGrid || !filterBar || !window.KX) return;

  // The original hard-coded cards stay in the page, untouched (they are the
  // fallback). The live catalogue renders into its own grid beside them.
  var grid = document.createElement("div");
  grid.className = "collection-grid";
  grid.id = "kxProductGrid";
  var countEl, searchEl, sortEl;
  var state = { gender: "", category: "", search: "", sort: "newest" };
  var categoryNames = {};
  var extraButtonsBuilt = false;
  var seq = 0;
  var first = true;

  function el(tag, attrs, kids) {
    var n = document.createElement(tag);
    Object.keys(attrs || {}).forEach(function (k) {
      if (k === "text") n.textContent = attrs[k];
      else n.setAttribute(k, attrs[k]);
    });
    (kids || []).forEach(function (c) { if (c) n.appendChild(c); });
    return n;
  }

  function refreshAnimations() {
    if (window.AOS && typeof AOS.refreshHard === "function") AOS.refreshHard();
    else if (window.AOS && typeof AOS.refresh === "function") AOS.refresh();
  }

  // ---------- rendering ----------
  function skeleton() {
    grid.innerHTML = "";
    for (var i = 0; i < 6; i++) {
      grid.appendChild(
        el("article", { "class": "collection-card kx-skeleton", "aria-hidden": "true" }, [
          el("div", { "class": "kx-sk kx-sk-img" }),
          el("div", { "class": "collection-info" }, [
            el("div", { "class": "kx-sk kx-sk-line kx-short" }),
            el("div", { "class": "kx-sk kx-sk-line" })
          ])
        ])
      );
    }
  }

  function card(p, i) {
    var sold = p.status === "sold_out";
    var tag = sold ? "Sold Out" : (p.category === "featured" || p.category === "signature" ? KX.titleCase(p.category) : "");
    var catName = categoryNames[p.category] || KX.titleCase(p.category);
    var label = KX.GENDER_LABEL[p.gender] + " • " + catName;

    var img = el("img", {
      src: KX.imgUrl(p.images[0] || ""),
      alt: p.name + " – " + label + " footwear",
      loading: "lazy"
    });
    var imageBox = el("div", { "class": "collection-image" }, [img]);
    if (tag) imageBox.appendChild(el("span", { "class": "collection-tag" + (sold ? " kx-tag-soldout" : ""), text: tag }));

    var priceBox = el("div", { "class": "kx-price" });
    var price = KX.formatPrice(p.price);
    if (price) {
      priceBox.appendChild(el("strong", { text: price }));
      var prev = KX.formatPrice(p.previousPrice);
      if (prev) priceBox.appendChild(el("s", { text: prev }));
    } else {
      priceBox.appendChild(el("span", { "class": "kx-ask", text: "Contact for price" }));
    }

    var link = el("a", {
      href: KX.productHref(p.slug), "class": "view-product",
      "aria-label": "View details for " + p.name
    });
    link.appendChild(document.createTextNode("View Details "));
    link.appendChild(el("span", { text: "→" }));

    var info = el("div", { "class": "collection-info" }, [
      el("span", { "class": "product-category", text: label }),
      el("h3", { text: p.name }),
      priceBox,
      p.description ? el("p", { "class": "kx-desc", text: p.description }) : null,
      link
    ]);

    return el("article", {
      "class": "collection-card" + (sold ? " kx-soldout" : ""),
      "data-aos": "fade-up",
      "data-aos-delay": String((i % 3) * 100)
    }, [imageBox, info]);
  }

  function render(list) {
    grid.innerHTML = "";
    grid.removeAttribute("aria-busy");
    grid.classList.remove("kx-reloading");
    countEl.textContent = list.length + (list.length === 1 ? " design" : " designs");
    if (!list.length) {
      var clear = el("button", { "class": "filter-btn", type: "button", text: "Clear search & filters" });
      clear.addEventListener("click", resetAll);
      grid.appendChild(el("div", { "class": "kx-empty" }, [
        el("h3", { text: "No products found" }),
        el("p", { text: "Try a different search, or clear the filters to see everything." }),
        clear
      ]));
      return;
    }
    list.forEach(function (p, i) { grid.appendChild(card(p, i)); });
    refreshAnimations();
  }

  function renderError() {
    grid.innerHTML = "";
    grid.removeAttribute("aria-busy");
    grid.classList.remove("kx-reloading");
    var retry = el("button", { "class": "filter-btn", type: "button", text: "Try again" });
    retry.addEventListener("click", function () { load(); });
    grid.appendChild(el("div", { "class": "kx-empty", role: "alert" }, [
      el("h3", { text: "We couldn't load the collection" }),
      el("p", { text: "Please check your connection and try again." }),
      retry
    ]));
    countEl.textContent = "";
  }

  // ---------- loading ----------
  function buildExtraFilters(list) {
    if (extraButtonsBuilt) return;
    extraButtonsBuilt = true;
    var have = {};
    [].forEach.call(filterBar.querySelectorAll(".filter-btn"), function (b) { have[b.dataset.filter] = true; });
    var seen = {};
    list.forEach(function (p) { seen[p.category] = true; });
    Object.keys(seen).forEach(function (slug) {
      if (have[slug]) return;
      filterBar.appendChild(el("button", {
        "class": "filter-btn", type: "button", "data-filter": slug,
        text: categoryNames[slug] || KX.titleCase(slug)
      }));
    });
  }

  function load() {
    var mine = ++seq;
    if (!first) { grid.setAttribute("aria-busy", "true"); grid.classList.add("kx-reloading"); }
    return KX.fetchProducts(state).then(function (list) {
      if (mine !== seq) return;
      if (first) { first = false; if (!state.category && !state.gender && !state.search) buildExtraFilters(list); }
      render(list);
    }).catch(function () {
      if (mine !== seq) return;
      first = false;
      renderError();
    });
  }

  // ---------- controls ----------
  function syncButtons() {
    [].forEach.call(filterBar.querySelectorAll(".filter-btn"), function (b) {
      var f = b.dataset.filter;
      var on = (f === "all" && !state.gender && !state.category) || f === state.gender || f === state.category;
      b.classList.toggle("active", on);
    });
  }

  function resetAll() {
    state.gender = ""; state.category = ""; state.search = ""; state.sort = "newest";
    searchEl.value = ""; sortEl.value = "newest";
    syncButtons(); load();
  }

  function buildToolbar() {
    searchEl = el("input", {
      type: "search", id: "kxSearch", placeholder: "Search footwear…",
      autocomplete: "off", maxlength: "60", "aria-label": "Search footwear"
    });
    sortEl = el("select", { id: "kxSort", "aria-label": "Sort products" }, [
      el("option", { value: "newest", text: "Newest first" }),
      el("option", { value: "price_asc", text: "Price: low to high" }),
      el("option", { value: "price_desc", text: "Price: high to low" })
    ]);
    countEl = el("span", { "class": "kx-count", "aria-live": "polite" });
    var bar = el("div", { "class": "kx-toolbar" }, [
      el("div", { "class": "kx-search" }, [searchEl]),
      el("div", { "class": "kx-sort" }, [sortEl]),
      countEl
    ]);
    filterBar.parentNode.insertBefore(bar, filterBar.nextSibling);

    var t;
    searchEl.addEventListener("input", function () {
      clearTimeout(t);
      t = setTimeout(function () { state.search = searchEl.value; load(); }, 300);
    });
    sortEl.addEventListener("change", function () { state.sort = sortEl.value; load(); });

    // Delegated so the extra category buttons work too. script.js's own
    // click handler steps aside while body[data-kx-live] is set.
    filterBar.addEventListener("click", function (e) {
      var b = e.target.closest ? e.target.closest(".filter-btn") : null;
      if (!b || !filterBar.contains(b)) return;
      var f = b.dataset.filter;
      if (f === "all") { state.gender = ""; state.category = ""; }
      else if (f === "men" || f === "women") state.gender = state.gender === f ? "" : f;
      else state.category = state.category === f ? "" : f;
      syncButtons();
      load();
    });
  }

  // ---------- start ----------
  function useStatic() {
    document.body.removeAttribute("data-kx-live");
    if (grid.parentNode) grid.parentNode.removeChild(grid);
    staticGrid.hidden = false;
    refreshAnimations();
  }

  if (!KX.ready) return; // not configured: keep the original static cards untouched

  staticGrid.hidden = true;
  staticGrid.parentNode.insertBefore(grid, staticGrid.nextSibling);
  grid.setAttribute("aria-busy", "true");
  skeleton();

  KX.getSettings().then(function (s) {
    if (!s.live) { useStatic(); return; }
    document.body.setAttribute("data-kx-live", "1");
    buildToolbar();
    return KX.fetchCategories().catch(function () { return []; }).then(function (cats) {
      cats.forEach(function (c) { categoryNames[c.slug] = c.name; });
      syncButtons();
      load();
      KX.subscribe(function () { load(); });
    });
  }).catch(useStatic);
})();
