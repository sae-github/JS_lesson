const body = document.body;
const overLay = document.getElementById("js-overlay");
const drawerMenu = document.getElementById("js-drawer-menu");
const toggleButtonInDrawerMenu = document.getElementById("js-drawer-open-button");

const toggleDrawerMenu = () => {
  drawerMenu.toggleAttribute("aria-hidden");
  body.classList.toggle("drawer-menu-open");
}

toggleButtonInDrawerMenu.addEventListener("click", toggleDrawerMenu);
overLay.addEventListener("click", toggleDrawerMenu);
