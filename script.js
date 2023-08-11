const calcBtns = document.querySelectorAll("td");
const resultArea = document.querySelector("#result-area");
const expressionElem = resultArea.children[1];
const PrevExpressionElem = resultArea.children[0];
const historyTab = document.querySelector("#history-tab");
const clearHistoryBtn = historyTab.querySelector("#clear-all-calculations");
const sideBarMenus = document.querySelector("#calc-side-bar");
const sideBarMenuBtn = document.querySelector("#side-bar-menu-btn");
const toggleHistoryTabBtns = document.querySelectorAll(".toggle-history-tab");

// global array that contains all num and symbol
let expressionArr = [];
let prevExpressionArr = [];
let prevCalculations = [];

const getExpression = (expressionArr) => {
  let expressionHTML = "";
  for (let elem of expressionArr) {
    switch (elem) {
      case "+":
        elem = `&ThinSpace;<i class="fa-solid fa-plus fa-xs"></i>&ThinSpace;`;
        break;
      case "-":
        elem = `&ThinSpace;<i class="fa-solid fa-minus fa-xs"></i>&ThinSpace;`;
        break;
      case "*":
        elem = `&ThinSpace;<i class="fa-solid fa-xmark fa-xs"></i>&ThinSpace;`;
        break;
      case "/":
        elem = `&ThinSpace;<i class="fa-solid fa-divide fa-xs"></i>&ThinSpace;`;
        break;
      case "%":
        elem = `&ThinSpace;<i class="fa-solid fa-percentage fa-xs"></i>&ThinSpace;`;
        break;
      case ".":
        elem = `&ThinSpace;<i class="fa-solid fa-circle"></i>&ThinSpace;`;
        break;
    }
    expressionHTML += `<span>${elem}</span>`;
  }
  return expressionHTML;
};

const showExpressionOnscreen = () => {
  expressionElem.innerHTML = getExpression(expressionArr);
  PrevExpressionElem.innerHTML = getExpression(prevExpressionArr);
};
// showExpressionOnscreen();

const isLastElemExit = () => {
  let lastElem = expressionArr[expressionArr.length - 1];
  if (
    lastElem === "%" ||
    lastElem === "/" ||
    lastElem === "+" ||
    lastElem === "-" ||
    lastElem === "." ||
    lastElem === "*"
  ) {
    return true;
  }
};

const getEvaluatedExpression = () => {
  let expression = "";
  for (let elem of expressionArr) {
    expression += elem;
  }
  prevExpressionArr = expressionArr;

  return eval(expression);
};

const reverseFromHistoryTab = ({ expression, result }) => {
  expressionArr = String(result).split(",");
  prevExpressionArr = expression;
  showExpressionOnscreen();
};

const deleteIndividualCalculation = ({ id }) => {
  const newPreCalculations = prevCalculations.filter(
    (calculation) => calculation.id !== id
  );
  prevCalculations = newPreCalculations;
  showPrevCalculationsOnHisTab();
};

const prevCalculationsElem = historyTab.querySelector(".prev-calculations");
function showPrevCalculationsOnHisTab() {
  prevCalculationsElem.innerHTML = "";
  for (let calculation of prevCalculations.reverse()) {
    const prevCalculation = document.createElement("li");
    prevCalculation.className = "prev-calculation flex";
    prevCalculation.innerHTML = `
    <div>
      <p class="expression">${getExpression(calculation.expression)}</p>
      <p class="that-result">${calculation.result}</p>
    </div>
    <div class="calculation-date flex">
      <span>${calculation.time}</span>
      <span>${calculation.date}</span>
    </div>
    `;

    prevCalculation.ondblclick = () => {
      reverseFromHistoryTab(calculation);
      const ctrlMenuElem = document.querySelector(".ctrl-menus");
      if (ctrlMenuElem) {
        ctrlMenuElem.remove();
      }
    };
    prevCalculation.oncontextmenu = (e) => {
      e.preventDefault();
      const ctrlMenuElem = document.querySelector(".ctrl-menus");
      if (ctrlMenuElem) {
        ctrlMenuElem.remove();
      }
      const ul = document.createElement("ul");
      ul.className = "ctrl-menus";
      ul.innerHTML = `
      <li class="ctrl-menu" data-btn-type="copy">
        <i class="fa-solid fa-copy"></i>
        <span>copy</span>
      </li>
      <li class="ctrl-menu" data-btn-type="delete">
        <i class="fa-solid fa-trash-alt"></i>
        <span>delete</span>
      </li>
      `;
      let x = e.offsetX,
        y = e.offsetY;
      ul.style.left = x + "px";
      ul.style.top = y + "px";
      prevCalculation.insertAdjacentElement("beforeend", ul);

      Array.from(ul.children).forEach((menu) => {
        menu.addEventListener("click", (e) => {
          if (menu.dataset.btnType === "copy") {
            const selectElem = prevCalculation.querySelector(".that-result");
            // Create a range and select the text within the source div
            const range = document.createRange();
            range.selectNode(selectElem);
            window.getSelection().removeAllRanges();
            window.getSelection().addRange(range);
            // Copy the selected text to the clipboard
            try {
              document.execCommand("copy");
              console.log("Text copied to clipboard");
            } catch (err) {
              console.error("Failed to copy text:", err);
            }

            // Clear the selection
            window.getSelection().removeAllRanges();
          } else {
            deleteIndividualCalculation(calculation);
          }
        });
      });

      setTimeout(() => {
        ul.remove();
      }, 2000);
    };
    prevCalculation.onclick = () => {
      const ctrlMenuElem = document.querySelector(".ctrl-menus");
      if (ctrlMenuElem) {
        ctrlMenuElem.remove();
      }
    };

    prevCalculationsElem.append(prevCalculation);
  }
}

const updatePrevCalculation = (expression, result) => {
  const time = new Date();
  const monthsList = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  let obj = {};
  obj.id = `calculation_${prevCalculations.length + 1}`;
  obj.expression = expression;
  obj.result = result;
  obj.time = `${
    time.getHours() > 12 ? time.getHours() - 12 : time.getHours()
  } : ${time.getMinutes()} ${time.getHours >= 12 ? "am" : "pm"}`;
  obj.date = `${time.getDate()} ${
    monthsList[time.getMonth()]
  }, ${time.getFullYear()}`;
  prevCalculations.push(obj);
  showPrevCalculationsOnHisTab();
};

const clearAllHistory = () => {
  prevCalculations = [];
  showPrevCalculationsOnHisTab();
  prevCalculationsElem.innerHTML = `
  <li class="prev-calculation flex">
    <p class="his-message">There's no history yet.</p>
  </li>`;
};
clearHistoryBtn.addEventListener("click", clearAllHistory);

// reverse from prevExpressionArr to expressionArr
PrevExpressionElem.addEventListener("dblclick", () => {
  expressionArr = prevExpressionArr;
  prevExpressionArr = [];
  showExpressionOnscreen();
});

const updateExpressionArr = (value) => {
  expressionElem.innerHTML = "";
  if (value === "clear") {
    expressionArr = [];
    prevExpressionArr = [];
  } else if (value === "ce") {
    expressionArr = [];
  } else if (value === "1/x" || value === "xSquare" || value === "rootX") {
    console.log("nothing to eval");
  } else if (value === "backspace") {
    expressionArr.pop();
  } else if (
    value === "%" ||
    value === "/" ||
    value === "+" ||
    value === "-" ||
    value === "*"
  ) {
    if (!(!expressionArr.length || isLastElemExit())) {
      expressionArr.push(value);
    }
  } else if (value === "0") {
    if (expressionArr.length) {
      expressionArr.push(value);
    }
  } else if (value === ".") {
    if (!isLastElemExit()) {
      expressionArr.push(value);
    }
  } else if (value === "=") {
    // let evaluatedExpression = Math.round(getEvaluatedExpression());
    let evaluatedExpression = getEvaluatedExpression();
    updatePrevCalculation(prevExpressionArr, evaluatedExpression);
    expressionArr = [];
    for (let elem of String(evaluatedExpression)) {
      expressionArr.push(elem);
    }
  } else {
    expressionArr.push(value);
  }
  showExpressionOnscreen();
};

calcBtns.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    let btnValue = e.currentTarget.dataset.value;
    updateExpressionArr(btnValue);
  });
});

// toggle side bar
const toggleSideBar = () => {
  sideBarMenus.parentElement.classList.toggle("toggle-side-bar");
};
sideBarMenuBtn.addEventListener("click", toggleSideBar);

// toggle history tab bar
const toggleHistoryTab = () => {
  historyTab.classList.toggle("toggle-history-tab");
};
toggleHistoryTabBtns.forEach((btn) => {
  btn.addEventListener("click", toggleHistoryTab);
});
