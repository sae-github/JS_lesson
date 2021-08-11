const ul = document.getElementById('js-ul');

const items = [
  { to: "bookmark.html", img: "1.png", alt: "画像1", text: "ブックマーク" },
  { to: "message.html", img: "2.png", alt: "画像2", text: "メッセージ" }
]

Promise.resolve(items).then((items) => {
  items.forEach(item => {
    const frag = document.createDocumentFragment();
    const li = document.createElement('li');
    const anchor = document.createElement('a');
    const img = document.createElement('img');

    anchor.href = item.to;
    img.src = item.img;
    img.alt = item.alt;

    li.appendChild(anchor).appendChild(img);
    anchor.insertAdjacentHTML('beforeend', item.text)
    frag.appendChild(li)
    ul.appendChild(frag);
  });
})


