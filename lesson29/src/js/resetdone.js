
const checkUrlParams = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const token = localStorage.getItem("token");
  if (token && urlParams.get("token") === token) {
    return;
  }
  window.location.href = "./notauthorize.html";
  localStorage.removeItem("token");
}
checkUrlParams();

