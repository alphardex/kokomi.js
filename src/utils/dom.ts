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

// 阻止事件默认行为和冒泡
const preventDefaultAndStopBubble = (e: Event) => {
  e.preventDefault();
  e.stopPropagation();
};

export { preloadImages, sleep, preventDefaultAndStopBubble };
