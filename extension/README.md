# CIVIC GUIDE Chrome extension

The extension is the contextual layer for public-service websites. It adds a
small CIVIC GUIDE launcher to Austrian government pages (`*.gv.at`) and opens
a Chrome side panel. Users can select a confusing passage, ask a question in
German or English, and receive the same source-backed guidance as the main
product, including a worker-ready CitizenCaseBrief.

## Load locally

1. Start the Pages app with `npm run dev`.
2. Open `chrome://extensions`.
3. Enable Developer mode.
4. Choose **Load unpacked** and select this `extension/` directory.
5. Visit an Austrian government page such as `https://www.oesterreich.gv.at/`.
6. Click the CIVIC GUIDE launcher or the extension toolbar icon.

The side panel defaults to `http://localhost:8796`. Use **Verbindung** in the
panel to point it at the deployed Cloudflare Pages URL.

## 20-second judge flow

1. Open `https://www.oesterreich.gv.at/en/landingpages/reisepass`.
2. Select a sentence about passport renewal.
3. Click the CIVIC GUIDE launcher and review the visible “What will be sent?” context card.
4. Click **Review and use context**, then ask “What do I need to prepare?”
5. Show the passport workflow, official source, missing questions and “prepared for review; not submitted.”

## Product boundary

The content script is deliberately narrow. It can read the user's selected
text and, only after an explicit click, a bounded set of visible headings and
paragraphs. The side panel shows the context and character count before
sending it. It does not read form values, passwords, uploaded files or hidden
fields. It is limited to `*.gv.at` host permissions; on other domains it
explains that official context is unavailable and sends no page context.

The extension sends `channel: "extension"` to the shared API. The API returns
the same structured brief as the website and phone agent, so the extension is
an in-context entry point rather than a second workflow engine.

## Before publishing

- Replace the local API default with the production Pages URL.
- Set `CORS_ORIGIN` to the published extension origin or keep the read-only
  endpoint policy explicit for the final Web Store build.
- Add a privacy policy explaining the selected-text request flow.
- Add icons and a Chrome Web Store listing.
- Test keyboard navigation, high zoom, German/English voice flows and pages
  with no `<main>` element.
