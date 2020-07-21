var budgetController = (function () {
  var Expense = function (id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
    this.percentage = -1;
  };

  Expense.prototype.calcPercentage = function (totalIncome) {
    if (totalIncome > 0) {
      this.percentage = Math.round((this.value / totalIncome) * 100);
    } else {
      this.percentage = -1;
    }
  };

  Expense.prototype.getPercentage = function () {
    return this.percentage;
  };

  var Income = function (id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  };

  var data = {
    allItems: {
      exp: [],
      inc: [],
    },
    totals: {
      exp: 0,
      inc: 0,
    },
    budget: 0,
    percentage: -1,
  };

  var calculateTotal = function (type) {
    var sum = 0;
    data.allItems[type].forEach(function (curr) {
      sum += curr.value;
    });
    data.totals[type] = sum;
  };

  return {
    addItem: function (type, des, val) {
      var newItem, ID;

      //Create new ID
      if (data.allItems[type].length > 0) {
        ID = data.allItems[type][data.allItems[type].length - 1].id;
      } else {
        ID = 0;
      }

      //Create new item,inc or exp type
      if (type === "exp") {
        newItem = new Expense(ID, des, val);
      } else if (type === "inc") {
        newItem = new Income(ID, des, val);
      }

      //Push the item into array
      data.allItems[type].push(newItem);

      //Return the new element
      return newItem;
    },

    deleteItem: function (type, id) {
      var ids, index;
      ids = data.allItems[type].map(function (current) {
        return current.id;
      });
      index = ids.indexOf(id);
      if (index !== -1) {
        data.allItems[type].splice(index, 1);
      }
    },

    calculateBudget: function () {
      //calculate total income and expenses
      calculateTotal("exp");
      calculateTotal("inc");
      //calculate the budget
      data.budget = data.totals.inc - data.totals.exp;
      //calculate the % of income that we spent
      if (data.totals.inc > 0) {
        data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
      } else {
        data.percentage = -1;
      }
    },

    claculatePercentages: function () {
      data.allItems.exp.forEach(function (cur) {
        cur.calcPercentage(data.totals.inc);
      });
    },

    getPercentages: function () {
      var allPerc = data.allItems.exp.map(function (cur) {
        return cur.getPercentage();
      });
      return allPerc;
    },

    getBudget: function () {
      return {
        budget: data.budget,
        totalInc: data.totals.inc,
        totalExp: data.totals.exp,
        percentage: data.percentage,
      };
    },
  };
})();

var UIContoller = (function () {
  var DOMStrings = {
    inputType: ".add__type",
    inputDescription: ".add__description",
    inputValue: ".add__value",
    inputButton: ".add__btn",
    incomeContainer: ".income__list",
    expensesContainer: ".expenses__list",
    budgetLabel: ".budget__value",
    totalIncLabel: ".budget__income--value",
    totalExpLabel: ".budget__expenses--value",
    percentageLabel: ".budget__expenses--percentage",
    container: ".container",
    expensesPercLabel: ".item__percentage",
  };

  var formatNumber = function (num, type) {
    numFormat = num.toLocaleString();
    if (type == "inc") {
      numFormat = "+" + numFormat;
    } else if (type == "exp") {
      numFormat = "-" + numFormat;
    }
    return numFormat;
  };

  return {
    getInput: function () {
      return {
        type: document.querySelector(DOMStrings.inputType).value, //value includes inc or exp for income or expense accordingly
        description: document.querySelector(DOMStrings.inputDescription).value,
        value: parseFloat(document.querySelector(DOMStrings.inputValue).value),
        inputButton: document.querySelector(".add__btn"),
      };
    },

    addListItem: function (object, type) {
      var html, newHtml, element;
      //Create HTML string with placeholder text
      if (type === "inc") {
        element = DOMStrings.incomeContainer;
        html =
          '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div> <div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
      } else if (type === "exp") {
        element = DOMStrings.expensesContainer;
        html =
          '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
      }
      //Replace placeholder text with actual data
      newHtml = html.replace("%id%", object.id);
      newHtml = newHtml.replace("%description%", object.description);
      newHtml = newHtml.replace("%value%", formatNumber(object.value, type));
      //Insert the HTML into the DOM
      document.querySelector(element).insertAdjacentHTML("beforeend", newHtml);
    },

    deleteListItem: function (elementID) {
      var el = document.getElementById(elementID);
      el.parentNode.removeChild(el);
    },

    clearFields: function () {
      var fields, fieldsArr;
      //Select the input fields to clear using composite query selection
      fields = document.querySelectorAll(
        DOMStrings.inputDescription + ", " + DOMStrings.inputValue
      );
      //This returns a list so convert it to an array using slice
      //We cannot use slice immidiately but have to use the array prototype and send in the field list
      //Array is the function constructor that contains the prototype methpd slice
      fieldsArr = Array.prototype.slice.call(fields);

      fieldsArr.forEach(function (current, index, array) {
        current.value = "";
      });
      fieldsArr[0].focus();
    },

    displayBudget: function (obj) {
      document.querySelector(DOMStrings.budgetLabel).textContent = obj.budget;
      document.querySelector(DOMStrings.totalIncLabel).textContent =
        obj.totalInc;
      document.querySelector(DOMStrings.totalExpLabel).textContent =
        obj.totalExp;
      if (obj.percentage > 0) {
        document.querySelector(DOMStrings.percentageLabel).textContent =
          obj.percentage + "%";
      } else {
        document.querySelector(DOMStrings.percentageLabel).textContent = "--";
      }
    },

    displayPercentages: function (percentages) {
      var fields = document.querySelectorAll(DOMStrings.expensesPercLabel);

      var nodeListForEach = function (list, callback) {
        for (var i = 0; i < list.length; i++) {
          callback(list[i], i);
        }
      };

      nodeListForEach(fields, function (current, index) {
        if (percentages[index] > 0) {
          current.textContent = percentages[index] + "%";
        } else {
          current.textContent = "---";
        }
      });
    },

    getDOMStrings: function () {
      return DOMStrings;
    },
  };
})();

var controller = (function (budgetCtrl, UICtrl) {
  var setupEventListeners = function () {
    var DOM = UICtrl.getDOMStrings();
    document
      .querySelector(DOM.inputButton)
      .addEventListener("click", ctrlAddItem);
    document.addEventListener("keypress", function (e) {
      if (e.keyCode === 13) {
        ctrlAddItem();
      }
    });
    document
      .querySelector(DOM.container)
      .addEventListener("click", ctrlDeleteItem);
  };

  var updateBudget = function () {
    //4.calculage the budget
    budgetCtrl.calculateBudget();
    //4.5 return the budget
    var budget = budgetCtrl.getBudget();
    //5.display the budget on UI
    UICtrl.displayBudget(budget);
  };

  var updatePercentages = function () {
    //1. calculate percentages
    budgetCtrl.claculatePercentages();
    //2.read percentages from budget controller
    var Percentages = budgetCtrl.getPercentages();
    //3.update the UI
    UICtrl.displayPercentages(Percentages);
  };

  var ctrlAddItem = function () {
    var input, newItem;
    //1.get field input data
    input = UICtrl.getInput();
    if (input.description !== "" && !isNaN(input.value) && input.value > 0) {
      //2.add item to budget controller
      newItem = budgetCtrl.addItem(input.type, input.description, input.value);
      //3.add new item to UI
      UICtrl.addListItem(newItem, input.type);
      //3.5 Clear the fields
      UICtrl.clearFields();
      //4 Calculate and Update Budget
      updateBudget();
      //5.Percentage modifications
      updatePercentages();
    }
  };

  var ctrlDeleteItem = function (event) {
    var itemID, splitID, type, ID;
    itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;
    if (itemID) {
      //item id is strucuted as inc-1, so split to get type and ID
      splitID = itemID.split("-");
      type = splitID[0];
      ID = parseInt(splitID[1]);

      //1.delete from data structure
      budgetCtrl.deleteItem(type, ID);
      //2.delete from UI
      UICtrl.deleteListItem(itemID);
      //3.Update and show the budget
      updateBudget();
      //4.Calculate and update the percentages
      updatePercentages();
    }
  };

  return {
    init: function () {
      console.log("Application Has Started!");
      UICtrl.displayBudget({
        budget: 0,
        totalInc: 0,
        totalExp: 0,
        percentage: -1,
      });
      setupEventListeners();
    },
  };
})(budgetController, UIContoller);

controller.init();
