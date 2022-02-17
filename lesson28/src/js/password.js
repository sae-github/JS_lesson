
const passwordButtons = [...document.querySelectorAll(".js-password-icon")];
const password = document.getElementById("password");
const submitButton = document.getElementById("js-submit-button");
const confirmPassword = document.getElementById("confirmPassword");

const constraint = {
  password: {
    validation: () => {
      const reg = /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])[a-zA-Z0-9]{8,}$/g;
      return isInvalidRegex(reg, password.value);
    },
    invalidMessage: "8文字以上の大小の英数字を交ぜたものにしてください。"
  },
  confirmPassword: {
    validation: () => {
      const confirmTrimmedValue = confirmPassword.value.trim();
      const passwordTrimmedValue = password.value.trim();
      return confirmTrimmedValue !== passwordTrimmedValue
    },
    invalidMessage: "入力されたパスワードが一致してません"
  }
};

const isBlankInInput = (value) => value.trim() === "";

const isInvalidRegex = (reg, value) => reg.test(value) ? false : true;

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
  const result = Object.keys(constraint).every((key) => {
    const fieldElement = document.getElementById(key).value;
    return isBlankInInput(fieldElement) || constraint[key].validation() ? false : true;
  });
  submitButton.disabled = result ? false : true;
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
}

const isTokenParam = (params) => {
  const tokenParam = params.get("token");
  const token = "482r22fafah";
  return tokenParam === token;
}

const isUserParma = (params) => {
  const userParam = params.get("user");
  return userParam === localStorage.username;
}

const checkUrlParams = () => {
  const urlParams = new URLSearchParams(window.location.search);
  if (isTokenParam(urlParams) && isUserParma(urlParams)) {
    window.location.href = "../register/password.html";
  } else {
    window.location.href = "../notauthorize.html";
  }
}

window.location.search && checkUrlParams();

passwordButtons.forEach(button => {
  button.addEventListener("click", togglePasswordButton);
});
password.addEventListener("blur", isValidField);
password.addEventListener("focus", resetInputField);
confirmPassword.addEventListener("blur", isValidField);
confirmPassword.addEventListener("focus", resetInputField);


submitButton.addEventListener("click", (e) => {
  localStorage.setItem("password", password.value);
  window.location.href = "./password-done.html";
  e.preventDefault();
});






