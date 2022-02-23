const checkUrlParams = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const token = localStorage.getItem("registerDoneToken");
  if (token && urlParams.get("token") === token) {
    return;
  }
  window.location.href = "../notauthorize.html";
}
checkUrlParams();
localStorage.removeItem("registerDoneToken");
