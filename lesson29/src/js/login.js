const userName = document.getElementById("username");
const password = document.getElementById("password");
const loginButton = document.getElementById("js-login-button");
const passwordButton = document.getElementById("js-password-icon");

if (localStorage.getItem("token")) window.location.href = "./index.html";

const constraint = {
  username: {
    validation: () => isBlankInInput(userName.value),
    invalidMessage: "未入力です"
  },
  password: {
    validation: () => {
      const reg = /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])[a-zA-Z0-9]{8,}$/g;
      return isInvalidRegex(reg, password.value);
    },
    invalidMessage: "8文字以上の大小の英数字を交ぜたものにしてください。"
  }
};

const isBlankInInput = (value) => value.trim() === "";

const isInvalidRegex = (reg, value) => !reg.test(value);

const addValidClassName = (target) => {
  target.parentElement.classList.add("valid");
};

const isValidField = (e) => {
  const field = e.target;
  if (constraint[field.id].validation()) {
    addInvalidMessage(field, constraint[field.id].invalidMessage);
    loginButton.disabled = true;
    return;
  }

  addValidClassName(field);
  toggleDisableLoginButton();
};

const toggleDisableLoginButton = () => {
  const isInvalidFields = Object.keys(constraint).some((key) => {
    return constraint[key].validation();
  });
  loginButton.disabled = isInvalidFields;
};

const addInvalidMessage = (target, message) => {
  const parent = target.parentElement;
  parent.classList.add("invalid");
  const el = document.createElement("span");
  el.classList.add("invalid-message");
  el.textContent = message;
  parent.appendChild(el);
};

const resetInputField = (e) => {
  const className = ["invalid", "valid"];
  e.target.parentElement.classList.remove(...className);
  const errorMessage = e.target.parentElement.querySelector(".invalid-message");
  errorMessage && errorMessage.remove();
};

const togglePasswordButton = (e) => {
  const target = e.target;
  if (target.classList.contains("is-hide")) {
    password.type = "text";
    target.classList.remove("is-hide");
    target.classList.add("is-show");
  } else {
    password.type = "password";
    target.classList.remove("is-show");
    target.classList.add("is-hide");
  }
}

passwordButton.addEventListener("click", togglePasswordButton);
password.addEventListener("blur", isValidField);
userName.addEventListener("blur", isValidField);
userName.addEventListener("focus", resetInputField);
password.addEventListener("focus", resetInputField);

loginButton.addEventListener("click", (e) => {
  e.preventDefault();
  const inputValues = {
    username: userName.value,
    password: password.value
  }
  init(inputValues);
});

const isMatchUsernameOrEmail = (value, data) => {
  return value === data.username || value === data.email;
}

const isMatchPassword = (value, data) => value === data.password;

const checkUserData = (inputData) => {
  return new Promise((resolve, reject) => {
    const { username, password } = inputData;
    const userData = JSON.parse(localStorage.getItem("morikenjuku"));
    if (isMatchUsernameOrEmail(username, userData) && isMatchPassword(password, userData)) {
      resolve({ token: "far0fja*ff]afaawfqrlzkfq@aq9283af", ok: true, code: 200 });
    } else {
      reject({ ok: false, code: 401 });
    }
  })
}

const getToken = async (inputData) => {
  try {
    const response = await checkUserData(inputData);
    return response.token;
  } catch (e) {
    window.location.href = "./notauthorize.html";
  }
}

const init = async (inputData) => {
  const token = await getToken(inputData);
  if (token) {
    localStorage.setItem("token", token);
    window.location.href = "./index.html";
  }
}
