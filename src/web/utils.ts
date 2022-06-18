import * as THREE from "three";

const loadTextureFromImg = (el: HTMLImageElement | null) => {
  if (!el) {
    return null;
  }
  const texture = new THREE.TextureLoader().load(el.src);
  const wrapS = el.getAttribute("wrap-s") || "repeat";
  const wrapT = el.getAttribute("wrap-t") || "repeat";
  const minFilter = el.getAttribute("min-filter") || "mipmap";
  const magFilter = el.getAttribute("mag-filter") || "mipmap";
  const wrapMap: Record<string, any> = {
    clamp: THREE.ClampToEdgeWrapping,
    repeat: THREE.RepeatWrapping,
  };
  const filterMap: Record<string, any> = {
    nearest: THREE.NearestFilter,
    linear: THREE.LinearFilter,
    mipmap: THREE.LinearMipMapLinearFilter,
  };
  texture.wrapS = wrapMap[wrapS];
  texture.wrapT = wrapMap[wrapT];
  texture.minFilter = filterMap[minFilter];
  texture.magFilter = filterMap[magFilter];
  return texture;
};

const getUniformFromImg = (el: HTMLImageElement | null, name: string) => {
  if (!el) {
    return {};
  }
  const texture = loadTextureFromImg(el);
  const uniform = texture
    ? {
        [name]: {
          value: texture,
        },
      }
    : {};
  return uniform;
};

export { loadTextureFromImg, getUniformFromImg };
