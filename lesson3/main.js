
const ul = document.getElementById('js-ul');
const frag = document.createDocumentFragment();

const items = [
  { href: "a1.html", src:"/img/bookmark.png",text: "a1"},
  { href: "a2.html", src:"/img/message.png",text: "a2"}
]

for(let i = 0, len = items.length; i < len; i++) {
  const item = items[i];
  const li = document.createElement('li');
  const anchor = document.createElement('a');
  const image = document.createElement('img');
  
  anchor.href = item.href;
  image.src = item.src;


  li
  .appendChild(anchor)
  .appendChild(image);

  anchor.insertAdjacentHTML('beforeend', item.text);
  frag.appendChild(li);
} 

ul.appendChild(frag);
