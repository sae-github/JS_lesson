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
  const result = await tryGetSlideImageData();
  if (result) {
    createSlideItem(result);
    createArrowButtons();
  }
}

const createSlideItem = (imageData) => {
  for (let i = 0; i < imageData.length; i++) {
    const slideItem = createElementWithClassName("li", "slide-item");
    const slideImage = createElementWithClassName("img", "slide-img");
    slideImage.src = imageData[i].image;
    // 初期設定として 最初の要素にis-displayingクラスを付与
    if (i === 0) slideItem.classList.add("is-displaying");
    slideItem.appendChild(slideImage);
    slideList.appendChild(slideItem);
  }
}

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
  slideWrapper.appendChild(arrowBtnWrapper)
  setClickEventInArrowButton();
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
