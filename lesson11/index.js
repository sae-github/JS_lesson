const ul = document.getElementById('js-ul');
const div = document.getElementById('js-wrapper');


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

async function getData() {
  addLoading();
  try {
    const response = await fetch("https://jsondata.okiba.me/v1/json/eGNos210920102817");
    if (!response.ok) {
      throw new Error(response.statusText);
    } else {
      return response.json();
    }
  } catch (e) {
    div.textContent = "エラーが発生しました！";
    console.error(e);
  }
}

async function createLists() {
  const responseData = await getData();
  if (responseData !== undefined) {
    removeLoading();
    const frag = document.createDocumentFragment();
    responseData.data.forEach((data) => {
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
    div.textContent = "データが未定義です";
    div.appendChild(p);
  }
}

createLists();


