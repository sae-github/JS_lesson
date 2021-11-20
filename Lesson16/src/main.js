import { format, differenceInCalendarDays } from "date-fns";
const tabMenuList = document.getElementById("js-tab-menu__list");
const API = {
  news: "./json/news.json",
  book: "./json/book.json",
  travel: "./json/travel.json",
  economy: "./json/economy.json"
};

function createElementWithClass(type, name) {
  const element = document.createElement(type);
  element.className = name;
  return element;
}

function addLoading() {
  const tabContent = document.getElementById("js-tab-content");
  const loading = createElementWithClass("img", "loading");
  loading.src = "./img/loading-circle.gif";
  loading.id = "js-loading";
  tabContent.appendChild(loading);
}

function removeLoading() {
  document.getElementById("js-loading").remove();
}

function addErrorMessage(error) {
  const tabContent = document.getElementById("js-tab-content");
  const errorMessage = createElementWithClass("p", "error-message");
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
  try {
    const data = await Promise.all(Object.values(API).map(getJsonOrError));
    return data.filter((value) => value !== undefined);
  } catch (e) {
    addErrorMessage(e);
  }
}

function createTabMenu(data) {
  for (let i = 0; i < data.length; i++) {
    const tabMenuItem = createElementWithClass("li", "tab-menu__item");
    tabMenuItem.id = data[i].category;
    tabMenuItem.textContent = data[i].category;
    tabMenuList.appendChild(tabMenuItem);
  }
}

function createTabContent() {
  const tabContent = createElementWithClass("div", "tab-content");
  const imageWrapper = createElementWithClass("div", "tab-content__img-wrapper");
  const tabContentList = createElementWithClass("ul", "tab-content__list")

  tabContent.id = "js-tab-content";
  tabContentList.id = "js-tab-content__list";
  imageWrapper.id = "js-img-wrapper";

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
    tab.classList.add("tab-select");
    createArticleElements(hasSelectData);
    addImage(hasSelectData);
  }
}

function isSpecifiedPeriod(date) {
  const newArrivalDays = 3;
  const today = format(new Date(), "yyyy,MM,dd");
  const articleDate = format(new Date(date), "yyyy,MM,dd");
  const periodOfDays = differenceInCalendarDays(
    new Date(today),
    new Date(articleDate)
  );
  const result = periodOfDays <= newArrivalDays;
  return result;
}

function addNewIcon(element) {
  const newIcon = createElementWithClass("img", "new-icon");
  newIcon.src = "./img/new-icon.svg";
  element.appendChild(newIcon);
}

function hasComment(commentLength) {
  return commentLength > 0;
}

function addCommentLength(commentLength, element) {
  const commentWrapper = createElementWithClass("span", "comment-length");
  const commentIcon = createElementWithClass("img", "comment-icon");
  commentIcon.src = "./img/comment-icon.svg";
  commentWrapper.appendChild(commentIcon);
  commentWrapper.insertAdjacentHTML("beforeend", commentLength);
  element.appendChild(commentWrapper);
}

async function createArticleElements({ article }) {
  const ul = document.getElementById("js-tab-content__list");
  const frag = document.createDocumentFragment();
  for (let i = 0; i < article.length; i++) {
    const metaWrapper = createElementWithClass("div", "meta-wrapper");
    const commentLength = article[i].comment.length;

    if (isSpecifiedPeriod(article[i].date)) {
      addNewIcon(metaWrapper);
    }
    if (hasComment(commentLength)) {
      addCommentLength(commentLength, metaWrapper);
    }

    const li = document.createElement("li");
    const anchor = document.createElement("a");
    anchor.href = "#";
    anchor.insertAdjacentHTML("beforeend", article[i].title);
    frag.appendChild(li).appendChild(anchor).after(metaWrapper);
  }
  ul.appendChild(frag);
}

function addImage({ image }) {
  const imgWrapper = document.getElementById("js-img-wrapper");
  const img = document.createElement("img");
  img.src = image;
  imgWrapper.appendChild(img);
}

async function createClickedTabContent(target) {
  const targetId = await target.id;
  const json = await tryGetData(API[targetId]);
  createArticleElements(json);
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
  const hasActiveClassElement = document.getElementsByClassName("tab-select")[0];

  if (hasActiveClassElement && e.currentTarget !== e.target) {
    hasActiveClassElement.classList.remove("tab-select");
    e.target.classList.add("tab-select");

    const imgWrapper = document.getElementById("js-img-wrapper");
    const tabContentList = document.getElementById("js-tab-content__list");

    tabContentList.textContent = "";
    imgWrapper.textContent = "";

    createClickedTabContent(e.target);
  }
});
