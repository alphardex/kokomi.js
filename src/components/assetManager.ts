import * as THREE from "three";
import * as STDLIB from "three-stdlib";
import mitt, { type Emitter } from "mitt";

import { Component } from "./component";
import { Base } from "../base/base";

export type ResoureType = "gltfModel" | "texture" | "cubeTexture" | "font";

export interface ResourceItem {
  name: string;
  type: ResoureType;
  path: string | string[];
}

export type ResoureList = ResourceItem[];

interface Loaders {
  gltfLoader: STDLIB.GLTFLoader;
  textureLoader: THREE.TextureLoader;
  cubeTextureLoader: THREE.CubeTextureLoader;
  fontLoader: STDLIB.FontLoader;
}

export interface AssetManagerConfig {
  useDracoLoader: boolean;
  dracoDecoderPath: string;
}

class AssetManager extends Component {
  config: AssetManagerConfig;
  emitter: Emitter<any>;
  resourceList: ResoureList;
  items: any;
  toLoad: number;
  loaded: number;
  loaders: Partial<Loaders>;
  constructor(
    base: Base,
    list: ResoureList,
    config: Partial<AssetManagerConfig> = {}
  ) {
    super(base);

    const {
      useDracoLoader = false,
      dracoDecoderPath = "https://www.gstatic.com/draco/versioned/decoders/1.4.3/",
    } = config;
    this.config = { useDracoLoader, dracoDecoderPath };

    const emitter = mitt();
    this.emitter = emitter;

    this.resourceList = list;

    this.items = {};
    this.toLoad = list.length;
    this.loaded = 0;

    this.loaders = {};
    this.setLoaders();
    if (useDracoLoader) {
      this.setDracoLoader();
    }

    this.startLoading();
  }
  // 设置加载器
  setLoaders() {
    this.loaders.gltfLoader = new STDLIB.GLTFLoader();
    this.loaders.textureLoader = new THREE.TextureLoader();
    this.loaders.cubeTextureLoader = new THREE.CubeTextureLoader();
    this.loaders.fontLoader = new STDLIB.FontLoader();
  }
  // 设置draco加载器
  setDracoLoader() {
    const dracoLoader = new STDLIB.DRACOLoader();
    dracoLoader.setDecoderPath(this.config.dracoDecoderPath);
    this.loaders.gltfLoader?.setDRACOLoader(dracoLoader);
  }
  // 开始加载
  startLoading() {
    for (const resource of this.resourceList) {
      if (resource.type === "gltfModel") {
        this.loaders.gltfLoader?.load(resource.path as string, (file) => {
          this.resourceLoaded(resource, file);
        });
      } else if (resource.type === "texture") {
        this.loaders.textureLoader?.load(resource.path as string, (file) => {
          this.resourceLoaded(resource, file);
        });
      } else if (resource.type === "cubeTexture") {
        this.loaders.cubeTextureLoader?.load(
          resource.path as string[],
          (file) => {
            this.resourceLoaded(resource, file);
          }
        );
      } else if (resource.type === "font") {
        this.loaders.fontLoader?.load(resource.path as string, (file) => {
          this.resourceLoaded(resource, file);
        });
      }
    }
  }
  // 加载完单个素材
  resourceLoaded(resource: ResourceItem, file: any) {
    this.items[resource.name] = file;
    this.loaded += 1;
    if (this.isLoaded) {
      this.emitter.emit("ready");
    }
  }
  // 加载进度
  get loadProgress() {
    return this.loaded / this.toLoad;
  }
  // 是否加载完毕
  get isLoaded() {
    return this.loaded === this.toLoad;
  }
}

export { AssetManager };
