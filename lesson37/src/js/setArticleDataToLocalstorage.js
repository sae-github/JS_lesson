import { createElementWithClassName } from "./modules/createElementWithClassName";

const articleWrapper = document.getElementById("js-article-List");
let currentArticleData;

const createErrorMessage = (error) => {
  const errorMessage = createElementWithClassName("p", "article-error-message");
  errorMessage.textContent = error;
  return errorMessage;
};

const fetchErrorHandling = async (response) => {
  if (!response.ok) {
    const responseMessage = `${response.status}:${response.statusText}`;
    articleWrapper.appendChild(createErrorMessage(responseMessage));
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

const getArticleData = async (url) => {
  try {
    return await getJsonOrError(url)
  } catch (error) {
    articleWrapper.appendChild(createErrorMessage(`データの読み取りに失敗しました${error}`));
  }
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

const isEmptyFavoriteArticles = (favoriteArticles) => Object.keys(favoriteArticles).length === 0;

const removeFavoriteArticleInLocalStorage = () => {
  const loginUserToken = localStorage.getItem("token");
  const favoriteArticlesData = JSON.parse(localStorage.getItem("favoriteArticles"));
  const favoriteArticlesDataOfLoginUser = favoriteArticlesData[loginUserToken];

  const currentArticleIndex = favoriteArticlesDataOfLoginUser.findIndex((data) => {
    return Object.keys(data)[0] === currentArticleData.id;
  });
  favoriteArticlesDataOfLoginUser.splice(currentArticleIndex, 1);

  if (favoriteArticlesDataOfLoginUser.length === 0) {
    delete favoriteArticlesData[loginUserToken];
  }

  if (isEmptyFavoriteArticles(favoriteArticlesData)) {
    localStorage.removeItem("favoriteArticles");
    return;
  }
  const mergedData = { ...favoriteArticlesData, [loginUserToken]: favoriteArticlesDataOfLoginUser };
  localStorage.setItem("favoriteArticles", JSON.stringify(mergedData));
}

const addEventListenerForFavoriteButton = () => {
  const favoriteButton = document.getElementById("js-favorite-button");
  favoriteButton.addEventListener("click", (event) => {
    event.preventDefault();
    const ariaPressed = JSON.parse(event.target.ariaPressed);
    if (ariaPressed) {
      event.target.ariaPressed = false;
      removeFavoriteArticleInLocalStorage();
      return;
    }
    event.target.ariaPressed = true;
    setFavoriteArticleDataInLocalStorage();
  });
}

const renderFavoriteButton = () => {
  const favoriteButton = createElementWithClassName("button", "article__favorite-icon");
  favoriteButton.id = "js-favorite-button";
  favoriteButton.ariaPressed = isRegisteredFavoriteArticle() ? true : false;
  articleWrapper.append(favoriteButton);
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
  const api = "https://mocki.io/v1/5cbd84b0-25ea-41be-943f-4876ba864a59";
  const responseData = await getArticleData(api);
  const data = responseData?.data;
  if (data) {
    currentArticleData = findArticleData(data);
    if (!currentArticleData) {
      articleWrapper.textContent = "指定されたURLは存在しませんでした。";
      return;
    }
    renderFavoriteButton();
    addEventListenerForFavoriteButton();
  }
}

init();
