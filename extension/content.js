(() => {
  if (window.top !== window || document.getElementById("civic-guide-launcher")) return;

  const style = document.createElement("style");
  style.textContent = `
    #civic-guide-launcher { all: initial; position: fixed; z-index: 2147483647; right: 18px; bottom: 18px; display: flex; gap: 8px; align-items: center; padding: 10px 13px; color: #f6f8f7; background: #173b4c; border: 1px solid #28586c; border-radius: 3px; box-shadow: 0 8px 24px rgba(23,59,76,.22); cursor: pointer; font: 600 12px -apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif; }
    #civic-guide-launcher:hover { background: #235d79; }
    #civic-guide-launcher i { display: block; width: 8px; height: 8px; background: #f4c0a6; border-radius: 50%; }
  `;
  const launcher = document.createElement("button");
  launcher.id = "civic-guide-launcher";
  launcher.type = "button";
  launcher.innerHTML = "<i aria-hidden=\"true\"></i><span>CIVIC GUIDE</span>";
  launcher.setAttribute("aria-label", "Open CIVIC GUIDE");
  launcher.addEventListener("click", () => {
    chrome.runtime.sendMessage({ type: "open-guide", context: collectContext() });
  });
  document.documentElement.append(style, launcher);

  function collectContext() {
    const selection = window.getSelection()?.toString().trim() || "";
    const main = document.querySelector("main, article, [role=main]");
    const headings = [...document.querySelectorAll("h1, h2, h3")].slice(0, 8).map((node) => node.innerText.trim()).filter(Boolean);
    const visibleCopy = selection ? "" : [...(main || document.body).querySelectorAll("p, li")]
      .slice(0, 12)
      .map((node) => node.innerText.trim())
      .filter((text) => text.length > 20 && text.length < 500)
      .join("\n");
    return {
      title: document.title,
      url: location.href,
      selection: selection.slice(0, 4000),
      headings,
      visibleCopy: visibleCopy.slice(0, 4000),
    };
  }

  chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
    if (message?.type !== "collect-context") return;
    sendResponse(collectContext());
  });
})();
