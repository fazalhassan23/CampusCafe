# Lectures with Latte & More

A responsive static website for a campus café. It uses plain HTML, CSS, and JavaScript; serving the site has no build step or runtime package installation.

## Run locally

From this directory, start any static web server, for example:

```sh
python3 -m http.server 8000
```

Then open `http://localhost:8000`.

## Content structure

Menu categories and items are kept in [`data/menu.js`](./data/menu.js), separate from the rendering behavior in [`script.js`](./script.js). The page currently imports this static data as an ES module. A future API or CMS integration can replace that data source while keeping the menu renderer and page structure.

Brand colors and responsive presentation are defined with CSS custom properties in [`styles.css`](./styles.css).

## Tests

Run the dependency-free JavaScript regression tests with Node.js 18 or later:

```sh
npm test
```

## Pending café details

The café's location/address, opening days and hours, and contact or social channels have not been confirmed. Do not publish guessed values. Track the CMS follow-up in [issue #3](https://github.com/fazalhassan23/CampusCafe/issues/3); once confirmed, these details should be editable without a code deployment.

## Accessibility

The page includes a keyboard-only skip link, visible focus indicators, and a mobile navigation toggle that supports keyboard open/close behavior. Entrance and cup animations are disabled when the visitor prefers reduced motion.
