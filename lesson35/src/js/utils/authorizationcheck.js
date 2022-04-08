import { Chance } from "chance";
const chance = new Chance();

const findAuthorizationUser = async () => {
  try {
    const response = await fetch("https://mocki.io/v1/cec0626b-9b87-4101-9705-de38966b525c");
    // false用
    // const response = await fetch("https://mocki.io/v1/d6a65c8c-130f-40d4-a091-ba364970f697");
    const { data } = await response.json();
    return data.find((d) => d.isAuthorization);
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
  const loginUser = await findAuthorizationUser()
  if (loginUser) {
    const userToken = chance.apple_token();
    setLoginUserToLocalStorage(loginUser, userToken);
    localStorage.setItem("token", userToken);
    window.location.href = "loginuserpage.html";
  }
}

init();
