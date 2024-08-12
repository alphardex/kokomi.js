import imagesLoaded from "imagesloaded";

// 图片预加载
const preloadImages = (sel = "div") => {
  return new Promise((resolve) => {
    imagesLoaded(sel, { background: true }, resolve);
  });
};

// 阻止事件默认行为和冒泡
const preventDefaultAndStopBubble = (e: Event) => {
  e.preventDefault();
  e.stopPropagation();
};

// 获取设备类型
const detectDeviceType = () => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  )
    ? "Mobile"
    : "Desktop";
};

export { preloadImages, preventDefaultAndStopBubble, detectDeviceType };
