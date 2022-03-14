const emailField = document.getElementById("email");
const submitButton = document.getElementById("js-submit-button");

const isBlankInInput = (value) => value.trim() === "";

const isInvalidRegex = (reg, value) => !reg.test(value);

const addValidClassName = (target) => {
  target.parentElement.classList.add("valid");
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

const emailValidation = (e) => {
  const field = e.target;
  const reg = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+\.[A-Za-z]+(\.[A-Za-z]+?)?$/g;
  if (isBlankInInput(field.value)) {
    addInvalidMessage(field, "未入力です");
    submitButton.disabled = true;
    return;
  }
  if (isInvalidRegex(reg, field.value)) {
    addInvalidMessage(field, "メールアドレスの形式になっていません");
    submitButton.disabled = true;
    return;
  }
  addValidClassName(field);
  submitButton.disabled = false;
};

const findUserEmailMatch = (usersData) => {
  return Object.values(usersData).find(({ email }) => email === emailField.value);
}

emailField.addEventListener("blur", emailValidation);
emailField.addEventListener("focus", resetInputField);

submitButton.addEventListener("click", (e) => {
  e.preventDefault();
  const usersData = JSON.parse(localStorage.getItem("morikenjuku"));
  const matchedUserData = findUserEmailMatch(usersData);
  if (matchedUserData) {
    const userToken = matchedUserData.token;
    const path = "../register/password.html";
    localStorage.setItem("resetPasswordToken", userToken);
    window.location.href = `${path}?token=${userToken}`;
  } else {
    window.location.href = "../notregistereduser.html";
  }
});
