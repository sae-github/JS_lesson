const modalBtn = document.getElementById('js-modal-btn');
const requestBtn = document.getElementById('js-request-btn');
const modal = document.getElementById('js-modal');
const ul = document.getElementById('js-ul');

function addLoading() {
  const wrapper = document.getElementById('js-wrapper');
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
  values.forEach(value => {
    const li = document.createElement('li');
    const anchor = document.createElement('a');
    const img = document.createElement('img');

    anchor.href = `/${value.a}.html`;
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
      createLists(responseData.data);
    }
  } catch (exception) {
    ul.replaceWith(exception);
  } finally {
    removeLoading();
  }
}

modalBtn.addEventListener('click', (e) => {
  e.target.style = "display:none";
  modal.classList.add('visible');
});

requestBtn.addEventListener('click', () => {
  const number = document.getElementById('number');
  if (number.value === "") {
    alert("No proper input! Please enter a number");
  } else {
    console.log(number.value);
    modal.classList.remove('visible');
    tryCreate();
  }
});


