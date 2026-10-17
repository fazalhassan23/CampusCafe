const menuData = [
  {
    name: "Hot drinks",
    items: [
      { name: "Americano / Espresso", price: "৳80" },
      { name: "Cappuccino", price: "৳120" },
      { name: "Latte / Mocha", price: "৳150" },
    ],
  },
  {
    name: "Cold drinks",
    items: [
      { name: "Iced Americano", price: "৳100" },
      { name: "Iced Latte", price: "৳130" },
      { name: "Iced Spanish Latte", price: "৳150" },
      { name: "Iced Mocha", price: "৳160" },
      { name: "Caramel Frappé", price: "৳200" },
    ],
  },
  {
    name: "Cookies & bars",
    items: [
      { name: "Chocolate Chip Cookie", price: "৳60" },
      { name: "Double Chocolate Cookie", price: "৳70" },
      { name: "Date Bar", price: "৳70" },
    ],
  },
  {
    name: "Snacks",
    items: [
      { name: "Chicken Pesto Sandwich", price: "৳150" },
      { name: "Chicken Croissant", price: "৳140" },
      { name: "Cheese Toastie", price: "৳110" },
    ],
  },
];

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
});

navigation.addEventListener("click", (event) => {
  if (event.target.closest("a")) {
    menuToggle.setAttribute("aria-expanded", "false");
    navigation.classList.remove("is-open");
  }
});
