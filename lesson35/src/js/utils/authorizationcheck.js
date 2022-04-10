const findAuthorizationUser = async () => {
  try {
    const response = await fetch("https://mocki.io/v1/f6c5a4ee-1398-4e1b-9da5-4c4752f9c10b");
    // false用
    // const response = await fetch("https://mocki.io/v1/b896bb0b-3cdd-4851-acca-470dfe84de00");
    if (!response.ok) {
      console.error(`${response.status}:${response.statusText}`);
      return;
    }
    const { data } = await response.json();
    return data;
  } catch (err) {
    console.error(err);
  }
}

const setLoginUserToLocalStorage = (userData, userToken) => {
  const setUserData = {
    username: userData.userName,
    password: userData.password,
    email: userData.email,
    token: userToken
  }
  localStorage.setItem("morikenjuku", JSON.stringify({ [userToken]: setUserData }));
}

const init = async () => {
  const userData = await findAuthorizationUser();
  if (userData?.isAuthorization) {
    const userToken = userData.id;
    setLoginUserToLocalStorage(userData, userToken);
    localStorage.setItem("token", userToken);
    window.location.href = "loginuserpage.html";
  } else {
    window.location.href = "notloginuserpage.html";
  }
}

init();
