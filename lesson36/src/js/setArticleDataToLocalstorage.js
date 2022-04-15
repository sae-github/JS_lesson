const articleWrapper = document.getElementById("js-article-List");
let currentArticleData;

const createElementWithClassName = (type, className) => {
  const element = document.createElement(type);
  element.className = className;
  return element;
};

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
  const api = "https://mocki.io/v1/9c2bbf94-fbb8-40f1-90c7-cc1870ac6cfa";
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
    isRegisteredFavoriteArticle() && changeFavoriteButtonToDisabled();
  }
}

init();
