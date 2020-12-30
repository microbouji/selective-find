chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
  const port = chrome.tabs.connect(tabs[0].id);

  document.getElementById("selector").addEventListener("input", function (e) {
    port.postMessage({ text: e.currentTarget.value });
  });
});
