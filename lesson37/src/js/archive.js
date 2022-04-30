import { createElementWithClassName } from "./modules/createElementWithClassName";
import { loading } from "./modules/loading";

const archiveWrapper = document.getElementById("js-archive-wrapper");

const fetchErrorHandling = async (response) => {
  if (!response.ok) {
    const responseMessage = `${response.status}:${response.statusText}`;
    archiveWrapper.append(createErrorMessage(responseMessage));
    console.error(responseMessage);
    return;
  }
  return await response.json();
}

const createErrorMessage = (error) => {
  const errorMessage = createElementWithClassName("p", "archive-error-message");
  errorMessage.textContent = error;
  return errorMessage;
}

const getJsonOrError = async (url) => {
  const response = await fetch(url);
  const json = await fetchErrorHandling(response);
  return json;
}

const getData = async (parent, resource) => {
  parent.append(loading.create());
  try {
    return await getJsonOrError(resource);
  } catch (error) {
    parent.createErrorMessage(error, parent);
  } finally {
    loading.remove();
  }
}

const renderCategorySelect = (data) => {
  const selectWrapper = createElementWithClassName("div", "archive__select");
  const select = document.createElement("select");
  select.id = "js-category-select";
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

const addEventListenerForCategorySelect = (data) => {
  const archiveList = document.getElementById("js-archive-list");
  const defaultArticleList = archiveList.cloneNode(true);
  const categorySelect = document.getElementById("js-category-select");
  categorySelect.addEventListener("change", (event) => {
    const selectedCategory = event.target.value;
    archiveList.textContent = "";

    if (selectedCategory === "default") {
      archiveList.append(defaultArticleList.cloneNode(true));
      return;
    }
    const selectedCategoryData = data.find(({ category }) => category === selectedCategory);
    archiveList.append(
      selectedCategoryData
        ? createArticleItem(selectedCategoryData)
        : createErrorMessage("選択されたカテゴリーのデータが見つかりません"));
  })
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
    archiveLink.href = `./article.html?id=${article.id}`;

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
  img.src = thumbnail || "./img/no-image.jpeg";
  thumbnailWrapper.appendChild(img);
  return thumbnailWrapper;
}

const init = async () => {
  const url = "https://mocki.io/v1/5cbd84b0-25ea-41be-943f-4876ba864a59";
  const { data } = await getData(archiveWrapper, url);
  if (data) {
    renderCategorySelect(data);
    renderArchiveList(data);
    addEventListenerForCategorySelect(data)
  }
}

init();
