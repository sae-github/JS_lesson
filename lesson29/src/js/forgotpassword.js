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

emailField.addEventListener("blur", emailValidation);
emailField.addEventListener("focus", resetInputField);

submitButton.addEventListener("click", (e) => {
  e.preventDefault();
  if(localStorage.getItem("morikenjuku")) {
    const path = "../register/password.html";
    localStorage.setItem("resetPasswordToken","482r22fafah");
    window.location.href = `${path}?token=482r22fafah`;
  } else {
    window.location.href = "../notregistereduser.html";
  }
});
