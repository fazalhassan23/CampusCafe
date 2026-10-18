import { menuData, studyCombo } from "./data/menu.js";

export function renderMenu(categories, container, documentRef = document) {
  const fragment = documentRef.createDocumentFragment();

  categories.forEach((category) => {
    const section = documentRef.createElement("section");
    section.className = "menu-category";

    const heading = documentRef.createElement("h3");
    heading.textContent = category.name;

    const items = documentRef.createElement("ul");
    items.className = "menu-items";

    category.items.forEach((item) => {
      const row = documentRef.createElement("li");
      row.className = "menu-item";

      const name = documentRef.createElement("span");
      name.className = "menu-item-name";
      name.textContent = item.name;

      const leader = documentRef.createElement("span");
      leader.className = "menu-item-leader";
      leader.setAttribute("aria-hidden", "true");

      const price = documentRef.createElement("span");
      price.className = "menu-item-price";
      price.textContent = item.price;

      row.append(name, leader, price);
      items.append(row);
    });

    section.append(heading, items);
    fragment.append(section);
  });

  container.replaceChildren(fragment);
}

export function setupNavigation(documentRef) {
  const menuToggle = documentRef.querySelector(".menu-toggle");
  const navigation = documentRef.querySelector("#site-navigation");

  menuToggle.addEventListener("click", () => {
    const isExpanded = menuToggle.getAttribute("aria-expanded") === "true";
    menuToggle.setAttribute("aria-expanded", String(!isExpanded));
    navigation.classList.toggle("is-open", !isExpanded);

    if (!isExpanded) {
      navigation.querySelector("a").focus();
    }
  });

  navigation.addEventListener("click", (event) => {
    const link = event.target.closest("a");
    if (!link) {
      return;
    }

    menuToggle.setAttribute("aria-expanded", "false");
    navigation.classList.remove("is-open");

    const target = documentRef.querySelector(link.getAttribute("href"));
    target?.focus();
  });

  documentRef.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && menuToggle.getAttribute("aria-expanded") === "true") {
      menuToggle.setAttribute("aria-expanded", "false");
      navigation.classList.remove("is-open");
      menuToggle.focus();
    }
  });
}

function renderStudyCombo(combo, documentRef) {
  const listedItemTotal = combo.items.reduce((total, item) => total + item.price, 0);
  const money = (amount) => `৳${amount}`;

  documentRef.querySelector("#combo-items").textContent = combo.items
    .map((item) => `${item.name} ${money(item.price)}`)
    .join(" + ");
  documentRef.querySelector("#combo-price").textContent = money(combo.bundlePrice);
  documentRef.querySelector("#combo-discount").textContent =
    `Student ID: ${combo.studentDiscountPercent}% off all menu items, including combos.`;
  documentRef.querySelector("#combo-savings").textContent =
    `Save ${money(listedItemTotal - combo.bundlePrice)} vs. buying separately.`;
}

export function initializeSite(documentRef) {
  renderMenu(menuData, documentRef.querySelector("#menu-categories"), documentRef);
  renderStudyCombo(studyCombo, documentRef);
  documentRef.querySelector("#year").textContent = new Date().getFullYear();
  setupNavigation(documentRef);
}

if (typeof document !== "undefined") {
  initializeSite(document);
}
