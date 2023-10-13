// 移动端横屏适配（DOM侧）
const adaptMobileDOM = (el: HTMLElement) => {
  const width = document.documentElement.clientWidth,
    height = document.documentElement.clientHeight;
  if (width > height) {
    el.style.webkitTransform = el.style.transform = `rotate(0deg)`;
    el.style.width = `${width}px`;
    el.style.height = `${height}px`;
    el.style.webkitTransformOrigin = el.style.transformOrigin = `center`;
  } else {
    el.style.webkitTransform = el.style.transform = `rotate(90deg)`;
    el.style.width = `${height}px`;
    el.style.height = `${width}px`;
    el.style.webkitTransformOrigin = el.style.transformOrigin = `${
      width / 2
    }px center`;
  }
};

export { adaptMobileDOM };
