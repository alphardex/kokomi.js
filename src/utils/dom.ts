import imagesLoaded from "imagesloaded";

// 图片预加载
const preloadImages = (sel = "div") => {
  return new Promise((resolve) => {
    imagesLoaded(sel, { background: true }, resolve);
  });
};

// 延迟
const sleep = (time: number) =>
  new Promise((resolve) => setTimeout(resolve, time));

export { preloadImages, sleep };
