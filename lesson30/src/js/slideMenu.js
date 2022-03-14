const body = document.body;
const overLay = document.getElementById("js-overlay");
const slideMenu = document.getElementById("js-global-menu");
const toggleButtonInSlideMenu = document.getElementById("js-slide-open-button");

const toggleSlideMenu = () => {
  slideMenu.toggleAttribute("aria-hidden");
  body.classList.toggle("slideMenu-open");
}

toggleButtonInSlideMenu.addEventListener("click", toggleSlideMenu);
overLay.addEventListener("click", toggleSlideMenu);
