import * as THREE from "three";

export interface LoadVideoOptions extends HTMLMediaElement {
  unsuspend: "canplay" | "canplaythrough" | "loadstart" | "loadedmetadata";
  start: boolean;
}

// 加载视频贴图
const loadVideoTexture = (
  src: string,
  options: Partial<LoadVideoOptions> = {}
): Promise<THREE.VideoTexture> => {
  const {
    unsuspend = "loadedmetadata",
    crossOrigin = "Anonymous",
    loop = true,
    muted = true,
    start = true,
  } = options;

  return new Promise((resolve) => {
    const video = Object.assign(document.createElement("video"), {
      src,
      crossOrigin,
      loop,
      muted,
      ...options,
    });
    const texture = new THREE.VideoTexture(video);
    video.addEventListener(unsuspend, () => {
      if (start) {
        texture.image.play();
      }

      resolve(texture);
    });
  });
};

export { loadVideoTexture };
