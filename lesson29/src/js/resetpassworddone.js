const checkUrlParams = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const token = localStorage.getItem("token");
  if (urlParams.get("token") === token) {
    window.location.href = "./resetingpassword.html";
  }
}
window.location.search && checkUrlParams();

