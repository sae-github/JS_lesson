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
    autoPlay.start();
  }
}

init();

/**
 * index of the element being displayed.
 * @type {Number}
 */
let currentIndex = 0;

let autoPlayerId;
const autoPlay = {
  start: function () {
    autoPlayerId = setInterval(() => {
      const slideItems = [...document.querySelectorAll(".slide-item")];
      currentIndex < slideItems.length - 1 ? ++currentIndex : currentIndex = 0;
      playOfSlideshow();
    }, 3000);
  },
  reset: function () {
    clearInterval(autoPlayerId);
    this.start();
  }
}

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
  const orderOfDisplayedItem = createElementWithClassName(
    "span",
    "current-number"
  );
  const totalSlideItem = createElementWithClassName("span", "total-number");
  totalSlideItem.textContent = data.length;
  /**
   * Add 1 to the currently displayed index and display the count.
   */
  orderOfDisplayedItem.textContent = currentIndex + 1;
  counterWrapper
    .appendChild(orderOfDisplayedItem)
    .insertAdjacentHTML("afterend", "/");
  counterWrapper.appendChild(totalSlideItem);
  return counterWrapper;
};

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

const updateOfCounter = (targetIndex) => {
  /**
   * The counter will display the value of index plus one.
   */
  document.querySelector(".current-number").textContent = ++targetIndex;
};

const switchIndicator = (targetIndex) => {
  const selectedIndicator = document.querySelector(".is-selected");
  const indicators = [...document.querySelectorAll(".indicator-item")];
  selectedIndicator.classList.remove("is-selected");
  indicators[targetIndex].classList.add("is-selected");
}

const switchSlideImg = (targetIndex) => {
  const displayedSlideItem = document.querySelector(".is-displaying");
  displayedSlideItem.classList.remove("is-displaying");
  const slideItems = [...document.querySelectorAll(".slide-item")];
  slideItems[targetIndex].classList.add("is-displaying");
}

const playOfSlideshow = () => {
  switchIndicator(currentIndex);
  switchSlideImg(currentIndex);
  updateOfCounter(currentIndex);
  toggleTheDisabled();
}

const setClickEventInIndicator = () => {
  const indicators = document.querySelectorAll(".indicator-item");
  indicators.forEach((indicator) => {
    indicator.addEventListener("click", (e) => {
      autoPlay.reset();
      currentIndex = e.target.dataset.num;
      playOfSlideshow();
    });
  });
};

const setClickEventInArrowButton = () => {
  const arrowButtons = document.querySelectorAll(".arrowBtn");
  arrowButtons.forEach((button) => {
    button.addEventListener("click", (e) => {
      autoPlay.reset();
      e.currentTarget.value === "next" ? ++currentIndex : --currentIndex;
      playOfSlideshow();
    });
  });
};



