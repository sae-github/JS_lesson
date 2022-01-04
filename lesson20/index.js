
const body = document.querySelector("body");

const createElementWithClassName = (type, className) => {
  const element = document.createElement(type);
  element.className = className;
  return element;
};

const createLoading = () => {
  const loading = createElementWithClassName("img", "loading");
  loading.id = "js-loading";
  loading.src = "./loading-circle.gif";
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
      () => resolve(getJsonOrError("https://myjson.dit.upm.es/api/bins/94kd")), 3000
    );
  });
};

const tryGetTableData = async () => {
  body.appendChild(createLoading());
  try {
    const tableData = await getTableData();
    if (tableData.length === 0) {
      body.appendChild(createErrorMessage("データがありません"));
      return;
    }
    return tableData;
  } catch (e) {
    body.appendChild(createErrorMessage(e));
  } finally {
    removeLoading();
  }
};

const init = async () => {
  const data = await tryGetTableData();
  data && body.appendChild(createTable(data));
}

const createTable = usersData => {
  const tableItems = {
    "id": "ID",
    "name": "名前",
    "gender": "性別",
    "age": "年齢"
  }
  const table = document.createElement("table");
  const columnKeys = Object.keys(tableItems);
  const tableHead = createTableHead(tableItems);
  const tableBody = createTabBody(usersData, columnKeys);
  table.appendChild(tableHead).after(tableBody);
  return table;
}

const createTableHead = items => {
  const thead = document.createElement("thead");
  const tr = document.createElement("tr");
  Object.values(items).forEach(item => {
    const th = document.createElement("th");
    th.textContent = item;
    tr.appendChild(th);
  });
  thead.appendChild(tr);
  return thead;
}

const createTabBody = (usersData, keys) => {
  const tbody = document.createElement("tbody");
  usersData.forEach(userData => {
    const tr = document.createElement("tr");
    for (let i = 0; i < keys.length; i++) {
      const td = document.createElement("td");
      td.textContent = userData[keys[i]];
      tr.appendChild(td);
    }
    tbody.appendChild(tr);
  });
  return tbody;
}

init();

