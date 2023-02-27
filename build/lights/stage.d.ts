import * as THREE from "three";
import { Component } from "../components/component";
import { Base } from "../base/base";
import { Center } from "../components/center";
import { ContactShadows } from "../shadows";
export interface StageConfig {
    preset?: "rembrandt" | "portrait" | "upfront" | "soft" | {
        main: [x: number, y: number, z: number];
        fill: [x: number, y: number, z: number];
    };
    shadow?: boolean | "contact";
    intensity?: number;
}
declare class Stage extends Component {
    group: THREE.Group;
    center: Center;
    shadow: boolean | "contact";
    presetData: any;
    ambientLight: THREE.AmbientLight;
    spotLight: THREE.SpotLight;
    pointLight: THREE.PointLight;
    contactShadows?: ContactShadows | null;
    constructor(base: Base, config?: Partial<StageConfig>);
    addExisting(): void;
    add(...object: THREE.Object3D[]): void;
    adjustAll(): void;
    adjustLightPositions(): void;
    adjustShadow(): void;
}
export { Stage };
