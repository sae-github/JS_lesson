const body = document.body;
const overLay = document.getElementById("js-overlay");
const slideMenu = document.getElementById("js-global-menu");
const toggleButtonInSlideMenu = document.getElementById("js-slide-open-button");

const openSlideMenu = () => {
  slideMenu.setAttribute("aria-hidden", false);
  body.classList.add("slideMenu-open");
}

const CloseSlideMenu = () => {
  slideMenu.setAttribute("aria-hidden", true);
  body.classList.remove("slideMenu-open");
}

const isOpenSlideMenu = () => {
  return body.classList.contains("slideMenu-open")
}

const toggleSlideMenu = () => isOpenSlideMenu() ? CloseSlideMenu() : openSlideMenu();

toggleButtonInSlideMenu.addEventListener("click", toggleSlideMenu);
overLay.addEventListener("click", CloseSlideMenu);
