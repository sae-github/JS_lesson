const email = document.getElementById("email");
const confirmEmail = document.getElementById("confirmEmail");
const changeButton = document.getElementById("js-submit-button");
const passwordButton = document.getElementById("js-password-icon");
const password = document.getElementById("password");

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
    invalidMessage: "入力されたメールアドレスが一致してません"
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
email.addEventListener("blur", isValidField);
email.addEventListener("focus", resetInputField);
confirmEmail.addEventListener("blur", isValidField);
confirmEmail.addEventListener("focus", resetInputField);
password.addEventListener("focus", resetInputField);

changeButton.addEventListener("click", (e) => {
  e.preventDefault();
  const usersData = JSON.parse(localStorage.getItem("morikenjuku"));
  const matchedUserData = Object.values(usersData).find((data) => data.password === password.value);
  if (matchedUserData) {
    matchedUserData.email = email.value;
    localStorage.setItem("morikenjuku", JSON.stringify(usersData));
    window.location.href = `./resetmaildone.html?token=${localStorage.token}`;
  } else {
    password.parentElement.classList.remove("valid");
    changeButton.disabled = true;
    addInvalidMessage(password, "パスワードが正しくありません");
  }
});
