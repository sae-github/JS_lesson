const articleList = document.getElementById("js-article-List");

const createElementWithClassName = (type, className) => {
  const element = document.createElement(type);
  element.className = className;
  return element;
};

const createErrorMessage = (text) => {
  const errorMessage = createElementWithClassName("p", "article-error-message");
  errorMessage.textContent = text;
  return errorMessage;
};

const renderLoading = () => {
  const loadingWrapper = createElementWithClassName("div", "article-loading-wrapper");
  const loading = document.createElement("img");
  loadingWrapper.id = "js-loading";
  loading.src = "./img/article-loading.gif";
  articleList.appendChild(loadingWrapper).appendChild(loading);
};

const removeLoading = () => document.getElementById("js-loading").remove();

const fetchData = async (endpoint) => {
  const response = await fetch(endpoint);
  if (!response.ok) {
    const responseMessage = `${response.status}:${response.statusText}`;
    articleList.append(createErrorMessage(responseMessage));
    console.error(responseMessage);
    return;
  }
  return await response.json();
}

const getArticleData = async (api) => {
  try {
    return await fetchData(api);
  } catch (error) {
    console.error(error);
    articleList.before(createErrorMessage(error));
  }
}

const renderArticleItems = (articleData) => {
  articleData.forEach((data) => {
    const item = createElementWithClassName("li", "article__item");
    const content = createElementWithClassName("p", "article__item-content");
    const author = document.createElement("p");
    author.textContent = data.author;
    content.textContent = data.quote;
    articleList.appendChild(item).appendChild(author).after(content);
  });
}

let totalPosts;
const endpointConfig = {
  path: "https://api.javascripttutorial.net/v1/quotes/",
  limit: 10,
  currentPage: 1,
  get endpoint() {
    const url = new URL(this.path);
    url.searchParams.set("page", this.currentPage);
    url.searchParams.set("limit", this.limit);
    return url.href;
  }
}

const observeConfig = {
  observe: null,
  option: { threshold: 1.0 },
  startObserve: (target, callback) => {
    observeConfig.observe = new IntersectionObserver(callback, observeConfig.option);
    observeConfig.observe.observe(target);
  },
  stopObserve: (target) => {
    observeConfig.observe.unobserve(target);
  }
}

const getArticleDataAndUpdate = async () => {
  ++endpointConfig.currentPage;
  const articleData = await getArticleData(endpointConfig.endpoint);
  removeLoading();
  if (articleData) {
    renderArticleItems(articleData.data);
    observeConfig.startObserve(articleList.lastElementChild, intersectHandler);
  }
}

const intersectHandler = ([entry]) => {
  if (!entry.isIntersecting) return;
  observeConfig.stopObserve(entry.target);
  const articleItems = document.querySelectorAll(".article__item");
  if (articleItems.length < totalPosts) {
    renderLoading();
    setTimeout(getArticleDataAndUpdate, 500);
  }
}

const init = async () => {
  renderLoading();
  const articleData = await getArticleData(endpointConfig.endpoint);
  removeLoading();
  if (articleData.data.length === 0) {
    articleList.append(createErrorMessage("表示する記事がありません"));
    return;
  }
  totalPosts = articleData.total;
  renderArticleItems(articleData.data);
  observeConfig.startObserve(articleList.lastElementChild, intersectHandler);
}

init();
