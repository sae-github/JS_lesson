const lists = document.getElementById('js-lists');
const list = document.createElement('li');
const text = document.createTextNode('これです');

const anchor = document.createElement('a');
anchor.href = '1.html';

const image = document.createElement('img');
image.src = 'bookmark.png';
image.alt = 'ブックマーク';

lists.appendChild(list);
list.appendChild(anchor);
anchor.appendChild(image);
anchor.appendChild(text);

