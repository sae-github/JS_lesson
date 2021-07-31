
// case1
const list1 = document.getElementById("js-list1");
list1.innerHTML = "<li>これです</li>";

// case2
const list2 = document.getElementById('js-list2');
const li = document.createElement('li');
const text = document.createTextNode('これです');
list2.appendChild(li);
li.appendChild(text);
