const passwordButtons = [...document.querySelectorAll(".js-password-icon")];
const confirmNewPassword = document.getElementById("confirmNewPassword");
const newPassword = document.getElementById("newPassword");
const password = document.getElementById("password");
const changeButton = document.getElementById("js-change-button");

const constraint = {
  password: {
    validation: () => {
      const reg = /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])[a-zA-Z0-9]{8,}$/g;
      return !reg.test(password.value);
    },
    invalidMessage: "8文字以上の大小の英数字を交ぜたものにしてください。"
  },
  newPassword: {
    validation: () => {
      const reg = /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])[a-zA-Z0-9]{8,}$/g;
      return !reg.test(newPassword.value);
    },
    invalidMessage: "8文字以上の大小の英数字を交ぜたものにしてください。"
  },
  confirmNewPassword: {
    validation: () => {
      const confirmTrimmedValue = confirmNewPassword.value.trim();
      const passwordTrimmedValue = newPassword.value.trim();
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

const changeUserPassword = (userData) => {
  userData.password = newPassword.value;
  localStorage.setItem("morikenjuku", JSON.stringify(userData));
};

passwordButtons.forEach((button) => {
  button.addEventListener("click", togglePasswordButton);
});
password.addEventListener("blur", isValidField);
newPassword.addEventListener("blur", isValidField);
confirmNewPassword.addEventListener("blur", isValidField);
newPassword.addEventListener("focus", resetInputField);
confirmNewPassword.addEventListener("focus", resetInputField);
password.addEventListener("focus", resetInputField);

changeButton.addEventListener("click", (e) => {
  e.preventDefault();
  const userData = JSON.parse(localStorage.getItem("morikenjuku"));
  if (password.value === userData.password) {
    changeUserPassword(userData);
    window.location.href = `./resetpassworddone.html?token=${localStorage.token}`;
  } else {
    password.parentElement.classList.remove("valid");
    changeButton.disabled = true;
    addInvalidMessage(password, "パスワードが正しくありません");
  }
});