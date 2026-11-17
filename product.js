// ========================================
// PRODUCT DATA
// Built-in list of the original designs. It is now only a FALLBACK: when
// the Supabase catalogue is live, products come from the database instead
// (see js/kx-client.js). It is used if the database is not configured or
// cannot be reached.
// ========================================

const products = {
  girly: {
    name: "Girly",
    category: "Women's • Premium",
    image: "images/girly.png",
    description:
      "A stylish and elegant design made for effortless everyday looks.",
    price: "Contact for price",
    sizes: ["37", "38", "39", "40", "41"],
    color: "As shown"
  },

  cool: {
    name: "Cool",
    category: "Unisex • Casual",
    image: "images/Screenshot 2026-09-05 162527.png",
    description:
      "A clean contemporary silhouette built around comfort and character.",
    price: "Contact for price",
    sizes: ["40", "41", "42", "43", "44"],
    color: "As shown"
  },

  slick: {
    name: "Slick",
    category: "Men's • Premium",
    image: "images/slick.png",
    description:
      "A sharp modern design for those who prefer a confident finish.",
    price: "Contact for price",
    sizes: ["40", "41", "42", "43", "44"],
    color: "As shown"
  },

  backgirl: {
    name: "Back Girl",
    category: "Women's • Casual",
    image: "images/cool.png",
    description:
      "A distinctive feminine silhouette with a bold and expressive feel.",
    price: "Contact for price",
    sizes: ["37", "38", "39", "40", "41"],
    color: "As shown"
  },

  urban: {
    name: "Urban",
    category: "Men's • Casual",
    image: "images/Screenshot 2026-09-04 044049.png",
    description:
      "Designed for everyday movement with a relaxed modern aesthetic.",
    price: "Contact for price",
    sizes: ["40", "41", "42", "43", "44"],
    color: "As shown"
  },

  elegant: {
    name: "Elegant",
    category: "Women's • Premium",
    image: "images/black-girl.png",
    description:
      "A refined silhouette designed to bring sophistication to every step.",
    price: "Contact for price",
    sizes: ["37", "38", "39", "40", "41"],
    color: "As shown"
  },

  classic: {
    name: "Classic",
    category: "Men's • Premium",
    image: "images/classic.png",
    description:
      "A timeless design that keeps things simple, versatile and refined.",
    price: "Contact for price",
    sizes: ["40", "41", "42", "43", "44"],
    color: "As shown"
  },

  chic: {
    name: "Chic",
    category: "Women's • Casual",
    image: "images/chick.png",
    description:
      "A fashionable everyday piece with a confident contemporary edge.",
    price: "Contact for price",
    sizes: ["37", "38", "39", "40", "41"],
    color: "As shown"
  },

  prime: {
    name: "Prime",
    category: "Men's • Premium",
    image: "images/bella.jpeg",
    description:
      "Built around a strong silhouette, lasting comfort and everyday style.",
    price: "Contact for price",
    sizes: ["40", "41", "42", "43", "44"],
    color: "As shown"
  },

  bella: {
    name: "Bella",
    category: "Women's • Premium",
    image: "images/bel.jpeg",
    description:
      "A graceful design created for effortless style and versatility.",
    price: "Contact for price",
    sizes: ["37", "38", "39", "40", "41"],
    color: "As shown"
  },

  edge: {
    name: "Edge",
    category: "Men's • Casual",
    image: "images/edgee.jpeg",
    description:
      "A bold contemporary silhouette made to stand apart from the crowd.",
    price: "Contact for price",
    sizes: ["40", "41", "42", "43", "44"],
    color: "As shown"
  },

  glam: {
    name: "Glam",
    category: "Women's • Premium",
    image: "images/glam.jpeg",
    description:
      "A statement design combining elegance with a modern personality.",
    price: "Contact for price",
    sizes: ["37", "38", "39", "40", "41"],
    color: "As shown"
  },

  force: {
    name: "Force",
    category: "Men's • Casual",
    image: "images/force.jpeg",
    description:
      "A strong everyday design built for comfort and confident styling.",
    price: "Contact for price",
    sizes: ["40", "41", "42", "43", "44"],
    color: "As shown"
  },

  dream: {
    name: "Dream",
    category: "Women's • Casual",
    image: "images/dream.jpeg",
    description:
      "A soft and stylish silhouette designed to complement any look.",
    price: "Contact for price",
    sizes: ["37", "38", "39", "40", "41"],
    color: "As shown"
  },

  royal: {
    name: "Royal",
    category: "Premium",
    image: "images/royal.jpeg",
    description:
      "A sophisticated statement piece created with a premium feel.",
    price: "Contact for price",
    sizes: ["39", "40", "41", "42", "43", "44"],
    color: "As shown"
  },

  fresh: {
    name: "Fresh",
    category: "Unisex • Casual",
    image: "images/fresh.jpeg",
    description:
      "A versatile modern design bringing a fresh perspective to everyday footwear.",
    price: "Contact for price",
    sizes: ["39", "40", "41", "42", "43", "44"],
    color: "As shown"
  },

  luxe: {
    name: "Luxe",
    category: "Premium",
    image: "images/luxe.jpeg",
    description:
      "A polished design for those who appreciate a more elevated look.",
    price: "Contact for price",
    sizes: ["37", "38", "39", "40", "41", "42"],
    color: "As shown"
  },

  icon: {
    name: "Icon",
    category: "Signature",
    image: "images/sig.jpeg",
    description:
      "A standout silhouette representing the character of Kenny's Authentic Footwear.",
    price: "Contact for price",
    sizes: ["39", "40", "41", "42", "43", "44"],
    color: "As shown"
  },

  urbanrunner: {
    name: "The Urban Runner",
    category: "Men's • Featured",
    image: "images/1.jpg",
    description:
      "A clean everyday silhouette designed for effortless movement and modern style.",
    price: "Contact for price",
    sizes: ["40", "41", "42", "43", "44"],
    color: "As shown"
  },

  crossstrap: {
    name: "The Cross-Strap",
    category: "Men's • Casual",
    image: "images/black.png",
    description:
      "A distinctive design that combines relaxed comfort with a bold and confident finish.",
    price: "Contact for price",
    sizes: ["40", "41", "42", "43", "44"],
    color: "As shown"
  },

  dailyslipon: {
    name: "The Daily Slip-On",
    category: "Men's • Casual",
    image: "images/sliver.png",
    description:
      "Simple, versatile and easy to wear — built for everyday moments without compromising style.",
    price: "Contact for price",
    sizes: ["40", "41", "42", "43", "44"],
    color: "As shown"
  },

  classicessential: {
    name: "Classic Essential",
    category: "Men's • Premium",
    image: "images/sweet.png",
    description:
      "A timeless silhouette created for those who prefer understated design with a refined finish.",
    price: "Contact for price",
    sizes: ["40", "41", "42", "43", "44"],
    color: "As shown"
  },

  streetedition: {
    name: "The Street Edition",
    category: "Men's • Casual",
    image: "images/plenty.png",
    description:
      "Inspired by modern street style, created for people who want their footwear to make an impression.",
    price: "Contact for price",
    sizes: ["40", "41", "42", "43", "44"],
    color: "As shown"
  },

  signatureseries: {
    name: "Signature Series",
    category: "Men's • Premium",
    image: "images/bueauty.png",
    description:
      "A statement design representing the character and craftsmanship behind Kenny's Authentic Footwear.",
    price: "Contact for price",
    sizes: ["40", "41", "42", "43", "44"],
    color: "As shown"
  }
};


// ========================================
// GET PRODUCT FROM URL
// ========================================

const params = new URLSearchParams(window.location.search);
const productId = params.get("product");

const DEFAULT_WHATSAPP = "2347038313960";


// ========================================
// NORMALISE PRODUCTS (built-in or database)
// ========================================

function fromStatic(id) {
  const p = products[id];
  if (!p) return null;
  return {
    slug: id,
    name: p.name,
    categoryLabel: p.category,
    description: p.description,
    price: null,
    priceText: p.price,
    previousPriceText: "",
    images: [p.image],
    sizes: p.sizes,
    colour: p.color,
    status: "available"
  };
}

function fromDatabase(p, categories) {
  const cat = (categories || []).find(c => c.slug === p.category);
  const catName = cat ? cat.name : KX.titleCase(p.category);
  return {
    slug: p.slug,
    name: p.name,
    categoryLabel: `${KX.GENDER_LABEL[p.gender]} • ${catName}`,
    description: p.description,
    price: p.price,
    priceText: KX.formatPrice(p.price) || "Contact for price",
    previousPriceText: KX.formatPrice(p.previousPrice) || "",
    images: p.images.length ? p.images : [],
    sizes: p.sizes,
    colour: p.colour || "",
    status: p.status
  };
}


// ========================================
// SMALL HELPERS
// ========================================

function setContent(selector, attr, value) {
  const node = document.querySelector(selector);
  if (node) node.setAttribute(attr, value);
}

function absoluteImage(url) {
  return /^https?:\/\//i.test(url)
    ? url
    : `https://kennysfootwear.com/${encodeURI(url)}`;
}


// ========================================
// DISPLAY PRODUCT
// ========================================

function renderProduct(product, whatsappNumber) {

  const soldOut = product.status === "sold_out";
  const images = product.images.length ? product.images : ["images/1.jpg"];

  // ----------------------------------------
  // PRODUCT SEO
  // ----------------------------------------

  const pageTitle =
    `${product.name} | Kenny's Authentic Footwear`;

  const pageDescription =
    `${product.description} Explore ${product.name} from Kenny's Authentic Footwear. View available sizes, colour and product details.`;

  const productURL =
    `https://kennysfootwear.com/product.html?product=${encodeURIComponent(product.slug)}`;

  const productImageURL = absoluteImage(images[0]);

  document.title = pageTitle;
  setContent('meta[name="description"]', "content", pageDescription);
  setContent('link[rel="canonical"]', "href", productURL);

  // Open Graph
  setContent('meta[property="og:title"]', "content", pageTitle);
  setContent('meta[property="og:description"]', "content", pageDescription);
  setContent('meta[property="og:url"]', "content", productURL);
  setContent('meta[property="og:image"]', "content", productImageURL);


  // ----------------------------------------
  // TEXT DETAILS
  // ----------------------------------------

  document.getElementById("productName").textContent = product.name;
  document.getElementById("productCategory").textContent = product.categoryLabel;
  document.getElementById("productDescription").textContent = product.description;
  document.getElementById("productPrice").textContent = product.priceText;
  document.getElementById("productColor").textContent = product.colour || "—";

  const previous = document.getElementById("productPreviousPrice");
  if (previous && product.previousPriceText) {
    previous.textContent = product.previousPriceText;
    previous.hidden = false;
  }

  const availability = document.getElementById("productAvailability");
  if (availability) {
    availability.textContent = soldOut ? "Sold Out" : "Available";
    availability.className = "kx-badge" + (soldOut ? " kx-badge-sold" : "");
  }


  // ----------------------------------------
  // IMAGE GALLERY (main image + thumbnails + arrows + swipe)
  // ----------------------------------------

  const mainImage = document.getElementById("productImage");
  const thumbs = document.getElementById("productThumbs");
  const prevBtn = document.getElementById("productPrev");
  const nextBtn = document.getElementById("productNext");
  const counter = document.getElementById("productCounter");
  const encode = u => (/^https?:\/\//i.test(u) ? u : encodeURI(u));
  let current = 0;

  function showImage(index) {
    current = (index + images.length) % images.length;
    mainImage.src = encode(images[current]);
    mainImage.alt = images.length > 1
      ? `${product.name} - image ${current + 1} of ${images.length}`
      : `${product.name} - Kenny's Authentic Footwear`;
    if (counter) counter.textContent = `${current + 1} / ${images.length}`;
    if (thumbs) {
      [...thumbs.children].forEach((t, i) => {
        t.classList.toggle("kx-active", i === current);
        t.setAttribute("aria-current", i === current ? "true" : "false");
      });
    }
  }

  if (thumbs) {
    thumbs.innerHTML = "";
    images.forEach((url, i) => {
      const thumb = document.createElement("button");
      thumb.type = "button";
      thumb.className = "kx-thumb";
      thumb.setAttribute("aria-label", `Show image ${i + 1}`);
      const t = document.createElement("img");
      t.src = encode(url);
      t.alt = "";
      t.loading = "lazy";
      thumb.appendChild(t);
      thumb.addEventListener("click", () => showImage(i));
      thumbs.appendChild(thumb);
    });
  }

  const multiple = images.length > 1;
  [prevBtn, nextBtn, counter, thumbs].forEach(n => { if (n) n.hidden = !multiple; });

  if (multiple) {
    if (prevBtn) prevBtn.addEventListener("click", () => showImage(current - 1));
    if (nextBtn) nextBtn.addEventListener("click", () => showImage(current + 1));

    document.addEventListener("keydown", e => {
      const tag = (e.target.tagName || "").toLowerCase();
      if (tag === "input" || tag === "textarea" || tag === "select") return;
      if (e.key === "ArrowLeft") showImage(current - 1);
      if (e.key === "ArrowRight") showImage(current + 1);
    });

    let startX = null;
    mainImage.addEventListener("touchstart", e => { startX = e.touches[0].clientX; }, { passive: true });
    mainImage.addEventListener("touchend", e => {
      if (startX === null) return;
      const dx = e.changedTouches[0].clientX - startX;
      startX = null;
      if (Math.abs(dx) > 40) showImage(current + (dx < 0 ? 1 : -1));
    });
  }

  showImage(0);


  // ----------------------------------------
  // PRODUCT STRUCTURED DATA
  // ----------------------------------------

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.name,
    "description": product.description,
    "image": images.map(absoluteImage),
    "brand": {
      "@type": "Brand",
      "name": "Kenny's Authentic Footwear"
    },
    "category": product.categoryLabel
  };

  if (product.price) {
    structuredData.offers = {
      "@type": "Offer",
      "priceCurrency": "NGN",
      "price": String(product.price),
      "availability": soldOut
        ? "https://schema.org/OutOfStock"
        : "https://schema.org/InStock",
      "url": productURL
    };
  }

  const structuredDataScript = document.createElement("script");
  structuredDataScript.type = "application/ld+json";
  structuredDataScript.textContent = JSON.stringify(structuredData);
  document.head.appendChild(structuredDataScript);


  // ----------------------------------------
  // SIZES
  // ----------------------------------------

  const sizesContainer = document.getElementById("productSizes");
  sizesContainer.innerHTML = "";

  let selectedSize = "";

  product.sizes.forEach(size => {

    const sizeButton = document.createElement("button");

    sizeButton.textContent = size;
    sizeButton.className = "size-btn";
    sizeButton.type = "button";

    sizeButton.addEventListener("click", () => {
      selectedSize = selectedSize === size ? "" : size;
      [...sizesContainer.children].forEach(b =>
        b.classList.toggle("kx-selected", b.textContent === selectedSize)
      );
      updateWhatsApp();
    });

    sizesContainer.appendChild(sizeButton);

  });

  if (!product.sizes.length) {
    sizesContainer.textContent = "Contact us for available sizes.";
  }


  // ----------------------------------------
  // WHATSAPP
  // ----------------------------------------

  const whatsappButton = document.getElementById("whatsappButton");
  const number = /^\d{8,15}$/.test(whatsappNumber || "")
    ? whatsappNumber
    : DEFAULT_WHATSAPP;

  function updateWhatsApp() {
    let message = soldOut
      ? `Hello Kenny's Authentic Footwear, I saw that the ${product.name} is sold out. Will it be available again?`
      : `Hello Kenny's Authentic Footwear, I am interested in the ${product.name}. Please provide more information.`;

    if (selectedSize && !soldOut) message += ` I am interested in size ${selectedSize}.`;

    whatsappButton.href =
      `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
  }

  if (soldOut && whatsappButton.firstChild) {
    whatsappButton.firstChild.nodeValue = "Ask About Restock ";
  }

  updateWhatsApp();

}


// ========================================
// PRODUCT NOT FOUND
// ========================================

function renderNotFound() {

  const productName =
    document.getElementById("productName");

  const productDescription =
    document.getElementById("productDescription");

  if (productName && productDescription) {

    document.title =
      "Product Not Found | Kenny's Authentic Footwear";

    productName.textContent =
      "Product Not Found";

    productDescription.textContent =
      "Sorry, we couldn't find the product you're looking for.";

    const thumbs = document.getElementById("productThumbs");
    if (thumbs) thumbs.hidden = true;

  }

}


// ========================================
// START: database first, built-in list as fallback
// ========================================

async function loadProduct() {

  if (!document.getElementById("productName")) return;

  let product = null;
  let whatsapp = "";

  if (window.KX && KX.ready) {
    try {
      const settings = await KX.getSettings();
      whatsapp = settings.whatsapp;

      if (settings.live) {
        const [row, categories] = await Promise.all([
          KX.fetchProductBySlug(productId),
          KX.fetchCategories().catch(() => [])
        ]);
        product = row ? fromDatabase(row, categories) : null;
      } else {
        product = fromStatic(productId);
      }
    } catch (error) {
      // Database unreachable: use the built-in list so the page still works.
      product = fromStatic(productId);
    }
  } else {
    product = fromStatic(productId);
  }

  if (product) {
    renderProduct(product, whatsapp);
  } else {
    renderNotFound();
  }

}

loadProduct();
