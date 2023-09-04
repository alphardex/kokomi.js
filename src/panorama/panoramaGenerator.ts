import * as THREE from "three";

import type { Base } from "../base/base";
import { Component } from "../components/component";

import { AssetManager, ResoureType } from "../components/assetManager";
import { Viewer } from "./viewer";
import { ImagePanorama } from "./imagePanorama";
import { Html } from "../web/html";

export interface Vector3 {
  x: number;
  y: number;
  z: number;
}

export type PanoramaConfig = SceneConfig[];

export interface SceneConfig {
  id: string;
  url: string;
  name: string;
  infospots?: InfospotConfig[];
  [key: string]: any;
}

export interface InfospotConfig {
  id: string;
  point: Vector3;
  name?: string;
  jump?: string;
  className?: string;
  [key: string]: any;
}

/**
 * Generate panoramas with config.
 */
class PanoramaGenerator extends Component {
  config: PanoramaConfig | null;
  assetManager: AssetManager | null;
  viewer: Viewer | null;
  panoramas: ImagePanorama[];
  isSceneJumpEnabled: boolean;
  constructor(base: Base, config: PanoramaConfig | null = null) {
    super(base);

    this.config = null;
    this.assetManager = null;
    this.viewer = null;
    this.panoramas = [];
    this.isSceneJumpEnabled = true;

    if (config) {
      this.setConfig(config);
    }
  }
  // 设置配置
  setConfig(config: PanoramaConfig) {
    this.config = config;
  }
  // 通过配置获取信息点元素
  getInfospotElByConfig(config: InfospotConfig) {
    const className = config.className || `point-${config.id}`;
    const el = document.querySelector(`.${className}`) as HTMLElement;
    return el;
  }
  // 加载素材并生成全景图
  generate() {
    const { config } = this;
    if (!config) {
      return;
    }

    const resourceList = config.map((item) => ({
      name: item.name,
      type: "texture" as ResoureType,
      path: item.url,
    }));

    const assetManager = new AssetManager(this.base, resourceList);
    this.assetManager = assetManager;

    this.assetManager.on("ready", () => {
      const viewer = new Viewer(this.base);
      this.viewer = viewer;

      // 全景图
      this.generatePanoramas();
      // 默认显示第一个全景图
      viewer.setPanorama(this.panoramas[0], 0);

      this.emit("generate", this);
    });
  }
  // 根据配置生成所有全景图
  generateByConfig(config: PanoramaConfig) {
    this.setConfig(config);
    this.generate();
  }
  // 生成全景图
  generatePanoramas() {
    const { config } = this;
    if (!config) {
      return;
    }
    const panoramas = config.map((item) => {
      // 全景图本体
      const image = this.assetManager?.items[item.name];
      const panorama = new ImagePanorama(this.base, image);
      panorama.id = item.id;
      const { viewer } = this;
      viewer?.add(panorama);
      return panorama;
    });
    this.panoramas = panoramas;
    return panoramas;
  }
  // 生成信息点
  generateInfospots() {
    const { config } = this;
    if (!config) {
      return;
    }
    config.forEach((item) => {
      // 信息点
      if (item.infospots) {
        const points = item.infospots.map((infospot) => {
          const el = this.getInfospotElByConfig(infospot);
          const html = new Html(
            this.base,
            el,
            new THREE.Vector3(
              infospot.point.x,
              infospot.point.y,
              infospot.point.z
            )
          );
          html.addExisting();
          return html;
        });
        const { panoramas } = this;
        const targetPanorama = panoramas.find((pa) => pa.id === item.id);
        if (targetPanorama) {
          targetPanorama.infospots = [];
          targetPanorama.addGroup(points);
        }
      }
    });
  }
  // 生成场景跳转
  generateSceneJump() {
    const { config } = this;
    if (!config) {
      return;
    }
    config.forEach((item) => {
      if (item.infospots) {
        item.infospots.forEach((infospot) => {
          if (infospot.jump) {
            const { panoramas, viewer } = this;
            const targetPanorama = panoramas.find(
              (pa) => pa.id === infospot.jump
            );
            if (targetPanorama) {
              const el = this.getInfospotElByConfig(infospot);
              el.onclick = () => {
                if (!this.isSceneJumpEnabled) {
                  return;
                }
                viewer?.setPanorama(targetPanorama);
                this.emit("jump", infospot.jump);
              };
            }
          } else {
            const el = this.getInfospotElByConfig(infospot);
            el.onclick = () => {
              if (!this.isSceneJumpEnabled) {
                return;
              }
            };
          }
        });
      }
    });
  }
  // 生成带跳转的信息点
  generateInfospotsWithSceneJump() {
    this.generateInfospots();
    this.generateSceneJump();
  }
  // 所有点的配置
  get allInfospotConfig(): InfospotConfig[] {
    if (!this.config) {
      return [];
    }
    return this.config
      .map((scene) => {
        if (!scene.infospots) {
          return [];
        }
        const infospots = scene.infospots?.map((infospot) => {
          return {
            id: infospot.id,
            name: infospot.name || infospot.id,
            point: infospot.point,
            jump: infospot.jump,
            className: infospot.className,
          };
        });
        return infospots;
      })
      .flat()
      .filter((item) => item);
  }
  // 输出当前场景的信息
  outputCurrentScenePosition() {
    this.viewer?.currentPanorama?.outputPosition();
    this.viewer?.currentPanorama?.on("click", (point: THREE.Vector3) => {
      this.emit("click-scene", point);
    });
  }
  // 允许跳转场景
  enableSceneJump() {
    this.isSceneJumpEnabled = true;
  }
  // 禁止跳转场景
  disableSceneJump() {
    this.isSceneJumpEnabled = false;
  }
}

export { PanoramaGenerator };
