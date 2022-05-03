import { differenceInDays } from "date-fns";
import { createElementWithClassName } from "./modules/createElementWithClassName";
import { loading } from "./modules/loading";

const tabMenu = document.getElementById("js-tab-menu");
const overlay = document.getElementById("js-overlay");
const modalCloseButton = document.getElementById("js-modal-close-button");

const API = {
  news: "https://mocki.io/v1/c15a569d-6392-4ef4-8901-249546b50fe5",
  book: "https://mocki.io/v1/d2fce05d-c6ad-42c3-a8d1-d3b8b7d83084",
  economy: "https://mocki.io/v1/36806f47-f531-4e87-b77b-d20bae5eb98f",
  travel: "https://mocki.io/v1/4743c319-f3cd-4606-98fc-9b036453fb46"
};

const createErrorMessage = (error) => {
  const errorMessage = createElementWithClassName("p", "error-message");
  errorMessage.textContent = error;
  return errorMessage;
};

const fetchErrorHandling = async (response) => {
  if (!response.ok) {
    const responseMessage = `${response.status}:${response.statusText}`;
    tabMenu.append(createErrorMessage(responseMessage));
    console.error(responseMessage);
    return;
  }
  return await response.json();
};

const getJsonOrError = async (url) => {
  const response = await fetch(url);
  const json = await fetchErrorHandling(response);
  return json;
};

const getArticlesData = async () => {
  const newsSection = document.getElementById("js-news");
  try {
    const data = await Promise.all(Object.values(API).map(getJsonOrError));
    if (!data.every((d) => d)) return;
    return data;
  } catch (error) {
    newsSection.appendChild(createErrorMessage(error));
  }
}

const createTabMenu = (data) => {
  const tabMenuFrag = document.createDocumentFragment();
  data.forEach((d) => {
    const tabMenuItem = createElementWithClassName("li", "news-tab__menu-item");
    tabMenuItem.id = d.category;
    tabMenuItem.textContent = d.category;
    tabMenuFrag.appendChild(tabMenuItem);
  });
  return tabMenuFrag;
}

const createTabContent = () => {
  const tabContent = createElementWithClassName("div", "news-tab__content");
  const imageWrapper = createElementWithClassName("div", "news-tab__img-wrapper");
  const tabContentList = document.createElement("ul");

  tabContent.id = "js-tab-content";
  tabContentList.id = "js-tab-list";
  imageWrapper.id = "js-tab-img";

  tabContent
    .appendChild(tabContentList)
    .after(imageWrapper);
  return tabContent;
}

const init = async () => {
  const articlesData = await getArticlesData();
  if (articlesData) {
    tabMenu.after(createTabContent());
    tabMenu.appendChild(createTabMenu(articlesData));
    const selectedData = articlesData.find(value => value.select);
    const tab = document.getElementById(selectedData.category);
    tab.classList.add("tab-select");
    document.getElementById("js-tab-list").append(createArticleElements(selectedData));
    document.getElementById("js-tab-img").append(createCategoryImg(selectedData));
    addEventListenerForTabItemTitle();
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

const hasComment = commentLength => commentLength > 0;

const createCommentLength = (commentLength) => {
  const commentWrapper = createElementWithClassName("span", "comment-length");
  const commentIcon = createElementWithClassName("img", "comment-icon");
  commentIcon.src = "./img/comment-icon.svg";
  commentWrapper.appendChild(commentIcon).after(commentLength);
  return commentWrapper;
}

const createArticleElements = ({ article }) => {
  const articleFrag = document.createDocumentFragment();
  article.forEach((data) => {
    const li = document.createElement("li");
    const anchor = createElementWithClassName("a", "js-tab-item-title");
    const metaWrapper = createElementWithClassName("div", "meta-wrapper");
    const commentLength = data.comments.length;
    li.id = data.id;
    anchor.textContent = data.title;
    isSpecifiedPeriod(data.date) && metaWrapper.appendChild(createNewLabel());
    hasComment(commentLength) && metaWrapper.appendChild(createCommentLength(commentLength));
    articleFrag
      .appendChild(li)
      .appendChild(anchor)
      .after(metaWrapper);
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
  const targetId = target.id;
  const json = await getJSonData(tabContent, API[targetId]);
  document.getElementById("js-tab-list").appendChild(createArticleElements(json));
  document.getElementById("js-tab-img").appendChild(createCategoryImg(json));
  addEventListenerForTabItemTitle();
}

const getJSonData = async (parent, api) => {
  parent.appendChild(loading.create());
  try {
    return await getJsonOrError(api);
  } catch (error) {
    parent.appendChild(createErrorMessage(error));
  } finally {
    loading.remove();
  }
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

init();

const toggleModalOpen = () => document.body.classList.toggle("modal-open");

const addEventListenerForTabItemTitle = () => {
  const tabItemTitle = [...document.querySelectorAll(".js-tab-item-title")];
  tabItemTitle.forEach((title) => {
    title.addEventListener("click", (event) => {
      event.preventDefault();
      toggleModalOpen();
    });
  });
}

overlay.addEventListener("click", toggleModalOpen);
modalCloseButton.addEventListener("click", toggleModalOpen);
