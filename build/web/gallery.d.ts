import * as THREE from "three";
import { MakuGroup, Scroller } from "maku.js";
import { HTMLIVCElement, MakuConfig } from "maku.js/types/types";
import type { Base } from "../base/base";
import { Component } from "../components/component";
export interface GalleryConfig {
    elList: HTMLIVCElement[];
    vertexShader: string;
    fragmentShader: string;
    uniforms: {
        [uniform: string]: THREE.IUniform<any>;
    };
    makuConfig: MakuConfig;
    isScrollPositionSync: boolean;
}
declare class Gallery extends Component {
    elList: HTMLIVCElement[];
    vertexShader: string;
    fragmentShader: string;
    uniforms: {
        [uniform: string]: THREE.IUniform<any>;
    };
    makuConfig: MakuConfig;
    isScrollPositionSync: boolean;
    makuMaterial: THREE.ShaderMaterial | null;
    makuGroup: MakuGroup | null;
    scroller: Scroller | null;
    constructor(base: Base, config?: Partial<GalleryConfig>);
    addExisting(): Promise<void>;
    update(time: number): void;
}
export { Gallery };
