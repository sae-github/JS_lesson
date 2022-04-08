const articleWrapper = document.getElementById("js-article-wrapper");
let currentArticleData;

const createElementWithClassName = (type, className) => {
  const element = document.createElement(type);
  element.className = className;
  return element;
};

const createLoading = () => {
  const loadingWrapper = createElementWithClassName("div", "loading-wrapper");
  const loading = document.createElement("img");
  loadingWrapper.id = "js-loading";
  loading.src = "./img/loading-circle.gif";
  loadingWrapper.appendChild(loading);
  return loadingWrapper;
};

const removeLoading = () => document.getElementById("js-loading").remove();

const createErrorMessage = (error) => {
  const errorMessage = createElementWithClassName("p", "article-error-message");
  errorMessage.textContent = error;
  return errorMessage;
};

const fetchErrorHandling = async (response) => {
  if (response.ok) {
    return await response.json();
  } else {
    const responseMessage = `${response.status}:${response.statusText}`;
    articleWrapper.appendChild(createErrorMessage(responseMessage));
    console.error(responseMessage);
  }
};

const getJsonOrError = async (url) => {
  const response = await fetch(url);
  const json = await fetchErrorHandling(response);
  return json;
};

const getArticleData = async (url) => {
  articleWrapper.appendChild(createLoading());
  try {
    return await getJsonOrError(url)
  } catch (error) {
    articleWrapper.appendChild(createErrorMessage(`データの読み取りに失敗しました${error}`));
  } finally {
    removeLoading();
  }
}

const changeFavoriteButtonToDisabled = () => {
  const favoriteButton = document.getElementById("js-favorite-button");
  favoriteButton.firstChild.src = "./img/star-icon--disabled.svg";
  favoriteButton.disabled = true;
}

const setFavoriteArticleDataInLocalStorage = () => {
  const loginUserToken = localStorage.getItem("token");
  const favoriteArticlesData = JSON.parse(localStorage.getItem("favoriteArticles")) ?? {};
  const favoriteArticlesDataOfLoginUser = favoriteArticlesData[loginUserToken] ?? [];
  const registeredFavoriteArticleData = [
    ...favoriteArticlesDataOfLoginUser,
    {
      [currentArticleData.id]: {
        "title": currentArticleData.title,
        "date": currentArticleData.date,
        "thumbnail": currentArticleData.thumbnail
      }
    }
  ]
  const mergedData = { ...favoriteArticlesData, [loginUserToken]: registeredFavoriteArticleData };
  localStorage.setItem("favoriteArticles", JSON.stringify(mergedData));
}

const renderArticle = (data) => {
  const articleFragment = document.createDocumentFragment();
  const article = createElementWithClassName("article", "article");
  const articleTitle = createElementWithClassName("h1", "article__title");
  const articleContent = createElementWithClassName("div", "article__content");
  articleTitle.textContent = data.title;
  articleContent.textContent = data.content;
  articleFragment.appendChild(articleTitle).after(createArticleMeta(data));
  data.thumbnail && articleFragment.appendChild(createArticleThumbnail(data));
  articleFragment.appendChild(articleContent);
  articleWrapper.appendChild(article).appendChild(articleFragment);
}

const addEventListenerForFavoriteButton = () => {
  const favoriteButton = document.getElementById("js-favorite-button");
  favoriteButton.addEventListener("click", (event) => {
    event.preventDefault();
    changeFavoriteButtonToDisabled();
    setFavoriteArticleDataInLocalStorage();
  });
}

const renderFavoriteButton = () => {
  const favoriteButton = createElementWithClassName("button", "article__favorite-icon");
  const img = document.createElement("img");
  img.src = "./img/star-icon.svg";
  favoriteButton.id = "js-favorite-button";
  articleWrapper.appendChild(favoriteButton).appendChild(img);
}

const createArticleMeta = ({ date }) => {
  const articleMetaWrapper = createElementWithClassName("div", "article__meta");
  const articleDate = createElementWithClassName("p", "article__date");
  articleDate.textContent = date;
  articleMetaWrapper.appendChild(articleDate);
  return articleMetaWrapper;
}

const createArticleThumbnail = ({ thumbnail }) => {
  const articleThumbnail = createElementWithClassName("p", "article__thumbnail");
  const img = document.createElement("img");
  img.src = thumbnail;
  articleThumbnail.append(img);
  return articleThumbnail;
}

const findArticleData = (data) => {
  const urlParams = new URLSearchParams(window.location.search);
  let result;
  data.forEach(({ article }) => {
    article.forEach((data) => data.id === urlParams.get("id") && (result = data));
  });
  return result;
}

const isRegisteredFavoriteArticle = () => {
  const loginUserToken = localStorage.getItem("token");
  const userFavoriteArticlesData = JSON.parse(localStorage.getItem("favoriteArticles"))?.[loginUserToken];
  return userFavoriteArticlesData && userFavoriteArticlesData.some((data) => data[currentArticleData.id])
}

const init = async () => {
  const api = "https://mocki.io/v1/719894c7-b5df-4ee7-8217-7cebcdcc1dcf";
  const responseData = await getArticleData(api);
  const data = responseData?.data;
  if (data) {
    currentArticleData = findArticleData(data);
    if (!currentArticleData) {
      articleWrapper.textContent = "指定されたURLは存在しませんでした。";
      return;
    }
    renderArticle(currentArticleData);
    renderFavoriteButton();
    addEventListenerForFavoriteButton();
    isRegisteredFavoriteArticle() && changeFavoriteButtonToDisabled();
  }
}

init();
