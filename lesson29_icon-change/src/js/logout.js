const logout = document.getElementById("js-logout");

logout.addEventListener("click", (e) => {
  e.preventDefault();
  localStorage.removeItem("token");
  window.location.href = "./login.html";
});
