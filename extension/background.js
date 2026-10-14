chrome.runtime.onInstalled.addListener(() => {
  chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true });
});

chrome.runtime.onMessage.addListener((message, sender) => {
  if (message?.type !== "open-guide" || typeof sender.tab?.windowId !== "number") return;
  chrome.storage.session.set({ civicContext: message.context || {} });
  chrome.sidePanel.open({ windowId: sender.tab.windowId });
});
