import * as THREE from "three";
import { MakuGroup, Scroller } from "maku.js";
import { HTMLIVCElement, MakuConfig } from "maku.js/types/types";
import type { Base } from "../base/base";
import { Component } from "../components/component";
import { UniformInjector } from "../components/uniformInjector";
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
/**
 * It's just an encapsuled class for [maku.js](https://github.com/alphardex/maku.js), which is a powerful bridge between HTML and WebGL.
 *
 * Demo: https://kokomi-playground.vercel.app/#imageMouseWave
 */
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
    uniformInjector: UniformInjector;
    constructor(base: Base, config?: Partial<GalleryConfig>);
    addExisting(): Promise<void>;
    update(time: number): void;
}
export { Gallery };
