import * as THREE from "three";

import { Component } from "../components/component";
import { Base } from "../base/base";

import { Center } from "../components/center";
import { ContactShadows } from "../shadows";

export interface PresetItem {
  main: number[];
  fill: number[];
}

const presets: Record<string, PresetItem> = {
  rembrandt: {
    main: [1, 2, 1],
    fill: [-2, -0.5, -2],
  },
  portrait: {
    main: [-1, 2, 0.5],
    fill: [-1, 0.5, -1.5],
  },
  upfront: {
    main: [0, 2, 1],
    fill: [-1, 0.5, -1.5],
  },
  soft: {
    main: [-2, 4, 4],
    fill: [-1, 0.5, -1.5],
  },
};

export interface StageConfig {
  preset?:
    | "rembrandt"
    | "portrait"
    | "upfront"
    | "soft"
    | {
        main: [x: number, y: number, z: number];
        fill: [x: number, y: number, z: number];
      };
  shadow?: boolean | "contact";
  intensity?: number;
}

class Stage extends Component {
  group: THREE.Group;
  center: Center;
  shadow: boolean | "contact";
  presetData: PresetItem;
  ambientLight: THREE.AmbientLight;
  spotLight: THREE.SpotLight;
  pointLight: THREE.PointLight;
  contactShadows?: ContactShadows | null;
  constructor(base: Base, config: Partial<StageConfig> = {}) {
    super(base);

    const {
      preset = "rembrandt",
      shadow = "contact",
      intensity = 0.5,
    } = config;

    this.shadow = shadow;

    const group = new THREE.Group();
    this.group = group;

    const center = new Center(this.base);
    this.center = center;

    const presetData = typeof preset === "string" ? presets[preset] : preset;
    this.presetData = presetData;

    const ambientLight = new THREE.AmbientLight(0xffffff, intensity / 3);
    this.ambientLight = ambientLight;

    const spotLight = new THREE.SpotLight(
      0xffffff,
      intensity * 2,
      0,
      Math.PI / 3,
      1
    );
    this.spotLight = spotLight;
    this.spotLight.castShadow = !!shadow;
    this.spotLight.shadow.bias = -0.0001;
    this.spotLight.shadow.mapSize.set(1024, 1024);

    const pointLight = new THREE.PointLight(0xffffff, intensity);
    this.pointLight = pointLight;

    this.adjustAll();
  }
  addExisting(): void {
    this.container.add(this.ambientLight);
    this.container.add(this.spotLight);
    this.container.add(this.pointLight);

    this.container.add(this.group);

    this.center.addExisting();
    this.center.add(this.group);

    this.adjustAll();
  }
  add(...object: THREE.Object3D[]) {
    this.group.add(...object);

    this.adjustAll();
  }
  adjustAll() {
    this.adjustLightPositions();
    this.adjustShadow();
  }
  adjustLightPositions() {
    const { presetData } = this;

    this.center.adjustPosition();
    const bound = this.center.bound!;
    const { boundingSphere, height } = bound;
    const { radius } = boundingSphere;

    this.spotLight.position.set(
      presetData.main[0] * radius,
      presetData.main[1] * radius,
      presetData.main[2] * radius
    );

    this.pointLight.position.set(
      presetData.fill[0] * radius,
      presetData.fill[1] * radius,
      presetData.fill[2] * radius
    );
  }
  adjustShadow() {
    this.center.adjustPosition();
    const bound = this.center.bound!;
    const { boundingSphere, height } = bound;
    const { radius } = boundingSphere;

    if (this.shadow === "contact") {
      if (this.contactShadows) {
        this.contactShadows.group.clear();
        this.contactShadows = null;
      }
      const contactShadows = new ContactShadows(this.base, {
        scale: radius * 4,
        far: radius,
        blur: 2,
      });
      this.contactShadows = contactShadows;
      this.contactShadows.group.position.set(0, -height / 2, 0);
      this.contactShadows.addExisting();
    }
  }
}

export { Stage };
