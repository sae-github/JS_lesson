import { differenceInDays } from "date-fns";
const tabMenu = document.getElementById("js-tab-menu");
const overlay = document.getElementById("js-overlay");
const modalCloseButton = document.getElementById("js-modal-close-button");

const API = {
  news: "https://mocki.io/v1/8f25b166-c2e4-460e-b10d-43802067b457",
  book: "https://mocki.io/v1/50075330-2da2-45e0-8c02-9d55fa12e997",
  economy: "https://mocki.io/v1/9a0a7e47-bc46-46d7-80a6-f7daa1580275",
  travel: "https://mocki.io/v1/7955e7c4-56fd-4ee6-8c8e-bda45aa38783"
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

const getArticlesData = async () => {
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
  parent.appendChild(createLoading());
  try {
    return await getJsonOrError(api);
  } catch (e) {
    parent.appendChild(createErrorMessage(e));
  } finally {
    removeLoading();
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
