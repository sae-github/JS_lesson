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

const getSlideImgData = async () => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(getJsonOrError("https://myjson.dit.upm.es/api/bins/gzcn")), 3000);
  })
}

const tryGetSlideImgData = async () => {
  slideWrapper.appendChild(createLoading());
  try {
    const slideImgData = await getSlideImgData();
    if (slideImgData.length === 0) {
      throw new Error("No data...");
    }
    return slideImgData;
  } catch (e) {
    slideWrapper.appendChild(createErrorMessage(e));
  } finally {
    removeLoading();
  }
}

const init = async () => {
  const imgData = await tryGetSlideImgData();
  if (imgData) {
    initSlideItem(imgData);
    initArrowButtons();
    initIndicator(imgData.length);
    slideWrapper.appendChild(createCounterOfSlide(imgData));
  }
}

init();

const initSlideItem = (imgSources) => {
  for (let i = 0; i < imgSources.length; i++) {
    const createdSlideItem = createSlideItem(imgSources[i]);
    /**
     * Set the is-displaying class to the first element by default 
     */
    i === 0 && createdSlideItem.classList.add("is-displaying");
    slideList.appendChild(createdSlideItem);
  }
}

const initArrowButtons = () => {
  const createdArrowButtons = createArrowButtons();
  slideWrapper.appendChild(createdArrowButtons);
  setClickEventInArrowButton();
}

const initIndicator = (data) => {
  slideWrapper.appendChild(createIndicator(data));
  setClickEventInIndicator();
}

const createSlideItem = ({ image }) => {
  const slideItem = createElementWithClassName("li", "slide-item");
  const slideImg = createElementWithClassName("img", "slide-img");
  slideImg.src = image;
  slideItem.appendChild(slideImg);
  return slideItem;
}

const createArrowButtons = () => {
  const arrowBtnWrapper = createElementWithClassName("div", "arrowBtn-wrapper");
  const arrowDirections = ["previous", "next"];
  arrowDirections.forEach((arrowDirection) => {
    const button = createElementWithClassName("button", `arrowBtn --${arrowDirection}`);
    button.id = `js-${arrowDirection}Btn`;
    button.value = arrowDirection;
    /**
     * Set previous attribute to disabled by default.
     */
    button.value === "previous" && button.setAttribute("disabled", true);
    arrowBtnWrapper.appendChild(button).appendChild(document.createElement("span"));
  });
  return arrowBtnWrapper;
}

const createIndicator = (imageLength) => {
  const ul = createElementWithClassName("ul", "indicator-list")
  for (let i = 0; i < imageLength; i++) {
    const li = createElementWithClassName("li", "indicator-item");
    li.setAttribute("data-num", i);
    /**
    * Set the is-selected class to the first element by default 
    */
    i === 0 && li.classList.add("is-selected");
    ul.appendChild(li);
  }
  return ul;
}

const createCounterOfSlide = (data) => {
  const counterWrapper = createElementWithClassName("div", "counter");
  const orderOfDisplayedItem = createElementWithClassName("span", "current-number");
  const totalSlideItem = createElementWithClassName("span", "total-number");
  totalSlideItem.textContent = data.length;
  /**
   * Add 1 to the currently displayed index and display the count.
   */
  orderOfDisplayedItem.textContent = findIndexOfDisplayedItem() + 1;
  counterWrapper.appendChild(orderOfDisplayedItem).insertAdjacentHTML("afterend", "/");
  counterWrapper.appendChild(totalSlideItem);
  return counterWrapper;
}

const findIndexOfDisplayedItem = () => {
  const slideItemArray = [...document.querySelectorAll(".slide-item")];
  return slideItemArray.findIndex(el => el.classList.contains("is-displaying"));
}

const findIndexOfSelectedIndicator = () => {
  const indicators = [...document.querySelectorAll(".indicator-item")];
  return indicators.findIndex((el) => el.classList.contains("is-selected"));
}

const toggleTheDisabled = () => {
  const lastSlideItem = slideList.lastElementChild;
  const firstSlideItem = slideList.firstElementChild;
  const displayingEl = document.querySelector(".is-displaying");
  const disabledEl = document.querySelector("[disabled]");
  disabledEl && disabledEl.removeAttribute("disabled")
  if (displayingEl === lastSlideItem) {
    document.getElementById("js-nextBtn").setAttribute("disabled", true);
  }
  if (displayingEl === firstSlideItem) {
    document.getElementById("js-previousBtn").setAttribute("disabled", true);
  }
}

const updateOfCounter = () => {
  const displayedItemIndex = findIndexOfDisplayedItem();
  document.querySelector(".current-number").textContent = displayedItemIndex + 1;
}

const switchIndicator = (target) => {
  const selectedIndicator = document.querySelector(".is-selected");
  const indicators = [...document.querySelectorAll(".indicator-item")];
  selectedIndicator.classList.remove("is-selected");
  indicators[target].classList.add("is-selected");
}

const switchSlideImg = (target) => {
  const displayedSlideItem = document.querySelector(".is-displaying");
  displayedSlideItem.classList.remove("is-displaying");
  const slideItems = [...document.querySelectorAll(".slide-item")];
  slideItems[target].classList.add("is-displaying");
}

const setClickEventInIndicator = () => {
  const indicator = document.querySelectorAll(".indicator-item");
  indicator.forEach(target => {
    target.addEventListener("click", (e) => {
      switchIndicator(e.target.dataset.num);
      switchSlideImg(findIndexOfSelectedIndicator());
      updateOfCounter();
      toggleTheDisabled();
    });
  });
}

const setClickEventInArrowButton = () => {
  const arrowButtons = document.querySelectorAll(".arrowBtn");
  arrowButtons.forEach(button => {
    button.addEventListener("click", (e) => {
      if (e.currentTarget.value === "next") {
        switchSlideImg(findIndexOfDisplayedItem() + 1);
      } else {
        switchSlideImg(findIndexOfDisplayedItem() - 1);
      }
      updateOfCounter();
      toggleTheDisabled();
      switchIndicator(findIndexOfDisplayedItem());
    });
  });
}



