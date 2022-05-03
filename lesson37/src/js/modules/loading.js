import { createElementWithClassName } from "./createElementWithClassName";

export const loading = {
  create: (imgSrc = "./img/loading-circle.gif") => {
    const loading = createElementWithClassName("div", "loading-wrapper");
    const img = document.createElement("img");
    loading.id = "js-loading";
    img.src = imgSrc;
    loading.appendChild(img);
    return loading;
  },
  remove: () => {
    document.getElementById("js-loading").remove();
  }
}
