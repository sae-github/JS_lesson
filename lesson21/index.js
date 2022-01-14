const tableWrapper = document.getElementById("js-table-wrapper");

const createElementWithClassName = (type, className) => {
  const element = document.createElement(type);
  element.className = className;
  return element;
};

const createLoading = () => {
  const loading = createElementWithClassName("img", "loading");
  loading.id = "js-loading";
  loading.src = "./img/loading-circle.gif";
  return loading;
};

const removeLoading = () => document.getElementById("js-loading").remove();

const createErrorMessage = (error) => {
  const errorMessage = createElementWithClassName("p", "error-message");
  errorMessage.textContent = error;
  return errorMessage;
};

const fetchErrorHandling = async (response) => {
  if (response.ok) {
    return await response.json();
  } else {
    throw new Error("サーバーエラーが発生しました");
  }
};

const getJsonOrError = async (url) => {
  const response = await fetch(url);
  const json = await fetchErrorHandling(response);
  return json;
};

const getTableData = async () => {
  return new Promise(resolve => {
    setTimeout(
      () => resolve(getJsonOrError("https://myjson.dit.upm.es/api/bins/9me1")), 3000
    );
  });
};

const tryGetTableData = async () => {
  tableWrapper.appendChild(createLoading());
  try {
    const tableData = await getTableData();
    if (tableData.length === 0) {
      tableWrapper.appendChild(createErrorMessage("データがありません"));
      return;
    }
    return tableData;
  } catch (e) {
    tableWrapper.appendChild(createErrorMessage(e));
  } finally {
    removeLoading();
  }
};

const init = async () => {
  const data = await tryGetTableData();
  data && tableWrapper.appendChild(createTable(data));
  setClickInSortBtn();
}

const createTable = usersData => {
  const tableItems = {
    "userId": "ID",
    "name": "名前",
    "gender": "性別",
    "age": "年齢"
  }
  const table = document.createElement("table");
  const columnKeys = Object.keys(tableItems);
  const tableHead = createTableHead(tableItems);
  const tableBody = createTableBody(usersData, columnKeys);
  table.appendChild(tableHead).after(tableBody);
  return table;
}

const createTableHead = items => {
  const thead = document.createElement("thead");
  const tr = document.createElement("tr");
  Object.values(items).forEach(item => {
    const th = document.createElement("th");
    th.textContent = item;
    item === "ID" && th.appendChild(createSortBtn());
    tr.appendChild(th);
  });
  thead.appendChild(tr);
  return thead;
}

const createTableBody = (usersData, keys) => {
  const tbody = document.createElement("tbody");
  usersData.forEach(userData => {
    const tr = document.createElement("tr");
    tbody.appendChild(tr).appendChild(createTd(userData, keys));
  });
  return tbody;
}

const createTd = (usersData, keys) => {
  const fragment = document.createDocumentFragment();
  for (let i = 0; i < keys.length; i++) {
    const td = document.createElement("td");
    td.textContent = usersData[keys[i]];
    fragment.appendChild(td);
  }
  return fragment;
}

const createSortBtn = () => {
  const sortBtn = createElementWithClassName("button", "sort-btn");
  sortBtn.dataset.sortStatus = "default";
  sortBtn.id = "js-sort-btn";
  return sortBtn;
}

const setClickInSortBtn = () => {
  const defaultRows = [...document.querySelector("tbody").querySelectorAll("tr")];
  const sortBtn = document.getElementById("js-sort-btn");

  sortBtn.addEventListener("click", (e) => {
    const nextStatus = switchSortStatus(e.target.dataset.sortStatus);
    e.target.dataset.sortStatus = nextStatus;

    const sortedRows = getSortedRows(nextStatus, defaultRows,e.target);

    const tbody = document.querySelector("tbody");
    sortedRows.forEach((row) => {
      tbody.appendChild(row);
    })
  });
}

const switchSortStatus = (status) => {
  switch (status) {
    case "default":
      return "asc";

    case "desc":
      return "default";

    case "asc":
      return "desc";

    default:
      return "default";
  }
}

const findClickedCellIndex = (target) => {
  const th = [...document.querySelector("thead").querySelectorAll("th")];
  return th.indexOf(target.parentElement);
}

const getSortedRows = (status, defaultLows,target) => {
  if (status === "default") {
    return defaultLows;
  }
  return sortByClickedCell(status, defaultLows,findClickedCellIndex(target));
}

const sortByClickedCell = (status, defaultLows, index) => {
  if (status === "asc") {
    return [...defaultLows].sort(
      (a, b) => a.children[index].textContent - b.children[index].textContent
    );
  }
  if (status === "desc") {
    return [...defaultLows].sort(
      (a, b) => b.children[index].textContent - a.children[index].textContent
    );
  }
};

init();

