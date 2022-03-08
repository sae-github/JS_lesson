const fileField = document.getElementById('file');
const uploadBox = document.getElementById("js-upload-box");
const uploadBoxInner = document.getElementById("js-upload-box-inner");
const formWrapper = document.getElementById("js-form-wrapper");
const profileIcon = document.getElementById('js-profile-icon');
const changeButton = document.getElementById("js-change-button");

const createLoading = () => {
  const loading = document.createElement("img");
  loading.classList.add("loading");
  loading.id = "js-loading";
  loading.src = "./img/loading-circle.gif";
  return loading;
};

const cancelPreview = () => {
  document.getElementById("js-upload-preview-image").remove();
  document.getElementById("js-cancel-button").remove();
  uploadBoxInner.style.display = "block";
}

const renderPreviewCancelButton = () => {
  const formFoot = document.getElementById("js-form-foot");
  const cancelButton = document.createElement("button");
  cancelButton.classList.add("cancel-button");
  cancelButton.id = "js-cancel-button";
  cancelButton.textContent = "やっぱやめる";
  formFoot.appendChild(cancelButton);
  cancelButton.addEventListener("click", cancelPreview);
}

const createPreviewImage = (result) => {
  const img = document.createElement("img");
  const uploadPreviewWrapper = document.createElement("div");
  img.src = result;
  uploadPreviewWrapper.id = "js-upload-preview-image";
  uploadPreviewWrapper.classList.add("upload__preview-wrapper");
  uploadPreviewWrapper.appendChild(img);
  return uploadPreviewWrapper;
}

const showPreviewImage = (uri) => {
  uploadBoxInner.style.display = "none";
  uploadBox.appendChild(createPreviewImage(uri));
}

const setChangeButtonEvent = (result) => {
  changeButton.addEventListener("click", (e) => {
    e.preventDefault();
    setImageUrlInLocalStorage(result);
    changeProfileIcon(result);
  });
}
const setImageUrlInLocalStorage = (url) => {
  const usersData = JSON.parse(localStorage.getItem("morikenjuku"));
  const token = localStorage.getItem("token");
  const loginUserData = usersData[token];
  loginUserData["icon"] = url;
  localStorage.setItem("morikenjuku", JSON.stringify(usersData));
}

const changeProfileIcon = (url) => {
  formWrapper.textContent = "";
  formWrapper.appendChild(createLoading());
  setTimeout(() => {
    formWrapper.textContent = "変更しました";
    changeButton.remove();
    profileIcon.src = url;
  }, 1000);
}

const readerUploadImage = async (file) => {
  const reader = new FileReader();
  return new Promise((resolve, reject) => {
    reader.addEventListener('load', () => {
      resolve(reader.result);
    });

    reader.addEventListener("onerror", () => {
      reject(new Error("ファイルの読み込みに失敗しました"));
    });

    reader.readAsDataURL(file);
  });
}

const handleUploadFile = async (file) => {
  let result;
  try {
    result = await readerUploadImage(file);
  } catch (e) {
    uploadBox.textContent = e;
    return;
  }
  changeButton.disabled = false;
  showPreviewImage(result);
  setChangeButtonEvent(result);
  renderPreviewCancelButton();
}

fileField.addEventListener('change', (e) => {
  const file = e.target.files[0];
  handleUploadFile(file);
});

["dragenter", "dragover"].forEach((type) => {
  uploadBox.addEventListener(type, (e) => {
    e.stopPropagation();
    e.preventDefault();
    uploadBox.classList.add("is-drag-over");
  });
});

['dragleave', 'drop'].forEach((type) => {
  uploadBox.addEventListener(type, (e) => {
    e.stopPropagation();
    e.preventDefault();
    uploadBox.classList.remove("is-drag-over");
  });
});

uploadBox.addEventListener('drop', (e) => {
  e.stopPropagation();
  e.preventDefault();
  const file = e.dataTransfer.files[0];
  handleUploadFile(file);
});
