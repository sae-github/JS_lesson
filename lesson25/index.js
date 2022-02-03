const modalContent = document.getElementById("js-modal-content");
const submitButton = document.getElementById("js-submit-button");
const checkBox = document.querySelector(".js-check-box");
const overLay = document.getElementById("js-overlay");
const closeButton = document.getElementById("js-modal-close");
const rules = document.getElementById("js-rules");
const body = document.querySelector("body");
const form = document.getElementById("js-register-form");

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
      const event = new Event("input", { bubbles: true });
      checkBox.dispatchEvent(event);
      scrollInModalContent.disconnect();
    }
  },
  { root: modalContent }
);
scrollInModalContent.observe(modalContent.lastElementChild);

const constraint = {
  name: {
    validation: () => {
      const value = document.getElementById("name").value;
      return isLimitTextLength(value, 16);
    },
    invalidMessage: "ユーザー名は15文字以下にしてください。"
  },
  email: {
    validation: () => {
      const value = document.getElementById("email").value;
      const reg = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+\.[A-Za-z]+(\.[A-Za-z]+?)?$/g;
      return isValidInRegex(reg, value);
    },
    invalidMessage: "メールアドレスの形式になっていません"
  },
  password: {
    validation: () => {
      const value = document.getElementById("password").value;
      const reg = /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])[a-zA-Z0-9]{8,}$/g;
      return isValidInRegex(reg, value);
    },
    invalidMessage: "8文字以上の大小の英数字を交ぜたものにしてください。"
  }
};

const isBlankInInput = (value) => value.trim() === "";

const isLimitTextLength = (value, limit) => value.length >= limit;

const isValidInRegex = (constraint, value) => constraint.test(value) ? false : true;

const addValidClassName = (target) => {
  const parent = target.parentElement;
  parent.classList.add("valid");
};

const removeInvalidMessage = (target) => {
  target.parentElement.classList.remove("invalid");
  const errorMessage = target.parentElement.querySelector(".invalid-message");
  errorMessage && errorMessage.remove();
};

const removeValidClassName = (target) => {
  target.parentElement.classList.remove("valid");
};

const addValidationMessage = (field) => {

  if (isBlankInInput(field.value)) {
    removeValidClassName(field);
    addInvalidMessage(field, "未入力です");
    return;
  }

  if (constraint[field.id].validation()) {
    removeValidClassName(field);
    addInvalidMessage(field, constraint[field.id].invalidMessage);
    return;
  }

  removeInvalidMessage(field);
  addValidClassName(field);

};

const checkAllInputs = () => {
  return Object.keys(constraint).every((key) => {
    const fieldElement = document.getElementById(key).value;
    return isBlankInInput(fieldElement) || constraint[key].validation() ? false : true;
  });
};

const addInvalidMessage = (target, message) => {
  const parent = target.parentElement;
  parent.classList.add("invalid");
  const el =
    target.parentElement.querySelector(".invalid-message") ??
    document.createElement("span");
  el.classList.add("invalid-message");
  el.textContent = message;
  parent.appendChild(el);
};

form.addEventListener("input", (e) => {
  const targetField = e.target;
  targetField.id !== "check-box" && addValidationMessage(targetField);
  submitButton.disabled = checkAllInputs() && checkBox.checked ? false : true;
});
