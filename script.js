const menuButton = document.querySelector(".menu-button");
const siteNav = document.querySelector(".site-nav");
const searchInput = document.querySelector("#topic-search");
const searchableItems = Array.from(document.querySelectorAll(".searchable"));
const noMatch = document.createElement("div");
const checks = Array.from(document.querySelectorAll(".section-check"));
const progressFill = document.querySelector(".progress-fill");
const progressLabel = document.querySelector("#progress-label");
const filterButtons = Array.from(document.querySelectorAll(".filter-button"));
const questionCards = Array.from(document.querySelectorAll(".question-card"));

noMatch.className = "no-match";
noMatch.textContent = "No matching topics yet. Try a shorter search like policing, prison, poverty, or Whitechapel.";
document.querySelector("main").appendChild(noMatch);

menuButton.addEventListener("click", () => {
  const isOpen = siteNav.classList.toggle("open");
  menuButton.setAttribute("aria-expanded", String(isOpen));
});

siteNav.addEventListener("click", (event) => {
  if (event.target.matches("a")) {
    siteNav.classList.remove("open");
    menuButton.setAttribute("aria-expanded", "false");
  }
});

function updateProgress() {
  const done = checks.filter((check) => check.checked).length;
  const total = checks.length;
  progressFill.style.width = `${(done / total) * 100}%`;
  progressLabel.textContent = `${done} of ${total} sections checked`;
}

checks.forEach((check, index) => {
  const stored = localStorage.getItem(`crime-punishment-section-${index}`);
  check.checked = stored === "true";
  check.addEventListener("change", () => {
    localStorage.setItem(`crime-punishment-section-${index}`, String(check.checked));
    updateProgress();
  });
});

function applySearch() {
  const query = searchInput.value.trim().toLowerCase();
  let visibleCount = 0;

  searchableItems.forEach((item) => {
    const match = item.textContent.toLowerCase().includes(query);
    item.classList.toggle("hidden-search", query.length > 0 && !match);
    if ((match || query.length === 0) && !item.classList.contains("hidden-filter")) {
      visibleCount += 1;
    }
  });

  noMatch.style.display = visibleCount === 0 ? "block" : "none";
}

searchInput.addEventListener("input", applySearch);

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    filterButtons.forEach((item) => item.classList.remove("active"));
    button.classList.add("active");

    const filter = button.dataset.filter;
    questionCards.forEach((card) => {
      card.classList.toggle("hidden-filter", filter !== "all" && card.dataset.type !== filter);
    });
    applySearch();
  });
});

const navLinks = Array.from(document.querySelectorAll(".site-nav a"));
const sections = navLinks
  .map((link) => document.querySelector(link.getAttribute("href")))
  .filter(Boolean);

function updateActiveNav() {
  const current = sections.reduce((active, section) => {
    const rect = section.getBoundingClientRect();
    return rect.top <= 120 ? section : active;
  }, sections[0]);

  navLinks.forEach((link) => {
    link.classList.toggle("active", link.getAttribute("href") === `#${current.id}`);
  });
}

document.addEventListener("scroll", updateActiveNav, { passive: true });
updateProgress();
updateActiveNav();

if ("serviceWorker" in navigator && location.protocol !== "file:") {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("service-worker.js").catch(() => {});
  });
}
