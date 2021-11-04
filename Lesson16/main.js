const tabContentList = document.getElementById("js-tab-content");
const imgWrapper = document.getElementById("js-tab-img");
const tabs = document.getElementsByClassName("tab-menu__item");

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


async function getJsonOrError() {
  const response = await fetch("./data.json");
  const json = await fetchErrorHandling(response);
  return json;
}

async function fetchErrorHandling(response) {
  if (response.ok) {
    return await response.json();
  } else {
    throw new Error("サーバーエラーが発生しました");
  }
}

async function tryGetData() {
  try {
    const data = await getJsonOrError();
    return data;
  } catch (error) {
    tabContentList.replaceWith(error);
  }
}

async function createElement({ article }) {
  const frag = document.createDocumentFragment();
  for (let i = 0; i < article.length; i++) {
    const li = document.createElement("li");
    const anchor = document.createElement("a");
    anchor.href = "#";
    anchor.insertAdjacentHTML("beforeend", article[i].title);
    frag.appendChild(li).appendChild(anchor);
  }
  tabContentList.appendChild(frag);
}

function addImage({ image }) {
  const img = document.createElement("img");
  img.src = image;
  imgWrapper.appendChild(img);
}


async function createTabContent(index) {
  const data = await tryGetData();
  if (data) {
    createElement(data[index]);
    addImage(data[index]);
  }
}


async function init() {
  const data = await tryGetData();
  if (data) {
    const hasSelectData = data.find((value) => value.select === true);
    const tab = document.getElementById(hasSelectData.category);
    tab.classList.add("active");
    createElement(hasSelectData);
    addImage(hasSelectData);
  }
}

init();


for (let i = 0; i < tabs.length; i++) {
  tabs[i].addEventListener("click", (e) => {
    const targetIndex = i;
    const hasActiveElement = document.getElementsByClassName("active")[0];

    if (hasActiveElement) {
      hasActiveElement.classList.remove("active");
    }
    e.target.classList.add("active");

    tabContentList.textContent = "";
    imgWrapper.textContent = "";

    createTabContent(targetIndex);
  });
}
