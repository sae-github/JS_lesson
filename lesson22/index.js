const tableWrapper = document.getElementById("js-table-wrapper");

const createElementWithClassName = (type, className) => {
  const element = document.createElement(type);
  element.className = className;
  return element;
};

const createLoading = () => {
  const loading = createElementWithClassName("img", "loading");
  loading.id = "js-loading";
  loading.src = "./img/loading.gif";
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
  setClickInSortButton();
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
    item === "ID" && th.appendChild(createSortButton());
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

const createSortButton = () => {
  const sortButton = createElementWithClassName("button", "sort-button");
  sortButton.dataset.sortStatus = "default";
  sortButton.id = "js-sort-button";
  return sortButton;
}

const setClickInSortButton = () => {
  const defaultRows = [...document.querySelector("tbody").querySelectorAll("tr")];
  const sortButton = document.getElementById("js-sort-button");

  sortButton.addEventListener("click", (e) => {
    const nextStatus = switchSortStatus(e.target.dataset.sortStatus);
    e.target.dataset.sortStatus = nextStatus;

    const sortedRows = getSortedRows(nextStatus, defaultRows, e.target);

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

const getSortedRows = (status, defaultRows, target) => {
  if (status === "default") return defaultRows;
  const index = findClickedCellIndex(target);
  switch (status) {
    case "asc":
      return [...defaultRows].sort((a, b) => a.children[index].textContent - b.children[index].textContent
      );
    case "desc":
      return [...defaultRows].sort((a, b) => b.children[index].textContent - a.children[index].textContent
      );
    default:
      throw new Error(`${status} is not provided.`)
  }
}


init();

