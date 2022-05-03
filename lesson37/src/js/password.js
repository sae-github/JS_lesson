import { Chance } from "chance";
import { toggleDisplayPasswordField } from "./modules/toggleDisplayPasswordField"

const passwordButtons = [...document.querySelectorAll(".js-password-icon")];
const submitButton = document.getElementById("js-submit-button");
const passwordField = document.getElementById("password");
const confirmPasswordField = document.getElementById("confirmPassword");
const chance = new Chance()

const constraint = {
  password: {
    validation: () => {
      const reg = /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])[a-zA-Z0-9]{8,}$/g;
      return isInvalidRegex(reg, passwordField.value);
    },
    invalidMessage: "8文字以上の大小の英数字を交ぜたものにしてください。"
  },
  confirmPassword: {
    validation: () => {
      const confirmTrimmedValue = confirmPasswordField.value.trim();
      const passwordTrimmedValue = passwordField.value.trim();
      return confirmTrimmedValue !== passwordTrimmedValue
    },
    invalidMessage: "入力されたパスワードが一致してません"
  }
};

const isBlankInInput = (value) => value.trim() === "";

const isInvalidRegex = (reg, value) => !reg.test(value);

const addValidClassName = (target) => {
  target.parentElement.classList.add("valid");
};

const isValidField = (e) => {
  const field = e.target;
  if (isBlankInInput(field.value)) {
    addInvalidMessage(field, "未入力です");
    submitButton.disabled = true;
    return;
  }
  if (constraint[field.id].validation()) {
    addInvalidMessage(field, constraint[field.id].invalidMessage);
    submitButton.disabled = true;
    return;
  }

  addValidClassName(field);
  toggleDisableSubmitButton();
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

const toggleDisableSubmitButton = () => {
  const isInvalidFields = Object.keys(constraint).some((key) => {
    const inputValue = document.getElementById(key).value;
    return isBlankInInput(inputValue) || constraint[key].validation();
  });
  submitButton.disabled = isInvalidFields;
};

const checkUrlParams = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const token = localStorage.getItem("resetPasswordToken");
  if (token && urlParams.get("token") === token) {
    return;
  }
  window.location.href = "../notauthorize.html";
}

checkUrlParams();

passwordButtons.forEach(button => {
  button.addEventListener("click", (event) => toggleDisplayPasswordField(event.target));
});
passwordField.addEventListener("blur", isValidField);
passwordField.addEventListener("focus", resetInputField);
confirmPasswordField.addEventListener("blur", isValidField);
confirmPasswordField.addEventListener("focus", resetInputField);

const changeUserPassword = () => {
  const usersData = JSON.parse(localStorage.getItem("morikenjuku"));
  const token = localStorage.getItem("resetPasswordToken");
  usersData[token].password = passwordField.value;
  localStorage.setItem("morikenjuku", JSON.stringify(usersData));
}

submitButton.addEventListener("click", (e) => {
  e.preventDefault();
  changeUserPassword();
  localStorage.removeItem("resetPasswordToken");
  const forgotPasswordDoneToken = chance.apple_token();
  localStorage.setItem("forgotPasswordDoneToken", forgotPasswordDoneToken);
  const path = "./password-done.html";
  window.location.href = `${path}?token=${forgotPasswordDoneToken}`;
});
