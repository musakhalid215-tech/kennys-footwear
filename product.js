// ========================================
// PRODUCT DATA
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
const product = products[productId];


// ========================================
// DISPLAY PRODUCT
// ========================================

if (product && document.getElementById("productName")) {

  // ----------------------------------------
  // PRODUCT SEO
  // ----------------------------------------

  const pageTitle =
    `${product.name} | Kenny's Authentic Footwear`;

  const pageDescription =
    `${product.description} Explore ${product.name} from Kenny's Authentic Footwear. View available sizes, colour and product details.`;

  const productURL =
    `https://kennysfootwear.com/product.html?product=${encodeURIComponent(productId)}`;

  const productImageURL =
    `https://kennysfootwear.com/${product.image}`;


  // Browser title
  document.title = pageTitle;


  // Meta description
  let metaDescription =
    document.querySelector('meta[name="description"]');

  if (metaDescription) {
    metaDescription.setAttribute(
      "content",
      pageDescription
    );
  }


  // Canonical URL
  let canonical =
    document.querySelector('link[rel="canonical"]');

  if (canonical) {
    canonical.setAttribute(
      "href",
      productURL
    );
  }


  // ----------------------------------------
  // OPEN GRAPH
  // ----------------------------------------

  const ogTitle =
    document.querySelector('meta[property="og:title"]');

  if (ogTitle) {
    ogTitle.setAttribute(
      "content",
      pageTitle
    );
  }


  const ogDescription =
    document.querySelector('meta[property="og:description"]');

  if (ogDescription) {
    ogDescription.setAttribute(
      "content",
      pageDescription
    );
  }


  const ogURL =
    document.querySelector('meta[property="og:url"]');

  if (ogURL) {
    ogURL.setAttribute(
      "content",
      productURL
    );
  }


  const ogImage =
    document.querySelector('meta[property="og:image"]');

  if (ogImage) {
    ogImage.setAttribute(
      "content",
      productImageURL
    );
  }


  // ----------------------------------------
  // PRODUCT DISPLAY
  // ----------------------------------------

  document.getElementById("productImage").src =
    product.image;

  document.getElementById("productImage").alt =
    `${product.name} - Kenny's Authentic Footwear`;

  document.getElementById("productName").textContent =
    product.name;

  document.getElementById("productCategory").textContent =
    product.category;

  document.getElementById("productDescription").textContent =
    product.description;

  document.getElementById("productPrice").textContent =
    product.price;

  document.getElementById("productColor").textContent =
    product.color;


  // ========================================
  // PRODUCT STRUCTURED DATA
  // ========================================

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.name,
    "description": product.description,
    "image": [
      productImageURL
    ],
    "brand": {
      "@type": "Brand",
      "name": "Kenny's Authentic Footwear"
    },
    "category": product.category
  };


  const structuredDataScript =
    document.createElement("script");

  structuredDataScript.type =
    "application/ld+json";

  structuredDataScript.textContent =
    JSON.stringify(structuredData);

  document.head.appendChild(
    structuredDataScript
  );


  // ========================================
  // SIZES
  // ========================================

  const sizesContainer =
    document.getElementById("productSizes");

  sizesContainer.innerHTML = "";

  product.sizes.forEach(size => {

    const sizeButton =
      document.createElement("button");

    sizeButton.textContent = size;
    sizeButton.className = "size-btn";

    sizesContainer.appendChild(sizeButton);

  });


  // ========================================
  // WHATSAPP
  // ========================================

  const message =
    `Hello Kenny's Authentic Footwear, I am interested in the ${product.name}. Please provide more information.`;

  const whatsappURL =
    `https://wa.me/2347038313960?text=${encodeURIComponent(message)}`;

  document.getElementById("whatsappButton").href =
    whatsappURL;

}


// ========================================
// PRODUCT NOT FOUND
// ========================================

else {

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

  }

}