const slideList = document.getElementById("js-slid-list");
const slideWrapper = document.getElementById("js-slide-wrapper");

const createElementWithClassName = (type, className) => {
  const element = document.createElement(type);
  element.className = className;
  return element;
}

const addLoading = (parent) => {
  const loading = createElementWithClassName("img", "loading");
  loading.id = "js-loading";
  loading.src = "./loading-circle.gif";
  parent.appendChild(loading);
}

const removeLoading = () => document.getElementById("js-loading").remove();

const addErrorMessage = (error, parent) => {
  const errorMessage = createElementWithClassName("p", "error-message");
  errorMessage.textContent = error;
  parent.appendChild(errorMessage);
}

const fetchErrorHandling = async (response) => {
  if (response.ok) {
    return await response.json();
  } else {
    throw new Error("サーバーエラーが発生しました");
  }
}

const getJsonOrError = async (url) => {
  const response = await fetch(url);
  const json = await fetchErrorHandling(response);
  return json;
}

const getSlideImageData = async () => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(getJsonOrError("https://myjson.dit.upm.es/api/bins/gzcn")), 3000);
  })
}

const tryGetSlideImageData = async () => {
  addLoading(slideWrapper);
  try {
    return await getSlideImageData();
  } catch (e) {
    addErrorMessage(e, slideWrapper);
  } finally {
    removeLoading();
  }
}

const init = async () => {
  const imageData = await tryGetSlideImageData();
  if(imageData) {
    initSlideItem(imageData); 
    initArrowButtons();
  }
}

const initSlideItem = (imageSrc) => {
  for (let i = 0; i < imageSrc.length; i++) {
    const createdSlideItem = createSlideItem(imageSrc[i]);
    //初期設定として 最初の要素にis-displayingクラスを付与
    i === 0 && createdSlideItem.classList.add("is-displaying");
    addElement(createdSlideItem, slideList);
  }
}

const initArrowButtons = () => {
  const createdArrowButtons = createArrowButtons();
  addElement(createdArrowButtons, slideWrapper);
  setClickEventInArrowButton();
}

const createSlideItem = ({ image }) => {
  const slideItem = createElementWithClassName("li", "slide-item");
  const slideImage = createElementWithClassName("img", "slide-img");
  slideImage.src = image;
  slideItem.appendChild(slideImage);
  return slideItem;
}

const addElement = (element, parent) => parent.appendChild(element);

const createArrowButtons = () => {
  const arrowBtnWrapper = createElementWithClassName("div", "arrow-btn__wrapper");
  const prevButton = createElementWithClassName("button", "arrow-btn --prev");
  const nextButton = createElementWithClassName("button", "arrow-btn --next");
  prevButton.appendChild(document.createElement("span"));
  nextButton.appendChild(document.createElement("span"));
  prevButton.id = "js-arrow-left-btn";
  nextButton.id = "js-arrow-right-btn";
  arrowBtnWrapper.appendChild(prevButton);
  arrowBtnWrapper.appendChild(nextButton);
  return arrowBtnWrapper;
}

const setClickEventInArrowButton = () => {
  const arrowButtons = document.querySelectorAll(".arrow-btn");
  arrowButtons.forEach(button => {
    button.addEventListener("click", (e) => {
      const displayingItem = document.querySelector(".is-displaying");
      if (e.currentTarget.id === "js-arrow-right-btn") {
        clickNextButton(displayingItem);
      } else {
        clickPrevButton(displayingItem);
      }
    });
  });
}

const clickPrevButton = (target) => {
  const targetNextElement = target.previousElementSibling;
  if (targetNextElement) {
    target.classList.remove("is-displaying");
    targetNextElement.classList.add("is-displaying");
  }
}

const clickNextButton = (target) => {
  const targetPrevElement = target.nextElementSibling;
  if (targetPrevElement) {
    target.classList.remove("is-displaying");
    targetPrevElement.classList.add("is-displaying");
  }
}

init();
