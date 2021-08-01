const lists = document.getElementById('js-list');
const list = document.createElement('li');
const text = document.createTextNode('これです');

const anchor = document.createElement('a');
anchor.href = '1.html';

const image = document.createElement('img');
const src = document.createAttribute('src');
const alt = document.createAttribute('alt');
src.value = 'bookmark.png';
alt.value = 'ブックマーク';
image.setAttributeNode(src);
image.setAttributeNode(alt);

lists.appendChild(list);
list.appendChild(anchor);
anchor.appendChild(image);
anchor.appendChild(text);

