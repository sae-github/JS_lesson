const archiveWrapper = document.getElementById("js-archive-wrapper");
let defaultArticleList;

const createElementWithClassName = (type, name) => {
  const element = document.createElement(type);
  element.className = name;
  return element;
}

const renderLoading = (parent) => {
  const loading = createElementWithClassName("div", "loading");
  const img = document.createElement("img");
  loading.id = "js-loading";
  img.src = "./img/loading-circle.gif";
  parent.appendChild(loading).appendChild(img);
}

const removeLoading = () => document.getElementById("js-loading").remove();

const fetchErrorHandling = async (response) => {
  if (response.ok) {
    return await response.json();
  } else {
    throw new Error("サーバーエラーが発生しました");
  }
}

const renderErrorMessage = (error, parent) => {
  const errorMessage = createElementWithClassName("p", "error-message");
  errorMessage.textContent = error;
  parent.appendChild(errorMessage);
}

const getJsonOrError = async (url) => {
  const response = await fetch(url);
  const json = await fetchErrorHandling(response);
  return json;
}

const getData = async (parent, resource) => {
  renderLoading(parent);
  try {
    return await getJsonOrError(resource);
  } catch (e) {
    renderErrorMessage(e, parent);
  } finally {
    removeLoading();
  }
}

const renderCategorySelect = (data) => {
  const selectWrapper = createElementWithClassName("div", "archive__select");
  const select = document.createElement("select");
  select.addEventListener("change", (e) => renderSelectedCategoryList(e.target, data));
  archiveWrapper
    .appendChild(selectWrapper)
    .appendChild(select)
    .appendChild(createSelectOptions(data));
}

const createSelectOptions = (data) => {
  const frag = document.createDocumentFragment();
  const defaultOption = document.createElement("option");
  defaultOption.textContent = "未選択";
  defaultOption.value = "default";
  frag.appendChild(defaultOption);
  data.forEach(({ category }) => {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    frag.appendChild(option);
  });
  return frag;
}

const renderSelectedCategoryList = (target, data) => {
  const archiveList = document.getElementById("js-archive-list");
  if (target.value === "default") {
    archiveList.replaceWith(defaultArticleList.cloneNode(true));
    return;
  }
  archiveList.textContent = "";
  const selectedCategoryData = data.find(({ category }) => category === target.value);
  archiveList.appendChild(createArticleItem(selectedCategoryData));
}

const renderArchiveList = (data) => {
  const archiveList = createElementWithClassName("ul", "archive__list");
  const frag = document.createDocumentFragment();
  archiveList.id = "js-archive-list";
  data.forEach((d) => frag.appendChild(createArticleItem(d)));
  archiveWrapper.appendChild(archiveList).appendChild(frag);
}

const createArticleItem = (data) => {
  const frag = document.createDocumentFragment();
  data.article.forEach((article) => {
    const archiveItem = createElementWithClassName("li", "archive__item");
    const archiveLink = createElementWithClassName("a", "archive__item-link");
    const archiveWrapper = createElementWithClassName("div", "archive__item-text");
    const title = createElementWithClassName("p", "archive__item-title");
    const date = createElementWithClassName("p", "archive__item-date");
    const label = createElementWithClassName("span", "archive__item-label");
    const time = document.createElement("time");
    time.textContent = article.date;
    label.textContent = data.category;
    title.textContent = article.title;

    archiveWrapper.appendChild(label).after(title);
    archiveWrapper.appendChild(date).appendChild(time);
    archiveLink.appendChild(createThumbnail(article));
    frag
      .appendChild(archiveItem)
      .appendChild(archiveLink)
      .appendChild(archiveWrapper)
  });
  return frag;
}

const createThumbnail = ({ thumbnail }) => {
  const thumbnailWrapper = createElementWithClassName("div", "archive__item-thumbnail");
  const img = document.createElement("img");
  img.src = thumbnail;
  thumbnail === "" && (img.src = "./img/no-image.jpeg");
  thumbnailWrapper.appendChild(img);
  return thumbnailWrapper;
}

const init = async () => {
  const url = "https://mocki.io/v1/4edaab77-5752-40a8-9a4e-4715845403c8";
  const responseData = await getData(archiveWrapper, url);
  if (responseData) {
    renderCategorySelect(responseData);
    renderArchiveList(responseData);
    defaultArticleList = document.getElementById("js-archive-list").cloneNode(true);
  }
}

init();
