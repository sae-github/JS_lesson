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

async function fetchData() {
  addLoading();
  const response = await fetch("https://jsondata.okiba.me/v1/json/eGNos210920102817");
  if (!response.ok) {
    throw new Error(response.statusText);
  } else {
    const json = await response.json();
    return json;
  }
}

async function tryCreate() {
  try {
    const responseData = await fetchData();
    if (responseData.data) {
      createLists(responseData);
    } else {
      div.textContent = "適切なデータが見つかりませんでした";
    }
  } catch (e) {
    div.textContent = "サーバーエラーが発生しました";
    console.error(e);
  }
}


function createLists(responseData) {
  removeLoading();
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
}

tryCreate();
