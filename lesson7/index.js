const ul = document.getElementById('js-ul');

function getData() {
  const data = [
    { to: "bookmark.html", img: "1.png", alt: "画像1", text: "ブックマーク" },
    { to: "message.html", img: "2.png", alt: "画像2", text: "メッセージ" }
  ]
  return data;
}

function createList() {
  const LoadingImage = document.createElement('img');
  LoadingImage.src = "./loading-circle.gif";
  ul.appendChild(LoadingImage);
  return new Promise((resolve) => {
    setTimeout(() => {
      if (getData()) {
        resolve(getData());
      }
    }, 1000)
  })
}

createList().then((lists) => {
  ul.removeChild(ul.firstChild);
  const frag = document.createDocumentFragment();
  lists.forEach((list) => {
    const li = document.createElement('li');
    const anchor = document.createElement('a');
    const img = document.createElement('img');

    anchor.href = `/${list.to}`;
    img.src = list.img;
    img.alt = list.alt;

    frag.appendChild(li).appendChild(anchor).appendChild(img);
    anchor.insertAdjacentHTML('beforeend', list.text);

  });
  ul.appendChild(frag);
});
