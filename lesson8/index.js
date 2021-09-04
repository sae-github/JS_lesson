const ul = document.getElementById('js-ul');

const data = [
  { to: "bookmark.html", img: "1.png", alt: "画像1", text: "ブックマーク" },
  { to: "message.html", img: "2.png", alt: "画像2", text: "メッセージ" }
];

function addLoading() {
  const loadingImage = document.createElement('img');
  loadingImage.src = "./loading-circle.gif";
  loadingImage.id = "loading";
  ul.appendChild(loadingImage);
}

function getData() {
  addLoading();
  return new Promise((resolve,reject) => {
    setTimeout(() => {
      reject(new Error('エラーが起きました!'));
    }, 3000);
  });
}

getData()
.then((lists) => {
  console.log(lists);
})
.catch((e) => {
  console.error(e);
});

