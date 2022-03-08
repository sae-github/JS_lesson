const checkUserIcon = () => {
  const usersData = JSON.parse(localStorage.getItem("morikenjuku"));
  const token = localStorage.getItem("token");
  const loginUserIcon = usersData[token].icon;
  return loginUserIcon;
}

const iconSrc = checkUserIcon();
iconSrc && (document.getElementById('js-profile-icon').src = iconSrc);
