
const ul = document.getElementById('js-ul');
const frag = document.createDocumentFragment();

const items = [
  {to: "bookmark.html", img: "1.png", alt:"画像1", text: "ブックマーク"}, 
  {to: "message.html", img: "2.png", alt:"画像2", text: "メッセージ"}
] 

items.forEach(item => {
  const li = document.createElement('li');
  const anchor = document.createElement('a');
  const image = document.createElement('img');

  anchor.href = `/${item.to}`;
  image.src = item.img;
  image.alt = item.alt;

  li
  .appendChild(anchor)
  .appendChild(image);
  anchor.insertAdjacentHTML('beforeend',item.text)
  frag.appendChild(li);
});

ul.appendChild(frag);

