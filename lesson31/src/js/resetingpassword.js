const passwordButtons = [...document.querySelectorAll(".js-password-icon")];
const confirmPasswordField = document.getElementById("confirmNewPassword");
const newPasswordField = document.getElementById("newPassword");
const passwordField = document.getElementById("password");
const changeButton = document.getElementById("js-change-button");

const constraint = {
  password: {
    validation: () => {
      const reg = /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])[a-zA-Z0-9]{8,}$/g;
      return !reg.test(passwordField.value);
    },
    invalidMessage: "8文字以上の大小の英数字を交ぜたものにしてください。"
  },
  newPassword: {
    validation: () => {
      const reg = /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])[a-zA-Z0-9]{8,}$/g;
      return !reg.test(newPasswordField.value);
    },
    invalidMessage: "8文字以上の大小の英数字を交ぜたものにしてください。"
  },
  confirmNewPassword: {
    validation: () => {
      const confirmTrimmedValue = confirmPasswordField.value.trim();
      const passwordTrimmedValue = newPasswordField.value.trim();
      return confirmTrimmedValue !== passwordTrimmedValue;
    },
    invalidMessage: "入力されたパスワードが一致してません"
  }
}

const isBlankInInput = (value) => value.trim() === "";

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

const toggleDisableChangeButton = () => {
  const isInvalidFields = Object.keys(constraint).some((key) => {
    return constraint[key].validation();
  });
  changeButton.disabled = isInvalidFields;
};

const togglePasswordButton = (e) => {
  const target = e.target;
  if (target.classList.contains("is-hide")) {
    target.previousElementSibling.type = "text";
    target.classList.remove("is-hide");
    target.classList.add("is-show");
  } else {
    target.previousElementSibling.type = "password";
    target.classList.remove("is-show");
    target.classList.add("is-hide");
  }
};

const isUserPassword = (data) => data[localStorage.getItem("token")].password === passwordField.value;

passwordButtons.forEach((button) => {
  button.addEventListener("click", togglePasswordButton);
});
passwordField.addEventListener("blur", isValidField);
newPasswordField.addEventListener("blur", isValidField);
confirmPasswordField.addEventListener("blur", isValidField);
newPasswordField.addEventListener("focus", resetInputField);
confirmPasswordField.addEventListener("focus", resetInputField);
passwordField.addEventListener("focus", resetInputField);

changeButton.addEventListener("click", (e) => {
  e.preventDefault();
  const usersData = JSON.parse(localStorage.getItem("morikenjuku"));
  const loginToken = localStorage.getItem("token");
  if (isUserPassword(usersData)) {
    usersData[loginToken].password = newPasswordField.value;
    localStorage.setItem("morikenjuku", JSON.stringify(usersData));
    window.location.href = `./resetpassworddone.html?token=${localStorage.token}`;
  } else {
    passwordField.parentElement.classList.remove("valid");
    changeButton.disabled = true;
    addInvalidMessage(passwordField, "パスワードが正しくありません");
  }
});
