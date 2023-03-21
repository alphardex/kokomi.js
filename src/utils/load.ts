import * as THREE from "three";
import {
  GLTF,
  GLTFLoader,
  DRACOLoader,
  FBXLoader,
  RGBELoader,
} from "three-stdlib";

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

export interface LoadGLTFConfig {
  useDraco: boolean | string;
}

let dracoLoader: DRACOLoader | null = null;

// 加载GLTF模型
const loadGLTF = (
  path: string,
  config: Partial<LoadGLTFConfig> = {}
): Promise<GLTF | null> => {
  const { useDraco = true } = config;

  return new Promise((resolve) => {
    const loader = new GLTFLoader();

    if (useDraco) {
      dracoLoader = new DRACOLoader();
      dracoLoader.setDecoderPath(
        typeof useDraco === "string"
          ? useDraco
          : "https://www.gstatic.com/draco/versioned/decoders/1.4.3/"
      );
      loader.setDRACOLoader(dracoLoader);
    }

    loader.load(
      path,
      (file) => {
        resolve(file);
      },
      () => {},
      () => {
        resolve(null);
      }
    );
  });
};

// 加载FBX模型
const loadFBX = (path: string): Promise<THREE.Group | null> => {
  return new Promise((resolve) => {
    const loader = new FBXLoader();

    loader.load(
      path,
      (file) => {
        resolve(file);
      },
      () => {},
      () => {
        resolve(null);
      }
    );
  });
};

// 加载HDR
const loadHDR = (path: string): Promise<THREE.DataTexture | null> => {
  return new Promise((resolve) => {
    const loader = new RGBELoader();

    loader.load(
      path,
      (file) => {
        resolve(file);
      },
      () => {},
      () => {
        resolve(null);
      }
    );
  });
};

export { loadVideoTexture, loadGLTF, loadFBX, loadHDR };
