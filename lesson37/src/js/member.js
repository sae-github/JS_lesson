import { Chance } from "chance";
import { toggleDisplayPasswordField } from "./modules/toggleDisplayPasswordField";

const chance = new Chance();
const modalContent = document.getElementById("js-modal-content");
const submitButton = document.getElementById("js-submit-button");
const checkBox = document.querySelector(".js-check-box");
const overLay = document.getElementById("js-overlay");
const closeButton = document.getElementById("js-modal-close");
const rules = document.getElementById("js-rules");
const body = document.querySelector("body");
const userField = document.getElementById("username");
const emailField = document.getElementById("email");
const passwordField = document.getElementById("password");
const passwordButton = document.getElementById("js-password-icon");

const closeModal = () => {
  body.classList.remove("modal-open");
};

const openModal = () => {
  body.classList.add("modal-open");
};

rules.addEventListener("click", openModal);
closeButton.addEventListener("click", closeModal);
overLay.addEventListener("click", closeModal);

const scrollInModalContent = new IntersectionObserver(
  ([entry]) => {
    if (entry.isIntersecting) {
      checkBox.checked = true;
      checkBox.disabled = false;
      toggleDisableSubmitButton();
    }
  },
  { root: modalContent }
);
scrollInModalContent.observe(modalContent.lastElementChild);

const constraint = {
  username: {
    validation: () => {
      const limitNumber = 16;
      return isLimitTextLength(userField.value, limitNumber);
    },
    invalidMessage: "ユーザー名は15文字以下にしてください。"
  },
  email: {
    validation: () => {
      const reg = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+\.[A-Za-z]+(\.[A-Za-z]+?)?$/g;
      return isInvalidRegex(reg, emailField.value);
    },
    invalidMessage: "メールアドレスの形式になっていません"
  },
  password: {
    validation: () => {
      const reg = /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])[a-zA-Z0-9]{8,}$/g;
      return isInvalidRegex(reg, passwordField.value);
    },
    invalidMessage: "8文字以上の大小の英数字を交ぜたものにしてください。"
  }
};

const isBlankInInput = (value) => value.trim() === "";

const isLimitTextLength = (value, limit) => value.length >= limit;

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
    return isBlankInInput(inputValue) || constraint[key].validation() || !checkBox.checked;
  });
  submitButton.disabled = isInvalidFields;
};

const isEmailRegistered = (usersData) => {
  return Object.values(usersData).some(({ email }) => email === emailField.value);
};

passwordButton.addEventListener("click", (event) => toggleDisplayPasswordField(event.target));
passwordField.addEventListener("blur", isValidField);
emailField.addEventListener("blur", isValidField);
userField.addEventListener("blur", isValidField);
checkBox.addEventListener("change", toggleDisableSubmitButton);
userField.addEventListener("focus", resetInputField);
emailField.addEventListener("focus", resetInputField);
passwordField.addEventListener("focus", resetInputField);

submitButton.addEventListener("click", (e) => {
  e.preventDefault();
  let usersData = JSON.parse(localStorage.getItem("morikenjuku"));
  if (usersData && isEmailRegistered(usersData)) {
    emailField.parentElement.classList.remove("valid");
    addInvalidMessage(emailField, "既に登録されているメールアドレスです");
    submitButton.disabled = "true";
    return;
  }
  usersData = usersData ?? {};
  const userToken = chance.apple_token();
  const inputValues = { username: userField.value, password: passwordField.value, email: emailField.value, token: userToken };
  usersData[userToken] = inputValues;
  localStorage.setItem("morikenjuku", JSON.stringify(usersData));

  const path = "./member-done.html";
  const registerDoneToken = chance.apple_token();
  localStorage.setItem("registerDoneToken", registerDoneToken);
  window.location.href = `${path}?token=${registerDoneToken}`;
});
