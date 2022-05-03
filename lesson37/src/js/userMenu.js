const headerUserMenu = document.getElementById("js-header-user-menu");

headerUserMenu.addEventListener("click", (e) => {
  e.currentTarget.classList.toggle("is-active");
});
