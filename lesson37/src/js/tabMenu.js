import { differenceInDays } from "date-fns";
import { createElementWithClassName } from "./modules/createElementWithClassName";
import { loading } from "./modules/loading";

const tabMenu = document.getElementById("js-tab-menu");
const newsWrapper = document.getElementById("js-news-tab");

const API = {
  news: "https://mocki.io/v1/c15a569d-6392-4ef4-8901-249546b50fe5",
  book: "https://mocki.io/v1/d2fce05d-c6ad-42c3-a8d1-d3b8b7d83084",
  economy: "https://mocki.io/v1/36806f47-f531-4e87-b77b-d20bae5eb98f",
  travel: "https://mocki.io/v1/4743c319-f3cd-4606-98fc-9b036453fb46"
};

const articleAPI = {
  "8b5ae244-cddb-4b94-a5cd-b1ca4201c945":
    "https://mocki.io/v1/4d919ba0-21f0-4006-b287-3393cfb6e96c",
  "8b5ae244-cddb-4b94-a5cd-b1ca4201c946":
    "https://mocki.io/v1/16d2781e-0818-494b-966f-b8518cdf1cb0",
  "7cb39430-d000-4b2a-8bbd-29a6ff6c7694":
    "https://mocki.io/v1/9ee0be09-2643-4c66-a43d-d65fc0bcb2ed",
  "7cb39430-d000-4b2a-8bbd-29a6ff6c7697":
    "https://mocki.io/v1/1540747b-48c4-4552-b6e4-2555b80a7c3e",
  "4c42eb6a-dc41-4138-ac0a-49062e4a55e3":
    "https://mocki.io/v1/af1819e8-d303-4cbf-903d-c4375f671e8a",
  "9d50f525-b5a3-469d-ad28-0bbaa3f38fcc":
    "https://mocki.io/v1/a908757b-8002-42ae-b572-5933a5b00b81",
  "9d50f525-b5a3-469d-ad28-0bbaa3f38fce":
    "https://mocki.io/v1/a53e046f-a838-454d-9e2d-696bce2b592c"
};

const createErrorMessage = (error) => {
  const errorMessage = createElementWithClassName("p", "tab-menu__error-message");
  errorMessage.textContent = error;
  return errorMessage;
};

const fetchErrorHandling = async (response, parent) => {
  if (!response.ok) {
    const responseMessage = `${response.status}:${response.statusText}`;
    parent.appendChild(createErrorMessage(responseMessage));
    console.error(responseMessage);
    return;
  }
  return await response.json();
};

const getJsonOrError = async (url, parent) => {
  const response = await fetch(url);
  const json = await fetchErrorHandling(response, parent);
  return json;
};

const getArticleData = async () => {
  const newsSection = document.getElementById("js-news");
  try {
    const data = await Promise.all(Object.values(API).map((url) => getJsonOrError(url, newsWrapper)));
    if (!data.every((d) => d)) return;
    return data;
  } catch (e) {
    newsSection.appendChild(createErrorMessage(e));
  }
}

const createTabMenu = (data) => {
  const tabMenuFragment = document.createDocumentFragment();
  data.forEach((d) => {
    const tabMenuItem = createElementWithClassName("li", "news-tab__menu-item");
    tabMenuItem.id = d.category;
    tabMenuItem.textContent = d.category;
    tabMenuFragment.appendChild(tabMenuItem);
  });
  return tabMenuFragment;
}

const createTabContent = () => {
  const tabContent = createElementWithClassName("div", "news-tab__content");
  const imageWrapper = createElementWithClassName("div", "news-tab__img-wrapper");
  const tabContentList = document.createElement("ul");

  tabContent.id = "js-tab-content";
  tabContentList.id = "js-tab-list";
  imageWrapper.id = "js-tab-img";

  tabContent.appendChild(tabContentList).after(imageWrapper);
  return tabContent;
}

const configUIfromFetchData = async () => {
  const data = await getArticleData();
  if (data) {
    tabMenu.after(createTabContent());
    tabMenu.appendChild(createTabMenu(data));
    const hasSelectData = data.find((value) => value.select);
    const tab = document.getElementById(hasSelectData.category);
    tab.classList.add("tab-select");
    document.getElementById("js-tab-list").append(createArticleElements(hasSelectData));
    document.getElementById("js-tab-img").append(createCategoryImg(hasSelectData));
    // setClickEventInCommentIcon();
  }
}

const isSpecifiedPeriod = (date) => {
  const newArrivalDays = 3;
  const differenceDays = differenceInDays(new Date(), new Date(date));
  return differenceDays <= newArrivalDays;
}

const createNewLabel = () => {
  const newLabel = createElementWithClassName("p", "new-label");
  newLabel.textContent = "New";
  return newLabel;
}

const hasComment = (commentLength) => commentLength > 0;

const createCommentLength = (commentLength) => {
  const commentWrapper = createElementWithClassName("span", "comment-length");
  const commentIcon = createElementWithClassName("img", "comment-icon");
  commentIcon.src = "./img/comment-icon.svg";
  commentWrapper.appendChild(commentIcon).after(commentLength);
  setClickEventInCommentIcon(commentWrapper);
  return commentWrapper;
}

const createArticleElements = ({ article }) => {
  const articleFrag = document.createDocumentFragment();
  article.forEach((data) => {
    const metaWrapper = createElementWithClassName("div", "meta-wrapper");
    const commentLength = data.comments.length;
    isSpecifiedPeriod(data.date) && metaWrapper.appendChild(createNewLabel());
    hasComment(commentLength) && metaWrapper.appendChild(createCommentLength(commentLength));
    const li = document.createElement("li");
    li.id = data.id;
    const anchor = document.createElement("a");
    anchor.href = `./article.html?id=${data.id}`;
    anchor.textContent = data.title;
    articleFrag.appendChild(li).appendChild(anchor).after(metaWrapper);
  });
  return articleFrag;
}

const createCategoryImg = ({ image }) => {
  const categoryImg = document.createElement("img");
  categoryImg.src = image;
  return categoryImg;
}

const createClickedTabContent = async (target) => {
  const tabContent = document.getElementById("js-tab-content");
  const targetId = await target.id;
  const json = await tryGetData(tabContent, API[targetId]);
  document.getElementById("js-tab-list").appendChild(createArticleElements(json));
  document.getElementById("js-tab-img").appendChild(createCategoryImg(json));
}

const tryGetData = async (parent, api) => {
  parent.appendChild(loading.create());
  try {
    return await getJsonOrError(api, parent);
  } catch (error) {
    parent.appendChild(createErrorMessage(error));
  } finally {
    loading.remove();
  }
}

const createModal = () => {
  const modal = createElementWithClassName("div", "modal");
  const modalInner = createElementWithClassName("div", "modal__inner");
  modal.id = "js-modal";
  modalInner.id = "js-modal-inner";
  modal.appendChild(modalInner);
  return modal;
}

const createModalCloseIcon = () => {
  const modalCloseIconWrapper = createElementWithClassName("div", "modal__close-wrapper");
  const closeIcon = document.createElement("img");
  closeIcon.src = "./img/cross-icon.svg";
  setClickEventForModalClose(closeIcon);
  modalCloseIconWrapper.appendChild(closeIcon);
  return modalCloseIconWrapper;
}

const createOverLay = () => {
  const overLay = createElementWithClassName("div", "overlay");
  overLay.id = "js-over-lay";
  setClickEventForModalClose(overLay);
  return overLay;
}

const addModal = () => {
  const newsSection = document.querySelector(".news");
  newsSection.appendChild(createModal()).appendChild(createModalCloseIcon());
}

const addOverLay = () => {
  document.getElementById("js-news").appendChild(createOverLay());
}

const setClickEventForModalClose = (target) => {
  target.addEventListener("click", () => {
    document.getElementById("js-modal-inner").textContent = "";
    document.querySelector("body").classList.remove("modal-open");
  });
}

const openModalAndOverLay = () => {
  document.querySelector("body").classList.add("modal-open");
}

const setClickEventInCommentIcon = (target) => {
  target.addEventListener("click", async (event) => {
    openModalAndOverLay();
    const toAppendElement = document.getElementById("js-modal-inner");
    const targetParentId = event.currentTarget.closest("li").id;
    const commentData = await getComment(targetParentId, toAppendElement);
    toAppendElement.appendChild(createModalContent(commentData));
  });
}

const getComment = async (targetId, parent) => {
  const responseData = await tryGetData(parent, articleAPI[targetId]);
  const { comments } = responseData;
  return comments;
}

const createModalContent = (commentData) => {
  const commentContentFragment = document.createDocumentFragment();
  for (const { name, detail, icon } of commentData) {
    const modalItem = createElementWithClassName("div", "modal-item");
    const detailWrapper = createElementWithClassName("div", "modal__detail-wrapper");
    const imgWrapper = createElementWithClassName("div", "modal__img-wrapper");
    const userName = createElementWithClassName("p", "user-name");
    const image = createElementWithClassName("img", "user-icon");
    const comment = createElementWithClassName("p", "user-comment");
    userName.textContent = name;
    comment.textContent = detail;
    image.src = icon;

    imgWrapper.append(image);
    commentContentFragment
      .appendChild(modalItem)
      .appendChild(detailWrapper)
      .appendChild(userName)
      .after(comment);
    modalItem.appendChild(imgWrapper).after(detailWrapper);
  }
  return commentContentFragment;
}

tabMenu.addEventListener("click", (event) => {
  document.querySelector(".tab-select").classList.remove("tab-select");
  event.target.classList.add("tab-select");

  const imgWrapper = document.getElementById("js-tab-img");
  const tabContentList = document.getElementById("js-tab-list");

  tabContentList.textContent = "";
  imgWrapper.textContent = "";
  createClickedTabContent(event.target);
});

configUIfromFetchData();
addModal();
addOverLay();
