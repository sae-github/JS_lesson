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
  sortBtn.dataset.sortStatus = "standard";
  sortBtn.id = "js-sort-btn";
  return sortBtn;
}

const setClickInSortBtn = () => {
  const standardRows = [...document.querySelector("tbody").querySelectorAll("tr")];
  const sortBtn = document.getElementById("js-sort-btn");

  sortBtn.addEventListener("click", (e) => {
    let currentStatus = e.target.dataset.sortStatus;
    currentStatus = switchSortStatus(currentStatus);
    e.target.dataset.sortStatus = currentStatus;

    const sortedRows = getSortedRows(currentStatus, standardRows);

    const tbody = document.querySelector("tbody");
    sortedRows.forEach((row) => {
      tbody.appendChild(row);
    })
  });
}

const switchSortStatus = (status) => {
  if (status === "standard") {
    return "asc";
  } else if (status === "desc") {
    return "standard";
  } else if (status === "asc") {
    return "desc";
  }
}

const getSortedRows = (status, standardRows) => {
  if (status === "standard") {
    return standardRows;
  }
  return SortById(status, standardRows);
}

const SortById = (status, standardRows) => {
  if (status === "asc") {
    return [...standardRows].sort(
      (a, b) => a.children[0].textContent - b.children[0].textContent
    );
  }
  if (status === "desc") {
    return [...standardRows].sort(
      (a, b) => b.children[0].textContent - a.children[0].textContent
    );
  }
};

init();

