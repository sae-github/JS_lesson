const slideList = document.getElementById("js-slid-list");
const slideWrapper = document.getElementById("js-slide-wrapper");

const createElementWithClassName = (type, className) => {
  const element = document.createElement(type);
  element.className = className;
  return element;
}

const createLoading = () => {
  const loading = createElementWithClassName("img", "loading");
  loading.id = "js-loading";
  loading.src = "./loading-circle.gif";
  return loading;
}

const removeLoading = () => document.getElementById("js-loading").remove();

const createErrorMessage = (error) => {
  const errorMessage = createElementWithClassName("p", "error-message");
  errorMessage.textContent = error;
  return errorMessage;
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
  slideWrapper.appendChild(createLoading());
  try {
    return await getSlideImageData();
  } catch (e) {
    slideWrapper.appendChild(createErrorMessage(e));
  } finally {
    removeLoading();
  }
}

const init = async () => {
  const imageData = await tryGetSlideImageData();
  if (imageData) {
    initSlideItem(imageData);
    initArrowButtons();
  }
}

const initSlideItem = (imageSrc) => {
  for (let i = 0; i < imageSrc.length; i++) {
    const createdSlideItem = createSlideItem(imageSrc[i]);
    //初期設定として 最初の要素にis-displayingクラスを付与
    i === 0 && createdSlideItem.classList.add("is-displaying");
    slideList.appendChild(createdSlideItem);
  }
}

const initArrowButtons = () => {
  const createdArrowButtons = createArrowButtons();
  slideWrapper.appendChild(createdArrowButtons);
  setClickEventInArrowButton();
}

const createSlideItem = ({ image }) => {
  const slideItem = createElementWithClassName("li", "slide-item");
  const slideImage = createElementWithClassName("img", "slide-img");
  slideImage.src = image;
  slideItem.appendChild(slideImage);
  return slideItem;
}


const createArrowButtons = () => {
  const arrowBtnWrapper = createElementWithClassName("div", "arrow-btn__wrapper");
  const arrowDirections = ["prev", "next"];
  arrowDirections.forEach((arrowDirection) => {
    const button = createElementWithClassName("button", `arrow-btn --${arrowDirection}`);
    button.id = `js-arrow-${arrowDirection}-btn`;
    arrowBtnWrapper.appendChild(button).appendChild(document.createElement("span"));
  });
  return arrowBtnWrapper;
}

const setClickEventInArrowButton = () => {
  const arrowButtons = document.querySelectorAll(".arrow-btn");
  arrowButtons.forEach(button => {
    button.addEventListener("click", (e) => {
      if (e.currentTarget.id === "js-arrow-next-btn") {
        switchImage("nextElementSibling");
      } else {
        switchImage("previousElementSibling");
      }
    });
  });
}

const switchImage = (direction) => {
  const displayingItem = document.querySelector(".is-displaying");
  const targetElement = displayingItem[direction];
  if (targetElement) {
    displayingItem.classList.remove("is-displaying");
    targetElement.classList.add("is-displaying");
  }
}


init();
