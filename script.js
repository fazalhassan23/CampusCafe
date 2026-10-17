import { menuData } from "./data/menu.js";

function renderMenu(categories, container) {
  const fragment = document.createDocumentFragment();

  categories.forEach((category) => {
    const section = document.createElement("section");
    section.className = "menu-category";

    const heading = document.createElement("h3");
    heading.textContent = category.name;

    const items = document.createElement("ul");
    items.className = "menu-items";

    category.items.forEach((item) => {
      const row = document.createElement("li");
      row.className = "menu-item";

      const name = document.createElement("span");
      name.className = "menu-item-name";
      name.textContent = item.name;

      const leader = document.createElement("span");
      leader.className = "menu-item-leader";
      leader.setAttribute("aria-hidden", "true");

      const price = document.createElement("span");
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

const menuContainer = document.querySelector("#menu-categories");
renderMenu(menuData, menuContainer);

document.querySelector("#year").textContent = new Date().getFullYear();

const menuToggle = document.querySelector(".menu-toggle");
const navigation = document.querySelector("#site-navigation");

menuToggle.addEventListener("click", () => {
  const isExpanded = menuToggle.getAttribute("aria-expanded") === "true";
  menuToggle.setAttribute("aria-expanded", String(!isExpanded));
  navigation.classList.toggle("is-open", !isExpanded);

  if (!isExpanded) {
    navigation.querySelector("a").focus();
  }
});

navigation.addEventListener("click", (event) => {
  if (event.target.closest("a")) {
    menuToggle.setAttribute("aria-expanded", "false");
    navigation.classList.remove("is-open");
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && menuToggle.getAttribute("aria-expanded") === "true") {
    menuToggle.setAttribute("aria-expanded", "false");
    navigation.classList.remove("is-open");
    menuToggle.focus();
  }
});
