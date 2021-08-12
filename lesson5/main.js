const ul = document.getElementById('js-ul');

const lists = [
  { to: "bookmark.html", img: "1.png", alt: "画像1", text: "ブックマーク" },
  { to: "message.html", img: "2.png", alt: "画像2", text: "メッセージ" }
]

const promise = new Promise((resolve) => {
  resolve(lists);
}).then((lists) => {
  lists.forEach(list => {
    const frag = document.createDocumentFragment();
    const li = document.createElement('li');
    const anchor = document.createElement('a');
    const img = document.createElement('img');
    
    anchor.href = `/${list.to}`;
    img.src = list.img;
    img.alt = list.alt;

    li.appendChild(anchor).appendChild(img);
    anchor.insertAdjacentHTML('beforeend', list.text)
    frag.appendChild(li)
    ul.appendChild(frag);
  });
});



