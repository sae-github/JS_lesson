const checkUrlParams = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const token = localStorage.getItem("updatePasswordToken");
  if (urlParams.get("token") === token) {
    window.location.href = "../register/password-done.html";
  } else {
    window.location.href = "../notauthorize.html";
  }
}

window.location.search && checkUrlParams();
setTimeout(() => window.location.href = "../login.html", 3000);
