const ul = document.getElementById('js-ul');


const listData = [
  { to: "bookmark.html", img: "1.png", alt: "画像1", text: "ブックマーク" },
  { to: "message.html", img: "2.png", alt: "画像2", text: "メッセージ" }
];

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

function getData() {
  addLoading();
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(listData);
    }, 3000);
  });
}

async function fetchData() {
  try {
    return await getData();
  } catch (e) {
    console.error(e);
    ul.textContent = "エラーが発生しました！";
  } finally {
    removeLoading();
  }
}

async function createLists() {
  const responseData = await fetchData();
  const frag = document.createDocumentFragment();
  responseData.forEach((data) => {
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

createLists();
