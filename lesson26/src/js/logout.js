const logoutButton = document.getElementById("js-logout-button");


logoutButton.addEventListener("click", () => {
  storage.removeItem("token");
  window.location.href = "./login.html";
});
