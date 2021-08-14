
const lists = [
  { to: "bookmark.html", img: "1.png", alt: "画像1", text: "ブックマーク" },
  { to: "message.html", img: "2.png", alt: "画像2", text: "メッセージ" }
]

function getListsObj() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(lists);
    }, 3000);
  });
}

getListsObj().then((data) => {
  const ul = document.getElementById('js-ul');
  const frag = document.createDocumentFragment();

  data.forEach(value => {
    const li = document.createElement('li');
    const anchor = document.createElement('a');
    const img = document.createElement('img');

    anchor.href = `/${value.to}`;
    img.src = value.img;
    img.alt = value.alt;

    frag.appendChild(li).appendChild(anchor).appendChild(img);
    anchor.insertAdjacentHTML('beforeend', value.text);
  });
  ul.appendChild(frag);
});


