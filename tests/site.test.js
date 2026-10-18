import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { menuData, studyCombo } from "../data/menu.js";
import { initializeSite, setupNavigation } from "../script.js";

class MockElement {
  constructor(tagName = "div") {
    this.tagName = tagName.toUpperCase();
    this.children = [];
    this.attributes = new Map();
    this.listeners = new Map();
    this.classNames = new Set();
    this.classList = {
      add: (name) => this.classNames.add(name),
      remove: (name) => this.classNames.delete(name),
      toggle: (name, force) => {
        if (force) this.classNames.add(name);
        else this.classNames.delete(name);
        return force;
      },
      contains: (name) => this.classNames.has(name),
    };
    this._textContent = "";
  }

  set textContent(value) {
    this._textContent = String(value);
  }

  get textContent() {
    return this._textContent;
  }

  append(...nodes) {
    this.children.push(...nodes);
  }

  replaceChildren(...nodes) {
    this.children = nodes.flatMap((node) => node.tagName === "#FRAGMENT" ? node.children : [node]);
  }

  setAttribute(name, value) {
    this.attributes.set(name, value);
  }

  getAttribute(name) {
    return this.attributes.get(name) ?? null;
  }

  addEventListener(type, listener) {
    const listeners = this.listeners.get(type) ?? [];
    listeners.push(listener);
    this.listeners.set(type, listeners);
  }

  dispatch(type, event = {}) {
    for (const listener of this.listeners.get(type) ?? []) {
      listener({ target: this, ...event });
    }
  }

  focus() {
    this.ownerDocument.activeElement = this;
  }

  closest(selector) {
    return selector === "a" && this.tagName === "A" ? this : null;
  }

  querySelector(selector) {
    const matches = selector === "a"
      ? (element) => element.tagName === "A"
      : (element) => selector === "h1, h2" && ["H1", "H2"].includes(element.tagName);
    return this.children.find(matches) ?? this.children
      .map((child) => child.querySelector?.(selector))
      .find(Boolean) ?? null;
  }
}

class MockDocument {
  constructor() {
    this.elements = new Map();
    this.listeners = new Map();
    this.activeElement = null;
  }

  add(selector, element = new MockElement()) {
    element.ownerDocument = this;
    this.elements.set(selector, element);
    return element;
  }

  querySelector(selector) {
    return this.elements.get(selector) ?? null;
  }

  createElement(tagName) {
    const element = new MockElement(tagName);
    element.ownerDocument = this;
    return element;
  }

  createDocumentFragment() {
    const fragment = new MockElement("#fragment");
    fragment.tagName = "#FRAGMENT";
    return fragment;
  }

  addEventListener(type, listener) {
    const listeners = this.listeners.get(type) ?? [];
    listeners.push(listener);
    this.listeners.set(type, listeners);
  }

  dispatch(type, event) {
    for (const listener of this.listeners.get(type) ?? []) {
      listener(event);
    }
  }
}

function createSiteDocument() {
  const documentRef = new MockDocument();
  const toggle = documentRef.add(".menu-toggle", new MockElement("button"));
  toggle.setAttribute("aria-expanded", "false");

  const navigation = documentRef.add("#site-navigation");
  const link = new MockElement("a");
  link.ownerDocument = documentRef;
  link.setAttribute("href", "#menu");
  navigation.append(link);

  const heading = documentRef.createElement("h2");
  const target = documentRef.add("#menu");
  target.append(heading);

  documentRef.add("#menu-categories");
  documentRef.add("#combo-items");
  documentRef.add("#combo-price");
  documentRef.add("#combo-discount");
  documentRef.add("#combo-savings");
  documentRef.add("#year");

  return { documentRef, toggle, navigation, link, target };
}

test("initialization renders all menu data and accurate combo pricing", () => {
  const { documentRef } = createSiteDocument();

  initializeSite(documentRef);

  const categoryContainer = documentRef.querySelector("#menu-categories");
  assert.equal(categoryContainer.children.length, menuData.length);
  assert.equal(
    categoryContainer.children.flatMap((category) => category.children[1].children).length,
    menuData.reduce((total, category) => total + category.items.length, 0),
  );
  assert.equal(documentRef.querySelector("#combo-items").textContent, "Iced Latte ৳130 + Chocolate Chip Cookie ৳60");
  assert.equal(documentRef.querySelector("#combo-price").textContent, `৳${studyCombo.bundlePrice}`);
  assert.match(documentRef.querySelector("#combo-discount").textContent, /10% off all menu items, including combos/);
  assert.equal(documentRef.querySelector("#combo-savings").textContent, "Save ৳10 vs. buying separately.");
  assert.equal(documentRef.querySelector("#year").textContent, String(new Date().getFullYear()));
});

test("navigation click closes the menu and focuses its destination", () => {
  const { documentRef, toggle, navigation, link, target } = createSiteDocument();
  setupNavigation(documentRef);
  toggle.dispatch("click");

  assert.equal(toggle.getAttribute("aria-expanded"), "true");
  assert.equal(navigation.classList.contains("is-open"), true);

  navigation.dispatch("click", { target: link });

  assert.equal(toggle.getAttribute("aria-expanded"), "false");
  assert.equal(navigation.classList.contains("is-open"), false);
  assert.equal(documentRef.activeElement, target);
});

test("Escape closes the mobile menu and restores focus to its toggle", () => {
  const { documentRef, toggle, navigation } = createSiteDocument();
  setupNavigation(documentRef);
  toggle.dispatch("click");
  documentRef.dispatch("keydown", { key: "Escape" });

  assert.equal(toggle.getAttribute("aria-expanded"), "false");
  assert.equal(navigation.classList.contains("is-open"), false);
  assert.equal(documentRef.activeElement, toggle);
});

test("skip and in-page destinations can receive programmatic focus", async () => {
  const html = await readFile(new URL("../index.html", import.meta.url), "utf8");

  assert.match(html, /<main\b[^>]*\bid="main-content"[^>]*\btabindex="-1"/);
  assert.equal((html.match(/<section\b[^>]*\btabindex="-1"/g) ?? []).length, 3);
});
