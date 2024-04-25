// ==UserScript==
// @name         New Userscript
// @namespace    http://tampermonkey.net/
// @version      2024-04-25
// @description  try to take over the world!
// @author       You
// @match        https://www.doordash.com/orders/81d359bc-82e2-4daa-8603-961d47b4eb8a/receipt
// @icon         https://www.google.com/s2/favicons?sz=64&domain=doordash.com
// @grant        none
// ==/UserScript==

(function () {
  window.addEventListener("load", () => {
    addElements();
  });

  function addElements() {
    const cssObj = {
      position: "absolute",
      top: "5%",
      left: "50%",
      "z-index": 100,
      fontWeight: "600",
      fontSize: "10px",
      backgroundColor: "#00cccc",
      color: "white",
      border: "none",
      padding: "8px 16px",
    };

    // copy json data from script element
    const script = document.getElementById("__NEXT_DATA__");
    const jsonData = script.innerHTML;

    let input = document.createElement("input");
    input.id = "scrapeInput";
    input.value = jsonData;
    document.body.appendChild(input);
    Object.keys(cssObj).forEach((key) => (input.style[key] = cssObj[key]));

    let button = document.createElement("button");
    button.id = "scrapeButton";
    button.innerHTML = "Copy JSON";
    button.addEventListener("click", copyJSON);
    document.body.appendChild(button);
    Object.keys(cssObj).forEach((key) => (button.style[key] = cssObj[key]));
    button.style.top = "10%";
  }

  function copyJSON() {
    document.getElementById("scrapeInput").select();
    document.execCommand("copy");
  }
})();
