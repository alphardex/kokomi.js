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
}

export interface InfospotConfig {
  id: string;
  point: Vector3;
  name?: string;
  jump?: string;
  className?: string;
}

class PanoramaGenerator extends Component {
  config: PanoramaConfig;
  assetManager: AssetManager | null;
  viewer: Viewer | null;
  panoramas: ImagePanorama[];
  constructor(base: Base, config: PanoramaConfig) {
    super(base);

    this.config = config;
    this.assetManager = null;
    this.viewer = null;
    this.panoramas = [];
  }
  // 资源列表
  get resourceList() {
    return this.config.map((item) => ({
      name: item.name,
      type: "texture" as ResoureType,
      path: item.url,
    }));
  }
  // 通过配置获取信息点元素
  getInfospotElByConfig(config: InfospotConfig) {
    const className = config.className || `point-${config.id}`;
    const el = document.querySelector(`.${className}`) as HTMLElement;
    return el;
  }
  // 根据配置生成所有全景图
  generate(config = this.config) {
    const assetManager = new AssetManager(this.base, this.resourceList);
    this.assetManager = assetManager;

    this.assetManager.emitter.on("ready", () => {
      const viewer = new Viewer(this.base);
      this.viewer = viewer;

      const panoramas = config.map((item) => {
        // 全景图本体
        const image = this.assetManager!.items[item.name];
        const panorama = new ImagePanorama(this.base, image);
        (panorama as any).id = item.id;
        viewer.add(panorama);

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
            return html;
          });
          panorama.addGroup(points);
        }

        return panorama;
      });
      this.panoramas = panoramas;
      // 默认显示第一个全景图
      viewer.setPanorama(panoramas[0], 0);

      // 场景跳转
      config.forEach((item) => {
        if (item.infospots) {
          item.infospots.forEach((infospot) => {
            if (infospot.jump) {
              const targetPanorama = panoramas.find(
                (pa) => (pa as any).id === infospot.jump
              );
              if (targetPanorama) {
                const el = this.getInfospotElByConfig(infospot);
                el.addEventListener("click", () => {
                  viewer.setPanorama(targetPanorama);
                });
              }
            }
          });
        }
      });
    });
  }
}

export { PanoramaGenerator };
