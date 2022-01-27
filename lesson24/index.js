const modalContent = document.getElementById("js-modal-content");
const submitButton = document.getElementById("js-submit-button");
const checkBox = document.querySelector(".js-check-box");
const overLay = document.getElementById("js-overlay");
const closeButton = document.getElementById("js-modal-close");
const rules = document.getElementById("js-rules");
const body = document.querySelector("body");

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
      scrollInModalContent.disconnect();
    }
  },
  { root: modalContent }
);
scrollInModalContent.observe(modalContent.lastElementChild);

submitButton.addEventListener("click", (e) => {
  const registerForm = document.getElementById("js-register-form");
  checkBox.checked ? registerForm.submit() : e.preventDefault();
});
