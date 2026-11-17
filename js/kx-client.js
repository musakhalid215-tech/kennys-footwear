/* =====================================================================
   Kenny's Authentic Footwear — shared Supabase client + catalogue helpers
   Namespace: window.KX   (kept separate so it can't clash with script.js)
   Used by collections.html, product.html and the /admin dashboard.
   ===================================================================== */
(function () {
  "use strict";

  var CFG = window.KENNYS_CONFIG || {};
  var KX = (window.KX = window.KX || {});

  // ---------- configuration guard ----------
  function looksLikeSecret(key) {
    if (/^sb_secret_/i.test(key)) return true;
    try {
      var part = key.split(".")[1];
      if (!part) return false;
      var json = JSON.parse(atob(part.replace(/-/g, "+").replace(/_/g, "/")));
      return json.role === "service_role";
    } catch (e) {
      return false;
    }
  }

  KX.configProblem = function () {
    if (!CFG.SUPABASE_URL || !CFG.SUPABASE_ANON_KEY) return "Supabase settings are missing.";
    if (/YOUR-/i.test(CFG.SUPABASE_URL) || /YOUR-/i.test(CFG.SUPABASE_ANON_KEY))
      return "Supabase settings have not been filled in yet.";
    if (!/^https:\/\/[a-z0-9-]+\.supabase\.(co|in)\/?$/i.test(CFG.SUPABASE_URL) &&
        !/^http:\/\/localhost/i.test(CFG.SUPABASE_URL))
      return "SUPABASE_URL does not look like a Supabase project URL.";
    if (looksLikeSecret(CFG.SUPABASE_ANON_KEY))
      return "A secret (service_role) key was detected. Use the public anon/publishable key instead.";
    if (!window.supabase || !window.supabase.createClient) return "The Supabase library did not load.";
    return null;
  };

  KX.config = CFG;
  KX.bucket = CFG.STORAGE_BUCKET || "product-images";

  KX.createClient = function (opts) {
    var problem = KX.configProblem();
    if (problem) return null;
    return window.supabase.createClient(CFG.SUPABASE_URL, CFG.SUPABASE_ANON_KEY, opts || {});
  };

  KX.client = null;
  KX.ready = false;
  // public pages: no login session needed
  if (!document.documentElement.hasAttribute("data-kx-admin")) {
    KX.client = KX.createClient({ auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false } });
    KX.ready = !!KX.client;
  }

  // ---------- formatting helpers ----------
  KX.formatPrice = function (n) {
    if (n === null || n === undefined || n === "" || isNaN(Number(n))) return null;
    return "₦" + Number(n).toLocaleString("en-NG", { maximumFractionDigits: 2 });
  };

  KX.GENDER_LABEL = { men: "Men's", women: "Women's", unisex: "Unisex" };
  KX.STATUS_LABEL = { available: "Available", sold_out: "Sold Out", hidden: "Hidden" };

  KX.titleCase = function (slug) {
    return String(slug || "").replace(/-/g, " ").replace(/\b\w/g, function (c) { return c.toUpperCase(); });
  };

  // relative image paths (existing /images folder) may contain spaces
  KX.imgUrl = function (u) {
    if (!u) return "";
    return /^https?:\/\//i.test(u) ? u : encodeURI(u);
  };

  KX.absoluteUrl = function (u) {
    if (/^https?:\/\//i.test(u)) return u;
    return "https://kennysfootwear.com/" + String(u).replace(/^\//, "");
  };

  KX.productHref = function (slug) {
    return "product.html?product=" + encodeURIComponent(slug);
  };

  // ---------- data access (public, read-only) ----------
  var SELECT =
    "id,slug,name,description,price,previous_price,category,gender,sizes,colour,status,created_at," +
    "product_images(url,position)";

  KX.normalize = function (row) {
    var imgs = (row.product_images || []).slice().sort(function (a, b) { return a.position - b.position; });
    return {
      id: row.id,
      slug: row.slug,
      name: row.name,
      description: row.description || "",
      price: row.price === null ? null : Number(row.price),
      previousPrice: row.previous_price === null ? null : Number(row.previous_price),
      category: row.category,
      gender: row.gender,
      sizes: row.sizes || [],
      colour: row.colour || "",
      status: row.status,
      createdAt: row.created_at,
      images: imgs.map(function (i) { return i.url; })
    };
  };

  var settingsPromise = null;
  KX.getSettings = function () {
    if (!KX.ready) return Promise.reject(new Error("not configured"));
    if (!settingsPromise) {
      settingsPromise = KX.client.from("site_settings").select("key,value").then(function (res) {
        if (res.error) throw res.error;
        var out = {};
        (res.data || []).forEach(function (r) { out[r.key] = r.value; });
        return { live: out.catalogue_live === "true", whatsapp: out.whatsapp_number || "" };
      });
      settingsPromise.catch(function () { settingsPromise = null; });
    }
    return settingsPromise;
  };

  KX.fetchCategories = function () {
    return KX.client.from("categories").select("name,slug,sort_order").order("sort_order").then(function (res) {
      if (res.error) throw res.error;
      return res.data || [];
    });
  };

  KX.fetchProducts = function (o) {
    o = o || {};
    var q = KX.client.from("products").select(SELECT).in("status", ["available", "sold_out"]).limit(500);
    if (o.gender === "men") q = q.in("gender", ["men", "unisex"]);
    else if (o.gender === "women") q = q.in("gender", ["women", "unisex"]);
    if (o.category) q = q.eq("category", o.category);
    var term = (o.search || "").replace(/[,()%*\\"'`]/g, " ").replace(/\s+/g, " ").trim();
    if (term) q = q.or("name.ilike.%" + term + "%,description.ilike.%" + term + "%");
    if (o.sort === "price_asc") q = q.order("price", { ascending: true, nullsFirst: false });
    else if (o.sort === "price_desc") q = q.order("price", { ascending: false, nullsFirst: false });
    q = q.order("created_at", { ascending: false });
    return q.then(function (res) {
      if (res.error) throw res.error;
      return (res.data || []).map(KX.normalize);
    });
  };

  KX.fetchProductBySlug = function (slug) {
    return KX.client.from("products").select(SELECT).eq("slug", slug).in("status", ["available", "sold_out"])
      .maybeSingle().then(function (res) {
        if (res.error) throw res.error;
        return res.data ? KX.normalize(res.data) : null;
      });
  };

  // live updates: call cb() (debounced) whenever products change
  KX.subscribe = function (cb) {
    if (!KX.ready || !KX.client.channel) return function () {};
    var t;
    try {
      var ch = KX.client
        .channel("kx-products-" + Math.random().toString(36).slice(2))
        .on("postgres_changes", { event: "*", schema: "public", table: "products" }, function () {
          clearTimeout(t);
          t = setTimeout(cb, 400);
        })
        .subscribe();
      return function () { try { KX.client.removeChannel(ch); } catch (e) {} };
    } catch (e) {
      return function () {};
    }
  };
})();
