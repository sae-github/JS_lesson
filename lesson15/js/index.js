const modalBtn = document.getElementById("js-modal-btn");
const modal = document.getElementById("js-modal");
const requestBtn = document.getElementById("js-request-btn");
const ul = document.getElementById("js-ul");

function addLoading() {
  const wrapper = document.getElementById("js-wrapper");
  const loading = document.createElement("img");
  loading.src = "./img/loading-circle.gif";
  loading.id = "loading";
  wrapper.appendChild(loading);
}

function removeLoading() {
  const loading = document.getElementById("loading");
  loading.remove();
}

async function fetchErrorHandling(response) {
  if (response.ok) {
    return await response.json();
  } else {
    throw new Error("サーバーエラーが発生しました");
  }
}

async function getJsonOrError() {
  const response = await fetch(
    "https://jsondata.okiba.me/v1/json/fR9k5211007080400"
  );
  const json = await fetchErrorHandling(response);
  return json;
}

function createLists({ data }) {
  const frag = document.createDocumentFragment();
  data.forEach(value => {
    const { a, img, alt, text } = value;
    const li = document.createElement("li");
    const anchor = document.createElement("a");
    const image = document.createElement("img");

    anchor.href = `/${a}.html`;
    image.src = img;
    image.alt = alt;

    frag.appendChild(li).appendChild(anchor).appendChild(image);
    anchor.insertAdjacentHTML("beforeend", text);
  });
  ul.appendChild(frag);
}

async function tryGetData() {
  addLoading();
  try {
    return await getJsonOrError();
  } catch (error) {
    ul.replaceWith(error);
  } finally {
    removeLoading();
  }
}

async function tryCreate() {
  try {
    const responseData = await tryGetData();
    if (responseData.data) {
      createLists(responseData);
    } else {
      throw new Error("適切なデータが見つかりませんでした");
    }
  } catch (error) {
    ul.replaceWith(error);
  }
}

modalBtn.addEventListener("click", (e) => {
  e.target.style = "display: none";
  modal.classList.add("visible");
});

requestBtn.addEventListener("click", (e) => {
  const inputName = document.getElementById("name").value;
  const inputNumber = document.getElementById("number").value;
  e.preventDefault();
  if (inputName === "" || inputNumber === "") {
    alert("Name or number not entered. Please confirm.");
  } else {
    console.log(`Name: ${inputName}, Number: ${inputNumber}`);
    tryCreate();
    modal.classList.remove("visible");
  }
});

