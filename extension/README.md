# CIVIC GUIDE Chrome extension

The extension is the contextual layer for public-service websites. It adds a
small CIVIC GUIDE launcher to Austrian government pages (`*.gv.at`) and opens
a Chrome side panel. Users can select a confusing passage, ask a question in
German or English, and receive the same source-backed guidance as the main
product.

## Load locally

1. Start the Pages app with `npm run dev`.
2. Open `chrome://extensions`.
3. Enable Developer mode.
4. Choose **Load unpacked** and select this `extension/` directory.
5. Visit an Austrian government page such as `https://www.oesterreich.gv.at/`.
6. Click the CIVIC GUIDE launcher or the extension toolbar icon.

The side panel defaults to `http://localhost:8796`. Use **Verbindung** in the
panel to point it at the deployed Cloudflare Pages URL.

## Product boundary

The content script is deliberately narrow. It can read the user's selected
text and, only after an explicit click, a small set of visible headings and
paragraphs. It does not read input values, passwords, uploaded files or hidden
fields. It is limited to `*.gv.at` host permissions.

## Before publishing

- Replace the local API default with the production Pages URL.
- Set `CORS_ORIGIN` to the published extension origin or keep the read-only
  endpoint policy explicit for the final Web Store build.
- Add a privacy policy explaining the selected-text request flow.
- Add icons and a Chrome Web Store listing.
- Test keyboard navigation, high zoom, German/English voice flows and pages
  with no `<main>` element.
