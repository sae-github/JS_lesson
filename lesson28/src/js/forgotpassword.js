const email = document.getElementById("email");
const confirmEmail = document.getElementById("confirmEmail");
const submitButton = document.getElementById("js-submit-button");

const constraint = {
  email: {
    validation: () => {
      const reg = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+\.[A-Za-z]+(\.[A-Za-z]+?)?$/g;
      return isInvalidRegex(reg, email.value);
    },
    invalidMessage: "メールアドレスの形式になっていません"
  },
  confirmEmail: {
    validation: () => {
      const confirmTrimmedValue = confirmEmail.value.trim();
      const emailTrimmedValue = email.value.trim();
      return confirmTrimmedValue !== emailTrimmedValue;
    },
    invalidMessage: "入力されたメールアドレスが一致しません"
  }
};

const isBlankInInput = (value) => value.trim() === "";

const isInvalidRegex = (reg, value) => reg.test(value) ? false : true;

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

const toggleDisableSubmitButton = () => {
  const result = Object.keys(constraint).every((key) => {
    const fieldElement = document.getElementById(key).value;
    return isBlankInInput(fieldElement) || constraint[key].validation() ? false : true;
  });
  submitButton.disabled = result ? false : true;
};

email.addEventListener("blur", isValidField);
email.addEventListener("focus", resetInputField);
confirmEmail.addEventListener("blur", isValidField);
confirmEmail.addEventListener("focus", resetInputField);

submitButton.addEventListener("click", (e) => {
  const path = "../register/password.html";
  const user = localStorage.getItem("username");
  const token = "482r22fafah";
  window.location.href = `${path}?user=${user}&token=${token}`;
  e.preventDefault();
});
