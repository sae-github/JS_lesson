const lists = document.getElementById('js-lists');
const list = document.createElement('li');

const anchor = document.createElement('a');
anchor.href = '1.html';
anchor.textContent = "これです";

const image = document.createElement('img');
image.src = 'bookmark.png';
image.alt = 'ブックマーク';

lists
.appendChild(list)
.appendChild(anchor)
.insertAdjacentElement('afterbegin',image);
