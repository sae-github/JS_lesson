const checkUrlParams = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const token = localStorage.getItem("forgotPasswordDoneToken");
  if (token && urlParams.get("token") === token) {
    return;
  }
  window.location.href = "../notauthorize.html";
}

checkUrlParams();
localStorage.removeItem("forgotPasswordDoneToken");
