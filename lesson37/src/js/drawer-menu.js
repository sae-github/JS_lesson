const body = document.body;
const drawerMenu = document.getElementById("js-drawer-menu");
const toggleButtonInDrawerMenu = document.getElementById("js-drawer-open-button");
const drawerMenuNavigations = [...document.querySelectorAll(".js-drawer-menu-nav-link")];

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

settingDrawerMenu();
toggleButtonInDrawerMenu.addEventListener("click", toggleDrawerMenu);

const fadeInAnimation = (element, duration) => {
  element.animate([{ opacity: 0 }, { opacity: 1 }], duration);
};

fadeInAnimation(body, 300);
body.classList.remove("fade-in");

const transformLoadingAnimation = (element, duration) => {
  return element.animate(
    [
      { transform: "translate(0,-50%)" },
      { transform: "translate(-100%,-50%)" }
    ],
    duration
  );
};

const transitionPageAnimation = (href) => {
  body.classList.add("fade-in", "transition-animation");
  const loading = document.getElementById("js-transition-loading");
  const loadingAnimation = transformLoadingAnimation(loading, 500);
  loadingAnimation.addEventListener(
    "finish",
    () => (window.location.href = href)
  );
};

drawerMenuNavigation.forEach((nav) => {
  nav.addEventListener("click", (event) => {
    event.preventDefault();
    toggleDrawerMenu();
    transitionPageAnimation(event.currentTarget.href);
  });
});
