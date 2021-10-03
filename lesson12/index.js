const ul = document.getElementById('js-ul');
const div = document.getElementById('js-wrapper');
const button = document.getElementById("js-button");


function addLoading() {
  const loading = document.createElement('img');
  loading.src = "./loading-circle.gif";
  loading.id = "loading";
  ul.appendChild(loading);
}

function removeLoading() {
  const loading = document.getElementById('loading');
  loading.remove();
}


async function fetchData() {
  const response = await fetch("https://jsondata.okiba.me/v1/json/TOqvy211002104750");
  if (!response) {
    throw new Error(response.statusText);
  } else {
    const json = await response.json();
    createLists(json);
  }
}

function createLists(responseData) {
  if (responseData.data) {
    const frag = document.createDocumentFragment();
    responseData.data.forEach(data => {
      const li = document.createElement('li');
      const anchor = document.createElement('a');
      const img = document.createElement('img');

      anchor.href = `/${data.to}`;
      img.src = data.img;
      img.alt = data.alt;

      frag.appendChild(li).appendChild(anchor).appendChild(img);
      anchor.insertAdjacentHTML('beforeend', data.text);
    });
    ul.appendChild(frag);
  } else {
    const unintendedDataMessage = document.createElement("p");
    unintendedDataMessage.textContent = "適切なデータが見つかりませんでした";
    div.appendChild(unintendedDataMessage);
  }
}

async function tryCreate() {
  addLoading();
  try {
    await fetchData();
  } catch (e) {
    const serverErrorMessage = document.createElement("p");
    serverErrorMessage.textContent = "サーバーエラーが発生しました";
    div.appendChild(serverErrorMessage);
    console.error(e);
  } finally {
    removeLoading();
    button.style = "display: none";
  }
}

button.addEventListener('click', tryCreate);




