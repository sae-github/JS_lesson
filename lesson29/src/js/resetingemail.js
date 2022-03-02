const emailField = document.getElementById("email");
const confirmEmailField = document.getElementById("confirmEmail");
const changeButton = document.getElementById("js-submit-button");
const passwordButton = document.getElementById("js-password-icon");
const passwordField = document.getElementById("password");

const constraint = {
  email: {
    validation: () => {
      const reg = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+\.[A-Za-z]+(\.[A-Za-z]+?)?$/g;
      return isInvalidRegex(reg, emailField.value);
    },
    invalidMessage: "メールアドレスの形式になっていません"
  },
  confirmEmail: {
    validation: () => {
      const confirmTrimmedValue = confirmEmailField.value.trim();
      const emailTrimmedValue = emailField.value.trim();
      return confirmTrimmedValue !== emailTrimmedValue;
    },
    invalidMessage: "入力されたメールアドレスが一致してません"
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

const isInvalidRegex = (reg, value) => !reg.test(value);

const addValidClassName = (target) => {
  target.parentElement.classList.add("valid");
};

const isValidField = (e) => {
  const field = e.target;
  if (isBlankInInput(field.value)) {
    addInvalidMessage(field, "未入力です");
    changeButton.disabled = true;
    return;
  }

  if (constraint[field.id].validation()) {
    addInvalidMessage(field, constraint[field.id].invalidMessage);
    changeButton.disabled = true;
    return;
  }
  addValidClassName(field);
  toggleDisableChangeButton();
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

const toggleDisableChangeButton = () => {
  const isInvalidFields = Object.keys(constraint).some((key) => {
    return constraint[key].validation();
  });
  changeButton.disabled = isInvalidFields;
};

const togglePasswordButton = (e) => {
  const target = e.target;
  if (target.classList.contains("is-hide")) {
    passwordField.type = "text";
    target.classList.remove("is-hide");
    target.classList.add("is-show");
  } else {
    passwordField.type = "password";
    target.classList.remove("is-show");
    target.classList.add("is-hide");
  }
}

passwordButton.addEventListener("click", togglePasswordButton);
passwordField.addEventListener("blur", isValidField);
emailField.addEventListener("blur", isValidField);
emailField.addEventListener("focus", resetInputField);
confirmEmailField.addEventListener("blur", isValidField);
confirmEmailField.addEventListener("focus", resetInputField);
passwordField.addEventListener("focus", resetInputField);

changeButton.addEventListener("click", (e) => {
  e.preventDefault();
  const usersData = JSON.parse(localStorage.getItem("morikenjuku"));
  const matchedUserData = Object.values(usersData).find(
    (data) => data.password === passwordField.value
  );
  if (matchedUserData) {
    matchedUserData.email = emailField.value;
    localStorage.setItem("morikenjuku", JSON.stringify(usersData));
    window.location.href = `./resetmaildone.html?token=${localStorage.token}`;
  } else {
    passwordField.parentElement.classList.remove("valid");
    changeButton.disabled = true;
    addInvalidMessage(passwordField, "パスワードが正しくありません");
  }
});
