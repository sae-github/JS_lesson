const modalContent = document.getElementById("js-modal-content");
const submitButton = document.getElementById("js-submit-button");
const checkBox = document.querySelector(".js-check-box");
const overLay = document.getElementById("js-overlay");
const closeButton = document.getElementById("js-modal-close");
const rules = document.getElementById("js-rules");
const body = document.querySelector("body");
const userName = document.getElementById("username");
const email = document.getElementById("email");
const password = document.getElementById("password");
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
      switchDisabledInCheckbox();
    }
  },
  { root: modalContent }
);
scrollInModalContent.observe(modalContent.lastElementChild);

const constraint = {
  username: {
    validation: () => {
      const limitNumber = 16;
      return isLimitTextLength(userName.value, limitNumber);
    },
    invalidMessage: "ユーザー名は15文字以下にしてください。"
  },
  email: {
    validation: () => {
      const reg = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+\.[A-Za-z]+(\.[A-Za-z]+?)?$/g;
      return isInvalidRegex(reg, email.value);
    },
    invalidMessage: "メールアドレスの形式になっていません"
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

const isLimitTextLength = (value, limit) => value.length >= limit;

const isInvalidRegex = (reg, value) => reg.test(value) ? false : true;

const addValidClassName = (target) => {
  const parent = target.parentElement;
  parent.classList.add("valid");
};

const isValidField = (field) => {
  if (isBlankInInput(field.value)) {
    addInvalidMessage(field, "未入力です");
    return false;
  }

  if (constraint[field.id].validation()) {
    addInvalidMessage(field, constraint[field.id].invalidMessage);
    return false;
  }

  return true;
};

const isValidAllInputFields = () => {
  return Object.keys(constraint).every((key) => {
    const fieldElement = document.getElementById(key).value;
    return isBlankInInput(fieldElement) || constraint[key].validation() ? false : true;
  });
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

const setInputFieldEvent = (e) => {
  if (isValidField(e.target)) {
    addValidClassName(e.target);
    switchDisabledInCheckbox();
  } else {
    submitButton.disabled = true;
  }
};

const switchDisabledInCheckbox = () => {
  submitButton.disabled = isValidAllInputFields() && checkBox.checked ? false : true;
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
password.addEventListener("blur", setInputFieldEvent);
email.addEventListener("blur", setInputFieldEvent);
userName.addEventListener("blur", setInputFieldEvent);
checkBox.addEventListener("change", switchDisabledInCheckbox);
userName.addEventListener("focus", resetInputField);
email.addEventListener("focus", resetInputField);
password.addEventListener("focus", resetInputField);

