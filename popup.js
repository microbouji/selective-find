const btnPrev = document.getElementById("prev");
const btnNext = document.getElementById("next");
const selectorEl = document.getElementById("selector");
const queryEl = document.getElementById("query");
const indexEl = document.getElementById("index");
const totalEl = document.getElementById("total");

chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
  const port = chrome.tabs.connect(tabs[0].id);

  btnPrev.addEventListener("click", () => {
    port.postMessage({ type: "PREV" });
  });

  btnNext.addEventListener("click", () => {
    port.postMessage({ type: "NEXT" });
  });

  selectorEl.addEventListener("input", () => {
    port.postMessage({
      type: "SELECT_AND_SEARCH",
      selector: selectorEl.value,
      query: queryEl.value,
    });
  });

  queryEl.addEventListener("input", () => {
    port.postMessage({ type: "SEARCH", query: queryEl.value });
  });

  selectorEl.addEventListener("keyup", (e) => {
    handleEnter(e);
  });
  queryEl.addEventListener("keyup", (e) => {
    handleEnter(e);
  });

  function handleEnter(e) {
    if (e.keyCode === 13 && e.shiftKey) {
      port.postMessage({ type: "PREV" });
    } else if (e.keyCode === 13) {
      port.postMessage({ type: "NEXT" });
    }
  }

  port.onMessage.addListener(function (msg) {
    if (msg.type === "UPDATE_INDEX") {
      indexEl.textContent = msg.value;
    } else if (msg.type === "UPDATE_TOTAL") {
      totalEl.textContent = msg.value;
    }
  });
});
