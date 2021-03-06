import { format, differenceInCalendarDays } from "date-fns";
const tabMenuList = document.getElementById("js-tab-menu__list");
const API = {
  news: "./json/news.json",
  book: "./json/book.json",
  travel: "./json/travel.json",
  economy: "./json/economy.json"
};
const articleAPI = {
  "8b5ae244-cddb-4b94-a5cd-b1ca4201c945": "./json/article-1.json",
  "8b5ae244-cddb-4b94-a5cd-b1ca4201c946": "./json/article-2.json",
  "7cb39430-d000-4b2a-8bbd-29a6ff6c7694": "./json/article-3.json",
  "7cb39430-d000-4b2a-8bbd-29a6ff6c7697": "./json/article-4.json",
  "4c42eb6a-dc41-4138-ac0a-49062e4a55e3": "./json/article-5.json",
  "9d50f525-b5a3-469d-ad28-0bbaa3f38fcc": "./json/article-6.json",
  "9d50f525-b5a3-469d-ad28-0bbaa3f38fce": "./json/article-7.json"
}

function createElementWithClassName(type, name) {
  const element = document.createElement(type);
  element.className = name;
  return element;
}

function addLoading(parent) {
  const loading = createElementWithClassName("img", "loading");
  loading.id = "js-loading";
  loading.src = "./img/loading-circle.gif";
  parent.appendChild(loading);
}

function removeLoading() {
  document.getElementById("js-loading").remove();
}

function addErrorMessage(error, parent) {
  const errorMessage = createElementWithClassName("p", "error-message");
  errorMessage.textContent = error;
  parent.appendChild(errorMessage);
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
  const tabContent = document.getElementById("js-tab-content");
  try {
    const data = await Promise.all(Object.values(API).map(getJsonOrError));
    return data.filter((value) => value !== undefined);
  } catch (e) {
    addErrorMessage(e, tabContent);
  }
}

function createTabMenu(data) {
  for (let i = 0; i < data.length; i++) {
    const tabMenuItem = createElementWithClassName("li", "tab-menu__item");
    tabMenuItem.id = data[i].category;
    tabMenuItem.textContent = data[i].category;
    tabMenuList.appendChild(tabMenuItem);
  }
}

function createTabContent() {
  const tabContent = createElementWithClassName("div", "tab-content");
  const imageWrapper = createElementWithClassName("div", "tab-content__img-wrapper");
  const tabContentList = createElementWithClassName("ul", "tab-content__list")

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

function addNewIcon(parent) {
  const newIcon = createElementWithClassName("img", "new-icon");
  newIcon.src = "./img/new-icon.svg";
  parent.appendChild(newIcon);
}

function hasComment(commentLength) {
  return commentLength > 0;
}

function addCommentLength(commentLength, parent) {
  const commentWrapper = createElementWithClassName("span", "comment-length");
  const commentIcon = createElementWithClassName("img", "comment-icon");
  commentIcon.src = "./img/comment-icon.svg";

  commentWrapper.appendChild(commentIcon);
  commentWrapper.insertAdjacentHTML("beforeend", commentLength);
  setClickEventInCommentIcon(commentWrapper);

  parent.appendChild(commentWrapper);
}

async function createArticleElements({ article }) {
  const ul = document.getElementById("js-tab-content__list");
  const frag = document.createDocumentFragment();
  for (let i = 0; i < article.length; i++) {
    const metaWrapper = createElementWithClassName("div", "meta-wrapper");
    const commentLength = article[i].comment.length;

    if (isSpecifiedPeriod(article[i].date)) {
      addNewIcon(metaWrapper);
    }
    if (hasComment(commentLength)) {
      addCommentLength(commentLength, metaWrapper);
    }

    const li = document.createElement("li");
    li.id = article[i].id;
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
  const tabContent = document.getElementById("js-tab-content");
  const targetId = await target.id;
  const json = await tryGetData(tabContent, API[targetId]);
  createArticleElements(json);
  addImage(json);
}

async function tryGetData(parent, resource) {
  addLoading(parent);
  try {
    return await getJsonOrError(resource);
  } catch (e) {
    addErrorMessage(e, parent);
  } finally {
    removeLoading();
  }
}

function addModal() {
  const modal = createElementWithClassName("div", "modal");
  const modalInner = createElementWithClassName("div", "modal__inner")
  modal.id = "js-modal";
  modalInner.id = "js-modal-inner";
  modal.appendChild(modalInner);
  document.querySelector("body").appendChild(modal);
  addModalCloseIcon(modal);
}

function addModalCloseIcon(parent) {
  const modalCloseWrapper = createElementWithClassName("div", "modal__close-wrapper");
  const icon = document.createElement("img");
  icon.src = "./img/cross-icon.svg";
  modalCloseWrapper.appendChild(icon);
  parent.appendChild(modalCloseWrapper);
  setClickEventForModalClose(icon);
}

function addOverLay() {
  const overLay = createElementWithClassName("div", "over-lay");
  overLay.id = "js-over-lay";
  document.querySelector("body").appendChild(overLay);
  setClickEventForModalClose(overLay);
}

function setClickEventForModalClose(target) {
  target.addEventListener("click", () => {
    document.getElementById("js-modal-inner").textContent = "";
    document.getElementById("js-modal").classList.remove("is-modal-open");
    document.getElementById("js-over-lay").classList.remove("is-overlay-display");
  });
}

function openModalAndOverLay() {
  document.getElementById("js-modal").classList.add("is-modal-open");
  document.getElementById("js-over-lay").classList.add("is-overlay-display");
}

function setClickEventInCommentIcon(target) {
  target.addEventListener("click", async(e) => {
    openModalAndOverLay();
    const toAppendElement = document.getElementById("js-modal-inner");
    const targetParentId = e.currentTarget.closest("li").id;
    const commentData = await getComment(targetParentId,toAppendElement);
    createAndAddCommentContent(commentData,toAppendElement);
  });
}

async function getClickedArticleData(resource, parent) {
  return await tryGetData(parent, articleAPI[resource]);
}

async function getComment(targetId, parent) {
  const responseData = await getClickedArticleData(targetId, parent);
  const { comment } = responseData;
  return comment;
}

async function createAndAddCommentContent(data, parent) {
  const commentContentFragment = document.createDocumentFragment();
  for (const { name, detail, icon } of data) {
    const modalItem = createElementWithClassName("div", "modal-item");
    const detailWrapper = createElementWithClassName("div", "modal__detail-wrapper");
    const imgWrapper = createElementWithClassName("div", "modal__img-wrapper");
    const userName = createElementWithClassName("p", "user-name");
    const image = createElementWithClassName("img", "user-icon");
    const comment = createElementWithClassName("p", "user-comment");

    userName.textContent = name;
    comment.textContent = detail;
    image.src = icon;

    detailWrapper.appendChild(userName);
    detailWrapper.appendChild(comment);
    imgWrapper.appendChild(image);

    commentContentFragment.appendChild(modalItem).appendChild(detailWrapper);
    modalItem.insertBefore(imgWrapper, detailWrapper);
  }
  parent.appendChild(commentContentFragment);
}

createTabContent();
configUIfromFetchData();
addModal();
addOverLay();

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
