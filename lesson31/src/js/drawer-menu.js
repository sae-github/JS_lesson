const body = document.body;
const drawerMenu = document.getElementById("js-drawer-menu");
const toggleButtonInDrawerMenu = document.getElementById("js-drawer-open-button");

const toggleDrawerMenu = () => {
  drawerMenu.toggleAttribute("aria-hidden");
  body.classList.toggle("drawer-menu-open");
}

const createOverLay = () => {
  const overLay = document.createElement("div");
  overLay.id = "js-drawer-overlay";
  overLay.classList.add("drawer-overlay");
  return overLay;
}

const renderOverLay = () => {
  const overLay = createOverLay();
  overLay.addEventListener("click", toggleDrawerMenu);
  body.appendChild(overLay);
}

const switchDrawerDirect = (option) => {
  switch (option) {
    case "right":
      {
        drawerMenu.classList.add("drawer--right");
        break;
      }
    default:
      drawerMenu.classList.add("drawer--left");
  }
}

const settingDrawerMenu = (options = {}) => {
  const defaultOption = { direct: "left", overLay: true, duration: 0.3 };
  const drawerOptions = {
    ...defaultOption,
    ...options
  }
  drawerOptions.overLay && renderOverLay();
  switchDrawerDirect(drawerOptions.direct);
  drawerMenu.style.transitionDuration = `${drawerOptions.duration}s`;
}

settingDrawerMenu({ direct: "right" });
toggleButtonInDrawerMenu.addEventListener("click", toggleDrawerMenu);
