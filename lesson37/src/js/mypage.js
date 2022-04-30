import { createElementWithClassName } from "./modules/createElementWithClassName";

const favoriteWrapper = document.getElementById("js-favorite-wrapper");
const userToken = localStorage.getItem("token");

const createErrorMessage = (error) => {
  const errorMessage = createElementWithClassName("p", "article-error-message");
  errorMessage.textContent = error;
  return errorMessage;
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

const getFavoriteArticlesDataOfLoginUser = () => {
  return new Promise((resolve) => {
    const favoriteArticlesData = JSON.parse(localStorage.getItem("favoriteArticles"));
    resolve(favoriteArticlesData?.[userToken] || []);
  });
};

const renderFavoriteList = (articlesData) => {
  const favoriteList = createElementWithClassName("ul", "mypage__favorite-list");
  favoriteWrapper
    .appendChild(favoriteList)
    .appendChild(createFavoriteItems(articlesData));
};

const createFavoriteItems = (articlesData) => {
  const fragment = document.createDocumentFragment();
  articlesData.forEach((data) => {
    const [[id, { date, thumbnail, title }]] = Object.entries(data);
    const favoriteItem = createElementWithClassName("li", "mypage__favorite-item");
    const favoriteLink = document.createElement("a");
    const favoriteContent = createElementWithClassName("div", "mypage__favorite-content");
    const favoriteDate = createElementWithClassName("p", "mypage__favorite-date");

    favoriteItem.id = id;
    favoriteLink.href = `./article.html?id=${id}`;
    favoriteDate.textContent = date;

    favoriteContent
      .appendChild(createFavoriteTitle(title))
      .after(favoriteDate);
    favoriteContent.append(createReleaseButton());
    fragment
      .appendChild(favoriteItem)
      .appendChild(favoriteLink)
      .appendChild(createFavoriteThumbnail(thumbnail))
      .after(favoriteContent);
  });
  return fragment;
};

const createFavoriteTitle = (text) => {
  const favoriteTitle = createElementWithClassName("p", "mypage__favorite-title");
  const maxLength = 100;
  let titleStr = "";
  titleStr = text.length > maxLength ? text.substr(0, maxLength) + "..." : text;
  favoriteTitle.textContent = titleStr;
  return favoriteTitle;
}

const createFavoriteThumbnail = (imgData) => {
  const favoriteThumbnailWrapper = createElementWithClassName("div", "mypage__favorite-img-wrapper");
  const favoriteThumbnail = document.createElement("img");
  favoriteThumbnail.src = imgData || "./img/no-image.jpeg";
  favoriteThumbnailWrapper.appendChild(favoriteThumbnail);
  return favoriteThumbnailWrapper;
};

const createReleaseButton = () => {
  const releaseButton = createElementWithClassName("button", "mypage__favorite-button");
  const starIcon = document.createElement("img")
  releaseButton.classList.add("js-favorite-release-button");
  starIcon.src = "./img/star-icon--disabled.svg";
  releaseButton.textContent = "お気に入りから解除する";
  releaseButton.appendChild(starIcon);
  return releaseButton;
};

const removeClickedArticles = (favoriteArticles, target) => {
  const articleId = target.closest("li").id;
  return favoriteArticles.filter(article => !article[articleId]);
}

const isEmptyFavoriteArticles = (favoriteArticles) => Object.keys(favoriteArticles).length === 0;

const changeFavoriteArticlesInLocalStorage = (target) => {
  const favoriteArticles = JSON.parse(localStorage.getItem("favoriteArticles"));
  const filteredFavoriteArticles = removeClickedArticles(favoriteArticles[userToken], target);

  if (filteredFavoriteArticles.length === 0) {
    delete favoriteArticles[userToken];
  } else {
    favoriteArticles[userToken] = filteredFavoriteArticles;
  }

  if (isEmptyFavoriteArticles(favoriteArticles)) {
    localStorage.removeItem("favoriteArticles");
    return;
  }

  localStorage.setItem("favoriteArticles", JSON.stringify(favoriteArticles));
};

const addEventListenerOfFavoriteReleaseButton = () => {
  const releaseButtons = [...document.querySelectorAll(".js-favorite-release-button")];
  releaseButtons.forEach((button) => {
    button.addEventListener("click", (event) => {
      event.preventDefault();
      changeFavoriteArticlesInLocalStorage(event.target);
      event.target.closest("li").remove();
      const favoriteArticles = [...document.querySelectorAll(".mypage__favorite-item")];
      favoriteArticles.length === 0 && renderMessageOfNoFavoriteArticle();
    });
  });
};

const renderMessageOfNoFavoriteArticle = () => {
  const noFavoriteArticle = createElementWithClassName("p", "no-favorite");
  noFavoriteArticle.textContent = "お気に入りに登録されている記事はありません";
  favoriteWrapper.append(noFavoriteArticle);
}

const favoriteArticleListHandler = async () => {
  favoriteWrapper.appendChild(createLoading());
  try {
    return await getFavoriteArticlesDataOfLoginUser();
  } catch (error) {
    console.error(error);
    favoriteWrapper.appendChild(createErrorMessage(error));
  } finally {
    removeLoading();
  }
}

const init = async () => {
  const favoriteArticlesData = await favoriteArticleListHandler();
  if (favoriteArticlesData.length > 0) {
    renderFavoriteList(favoriteArticlesData);
    addEventListenerOfFavoriteReleaseButton();
  } else {
    renderMessageOfNoFavoriteArticle();
  }
};

init();
