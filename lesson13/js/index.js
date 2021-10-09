const wrapper = document.getElementById('js-wrapper');
const modalBtn = document.getElementById('js-modal-btn');
const requestBtn = document.getElementById('js-request-btn');
const modal = document.getElementById('js-modal');


function addLoading() {
  const loading = document.createElement('img');
  loading.src = "./img/loading-circle.gif";
  loading.id = "loading";
  wrapper.appendChild(loading);
}

function removeLoading() {
  const loading = document.getElementById('loading');
  loading.remove();
}

async function fetchErrorHandling(response) {
  if (!response.ok) {
    throw new Error("サーバーエラーが発生しました");
  } else {
    return await response.json();
  }
}

async function fetchData() {
  const response = await fetch("https://jsondata.okiba.me/v1/json/fR9k5211007080400");
  const json = await fetchErrorHandling(response);
  return json;
}

function createLists(values) {
  const frag = document.createDocumentFragment();
  const ul = document.getElementById('js-ul');

  values.data.forEach(value => {
    const li = document.createElement('li');
    const anchor = document.createElement('a');
    const img = document.createElement('img');

    anchor.href = value.a;
    img.src = value.img;
    img.alt = value.alt;

    frag.appendChild(li).appendChild(anchor).appendChild(img);
    anchor.insertAdjacentHTML('beforeend', value.text);
  });

  ul.appendChild(frag);
}


async function tryCreate() {
  addLoading();
  try {
    const responseData = await fetchData();
    if (!responseData.data) {
      throw new Error("適切なデータが見つかりませんでした");
    } else {
      createLists(responseData);
    }
  } catch (error) {
    const errorMessage = document.createElement("p");
    errorMessage.textContent = error;
    wrapper.appendChild(errorMessage);
    console.error(error);
  } finally {
    removeLoading();
  }
}

modalBtn.addEventListener('click', (e) => {
  e.target.style = "display:none";
  modal.classList.add('visible');
});

requestBtn.addEventListener('click', () => {
  modal.classList.remove('visible');
  tryCreate();
});
