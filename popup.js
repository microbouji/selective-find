document.addEventListener("DOMContentLoaded", () => {
  chrome.tabs.executeScript({ file: "content_script.js" });
});
