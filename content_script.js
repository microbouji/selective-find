chrome.runtime.onConnect.addListener(function (port) {
  let selectedNodes = [document.body];
  let results = [];
  let index = -1;

  function selectNodes(selector) {
    selector = selector.trim();
    if (!selector || selector === "*") {
      selectedNodes = [document.body];
      return;
    }

    if (selector.endsWith("*")) selector = selector.slice(0, -1).trim();

    let arr1 = Array.from(document.body.querySelectorAll(selector));
    let arr2 = Array.from(document.body.querySelectorAll(`${selector} *`));

    selectedNodes = arr1.filter((x) => !arr2.includes(x));
  }

  function search(query) {
    results = [];
    index = -1;
    highlight(null);

    if (!query) {
      port.postMessage({ type: "UPDATE_TOTAL", value: 0 });
      return;
    }

    selectedNodes.forEach((el, i) => {
      walk_the_DOM(el, (node) => {
        if (
          node.nodeType === Node.TEXT_NODE &&
          Boolean(node.textContent) &&
          node.parentElement.offsetParent
        ) {
          const regex = RegExp(query.toLowerCase(), "g");
          const nodeText = node.textContent.toLowerCase();
          while (regex.test(nodeText)) {
            results.push({
              node,
              start: regex.lastIndex - query.length,
              end: regex.lastIndex,
            });
          }
        }
      });
    });

    next();
    port.postMessage({ type: "UPDATE_TOTAL", value: results.length });
  }

  function highlight(current) {
    port.postMessage({ type: "UPDATE_INDEX", value: index + 1 });

    if (!current) return;
    current.node.parentElement.scrollIntoViewIfNeeded();
    let selection = document.getSelection();
    selection.setBaseAndExtent(
      current.node,
      current.start,
      current.node,
      current.end
    );
  }

  function prev() {
    if (!results.length) return;

    if (index === 0) index = results.length;
    highlight(results[--index]);
  }

  function next() {
    console.log("next", index, results.length);
    if (!results.length) return;

    if (index === results.length - 1) index = -1;
    highlight(results[++index]);
  }

  var walk_the_DOM = function walk(node, func) {
    func(node);
    node = node.firstChild;
    while (node) {
      walk(node, func);
      node = node.nextSibling;
    }
  };

  port.onMessage.addListener(function (msg) {
    switch (msg.type) {
      case "PREV":
        prev();
        break;
      case "NEXT":
        next();
        break;
      case "SELECT_AND_SEARCH":
        selectNodes(msg.selector);
        search(msg.query);
        break;
      case "SEARCH":
        search(msg.query);
        break;
    }
  });
});
