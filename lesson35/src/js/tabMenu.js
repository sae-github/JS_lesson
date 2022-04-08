import { differenceInDays } from "date-fns";
const tabMenu = document.getElementById("js-tab-menu");

const API = {
  news: "https://mocki.io/v1/8f25b166-c2e4-460e-b10d-43802067b457",
  book: "https://mocki.io/v1/50075330-2da2-45e0-8c02-9d55fa12e997",
  economy: "https://mocki.io/v1/9a0a7e47-bc46-46d7-80a6-f7daa1580275",
  travel: "https://mocki.io/v1/7955e7c4-56fd-4ee6-8c8e-bda45aa38783",
  column: "https://mocki.io/v1/71671377-a8e4-4b78-a13e-21ebf3f8477f"
};

const articleAPI = {
  "8b5ae244-cddb-4b94-a5cd-b1ca4201c945":
    "https://mocki.io/v1/47c8a0bf-25cc-469f-8bf3-5de1d50eb260",
  "8b5ae244-cddb-4b94-a5cd-b1ca4201c946":
    "https://mocki.io/v1/eaada9c5-44ef-46a6-a795-ba9dbc7e8de8",
  "7cb39430-d000-4b2a-8bbd-29a6ff6c7694":
    "https://mocki.io/v1/c1fb9a87-70c7-4fed-89c1-894a3d2712ae",
  "7cb39430-d000-4b2a-8bbd-29a6ff6c7697":
    "https://mocki.io/v1/c1d113bb-2fee-4558-ac89-75dc91ab874f",
  "4c42eb6a-dc41-4138-ac0a-49062e4a55e3":
    "https://mocki.io/v1/74b405cf-62e0-4e91-85f7-af7428031569",
  "9d50f525-b5a3-469d-ad28-0bbaa3f38fcc":
    "https://mocki.io/v1/f11e19f2-5bd2-478f-9fcc-5a79d4591571",
  "9d50f525-b5a3-469d-ad28-0bbaa3f38fce":
    "https://mocki.io/v1/dccb7735-bede-4915-96cc-7c02bfe9e454",
  "787adcb5-7515-483d-97c8-0998230fc064":
    "https://mocki.io/v1/bc53749e-5827-4db1-ae62-280d0572d14c",
  "787adcb5-7515-483d-97c8-0998230fc065":
    "https://mocki.io/v1/d4937ffe-3b35-4377-a743-279f0e8623ec",
  "787adcb5-7515-483d-97c8-0998230fc066":
    "https://mocki.io/v1/e9a31364-1a37-4b34-af62-b75c4d954139"
};

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
  if (!response.ok) throw new Error("サーバーエラーが発生しました");
  return await response.json();
};

const getJsonOrError = async (url) => {
  const response = await fetch(url);
  const json = await fetchErrorHandling(response);
  return json;
};

const getArticleData = async () => {
  const newsSection = document.getElementById("js-news");
  try {
    const data = await Promise.all(Object.values(API).map(getJsonOrError));
    return data.filter((value) => value !== undefined);
  } catch (e) {
    newsSection.appendChild(createErrorMessage(e));
  }
}

const createTabMenu = (data) => {
  const tabMenuFrag = document.createDocumentFragment();
  for (let i = 0; i < data.length; i++) {
    const tabMenuItem = createElementWithClassName("li", "news-tab__menu-item");
    tabMenuItem.id = data[i].category;
    tabMenuItem.textContent = data[i].category;
    tabMenuFrag.appendChild(tabMenuItem);
  }
  return tabMenuFrag;
}

const createTabContent = () => {
  const tabContent = createElementWithClassName("div", "news-tab__content");
  const imageWrapper = createElementWithClassName("div", "news-tab__img-wrapper");
  const tabContentList = document.createElement("ul");

  tabContent.id = "js-tab-content";
  tabContentList.id = "js-tab-list";
  imageWrapper.id = "js-tab-img";

  tabContent.appendChild(tabContentList);
  tabContent.appendChild(imageWrapper);
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
  commentWrapper.appendChild(commentIcon);
  commentWrapper.insertAdjacentHTML("beforeend", commentLength);
  setClickEventInCommentIcon(commentWrapper);
  return commentWrapper;
}

const createArticleElements = ({ article }) => {
  const articleFrag = document.createDocumentFragment();
  for (let i = 0; i < article.length; i++) {
    const metaWrapper = createElementWithClassName("div", "meta-wrapper");
    const commentLength = article[i].comments.length;
    isSpecifiedPeriod(article[i].date) && metaWrapper.appendChild(createNewLabel());
    hasComment(commentLength) && metaWrapper.appendChild(createCommentLength(commentLength));
    const li = document.createElement("li");
    li.id = article[i].id;
    const anchor = document.createElement("a");
    anchor.href = `./article.html?id=${article[i].id}`;
    anchor.textContent = article[i].title;
    articleFrag.appendChild(li).appendChild(anchor).after(metaWrapper);
  }
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
  parent.appendChild(createLoading());
  try {
    return await getJsonOrError(api);
  } catch (e) {
    parent.appendChild(createErrorMessage(e));
  } finally {
    removeLoading();
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

const getClickedArticleData = async (resource, parent) => {
  return await tryGetData(parent, articleAPI[resource]);
}

const getComment = async (targetId, parent) => {
  const responseData = await getClickedArticleData(targetId, parent);
  const { comments } = responseData;
  return comments;
}

const createModalContent = (commentData) => {
  const commentContentFrag = document.createDocumentFragment();
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
    detailWrapper.appendChild(userName);
    detailWrapper.appendChild(comment);
    imgWrapper.appendChild(image);
    commentContentFrag.appendChild(modalItem).appendChild(detailWrapper);
    modalItem.insertBefore(imgWrapper, detailWrapper);
  }
  return commentContentFrag;
}

tabMenu.addEventListener("click", (event) => {
  const selectedTab = document.querySelector(".tab-select");
  selectedTab.classList.remove("tab-select");
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
