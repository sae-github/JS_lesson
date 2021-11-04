const tabMenuList = document.getElementById("js-tab-menu__list");

function addLoading() {
  const tabContent = document.getElementById("js-tab-content");
  const loading = document.createElement("img");
  loading.src = "./loading-circle.gif";
  loading.classList.add("loading");
  loading.id = "loading";
  tabContent.appendChild(loading);
}

function removeLoading() {
  const loading = document.getElementById("loading");
  loading.remove();
}

function addErrorMessage(error) {
  const tabContent = document.getElementById("js-tab-content");
  const errorMessage = document.createElement("p");
  errorMessage.classList.add("error-message");
  errorMessage.textContent = error;
  tabContent.appendChild(errorMessage);
}

async function fetchErrorHandling(response) {
  if (response.ok) {
    return await response.json();
  } else {
    throw new Error("サーバーエラーが発生しました");
  }
}

async function getJsonOrError(url) {
  const response = await fetch(url);
  const json = await fetchErrorHandling(response);
  return json;
}

async function getArrayFetchData() {
  const resource = [
    "./news.json",
    "./book.json",
    "./travel.json",
    "./economy.json"
  ];
  try {
    const data = await Promise.all(resource.map(getJsonOrError));
    return data.filter((value) => value !== undefined);
  } catch (e) {
    addErrorMessage(e);
  }
}

function createTabMenu(data) {
  for (let i = 0; i < data.length; i++) {
    const tabMenuItem = document.createElement("li");
    tabMenuItem.classList.add("tab-menu__item");
    tabMenuItem.id = data[i].category;
    tabMenuItem.textContent = data[i].category;
    tabMenuList.appendChild(tabMenuItem);
  }
}

function createTabContent() {
  const tabContent = document.createElement("div");
  const imageWrapper = document.createElement("div");
  const tabContentList = document.createElement("ul");

  tabContent.id = "js-tab-content";
  tabContentList.id = "js-tab-content__list";
  imageWrapper.id = "js-img-wrapper";

  imageWrapper.classList.add("tab-content__img-wrapper");
  tabContent.classList.add("tab-content");

  tabContent.appendChild(tabContentList);
  tabContent.appendChild(imageWrapper);
  tabMenuList.parentNode.insertBefore(tabContent, tabMenuList.nextSibling);
}

async function configUIfromFetchData() {
  const data = await getArrayFetchData();
  if (data) {
    createTabMenu(data);
    const hasSelectData = data.find((value) => value.select === true);
    const tab = document.getElementById(hasSelectData.category);
    tab.classList.add("active");
    createElement(hasSelectData);
    addImage(hasSelectData);
  }
}

async function createElement({ article }) {
  const ul = document.getElementById("js-tab-content__list");
  const frag = document.createDocumentFragment();
  for (let i = 0; i < article.length; i++) {
    const li = document.createElement("li");
    const anchor = document.createElement("a");
    anchor.href = "#";
    anchor.insertAdjacentHTML("beforeend", article[i].title);
    frag.appendChild(li).appendChild(anchor);
  }
  ul.appendChild(frag);
}

function addImage({ image }) {
  const imgWrapper = document.getElementById("js-img-wrapper");
  const img = document.createElement("img");
  img.src = image;
  imgWrapper.appendChild(img);
}

async function clickedTabContentCreate(target) {
  const targetResource = `./${target.id}.json`;
  const json = await tryGetData(targetResource);
  createElement(json);
  addImage(json);
}

async function tryGetData(resource) {
  addLoading();
  try {
    return await getJsonOrError(resource);
  } catch (e) {
    addErrorMessage(e);
  } finally {
    removeLoading();
  }
}

createTabContent();
configUIfromFetchData();

tabMenuList.addEventListener("click", (e) => {
  const hasActiveClassElement = document.getElementsByClassName("active")[0];

  if (hasActiveClassElement && e.currentTarget !== e.target) {
    hasActiveClassElement.classList.remove("active");
    e.target.classList.add("active");

    const imgWrapper = document.getElementById("js-img-wrapper");
    const tabContentList = document.getElementById("js-tab-content__list");

    tabContentList.textContent = "";
    imgWrapper.textContent = "";

    clickedTabContentCreate(e.target);
  }
});
