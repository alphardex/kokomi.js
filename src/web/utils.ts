import * as THREE from "three";

const handleTextureProp = (
  el: HTMLImageElement | null,
  texture: THREE.Texture
) => {
  const wrapS = el?.getAttribute("wrap-s") || "repeat";
  const wrapT = el?.getAttribute("wrap-t") || "repeat";
  const minFilter = el?.getAttribute("min-filter") || "mipmap";
  const magFilter = el?.getAttribute("mag-filter") || "mipmap";
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
};

const loadTextureFromImg = (el: HTMLImageElement | null) => {
  if (!el) {
    return null;
  }
  const texture = new THREE.TextureLoader().load(el.src);
  handleTextureProp(el, texture);
  return texture;
};

const loadCubemapFromImgs = (
  el: HTMLImageElement | null,
  els: HTMLImageElement[]
) => {
  if (!el) {
    return null;
  }
  const texture = new THREE.CubeTextureLoader().load(
    els.map((item) => item.src)
  );
  handleTextureProp(el, texture);
  return texture;
};

const getUniformFromImg = (
  el: HTMLImageElement | null,
  name: string,
  parent: HTMLElement | null = null
) => {
  if (!el) {
    return {};
  }
  let texture = null;
  const type = el.getAttribute("type") || "2d";
  if (type === "2d") {
    texture = loadTextureFromImg(el);
  } else if (type === "cube") {
    const px = parent?.querySelector("[cube=px]") as HTMLImageElement;
    const nx = parent?.querySelector("[cube=nx]") as HTMLImageElement;
    const py = parent?.querySelector("[cube=py]") as HTMLImageElement;
    const ny = parent?.querySelector("[cube=ny]") as HTMLImageElement;
    const pz = parent?.querySelector("[cube=pz]") as HTMLImageElement;
    const nz = parent?.querySelector("[cube=nz]") as HTMLImageElement;
    texture = loadCubemapFromImgs(el, [px, nx, py, ny, pz, nz]);
  }
  const uniformName =
    {
      "2d": name,
      cube: `${name}Cube`,
    }[type] || name;
  const uniform = texture
    ? {
        [uniformName]: {
          value: texture,
        },
      }
    : {};
  return uniform;
};

export { loadTextureFromImg, loadCubemapFromImgs, getUniformFromImg };
