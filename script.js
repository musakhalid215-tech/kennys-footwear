const hamburger = document.getElementById("hamburger");
const navLinks = document.querySelector(".nav-links");


// ================================
// HAMBURGER MENU
// ================================

if (hamburger && navLinks) {

  hamburger.addEventListener("click", () => {

    navLinks.classList.toggle("active");

    if (navLinks.classList.contains("active")) {
      hamburger.textContent = "✕";
    } else {
      hamburger.textContent = "☰";
    }

  });

}


// ================================
// COLLECTION FILTER
// ================================

const filterButtons = document.querySelectorAll(".filter-btn");
const collectionCards = document.querySelectorAll(".collection-card");

if (filterButtons.length && collectionCards.length) {

  filterButtons.forEach(button => {

    button.addEventListener("click", () => {

      // The dynamic catalogue (js/catalogue.js) handles filtering itself
      // once it has switched the page to live database products.
      if (document.body.hasAttribute("data-kx-live")) return;


      // Remove active from all buttons
      filterButtons.forEach(btn => {
        btn.classList.remove("active");
      });

      // Add active to clicked button
      button.classList.add("active");

      const filter = button.dataset.filter;

      collectionCards.forEach(card => {

        const category = card.dataset.category;

        if (filter === "all" || category === filter) {

          card.style.display = "block";

        } else {

          card.style.display = "none";

        }

      });


      // Refresh AOS after filtering
      if (typeof AOS !== "undefined") {
        AOS.refresh();
      }

    });

  });

}