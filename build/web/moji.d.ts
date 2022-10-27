import * as THREE from "three";
import { Scroller } from "maku.js";
import type { Base } from "../base/base";
import { Component } from "../components/component";
import { UniformInjector } from "../components/uniformInjector";
import { AllMaterialParams } from "../lib/customShaderMaterial/vanilla";
import { TextMesh } from "../shapes";
export interface MojiConfig {
    elList: HTMLElement[];
    vertexShader: string;
    fragmentShader: string;
    uniforms: {
        [uniform: string]: THREE.IUniform<any>;
    };
    textMeshConfig: any;
    isScrollPositionSync: boolean;
    scroller: Scroller;
    materialParams: AllMaterialParams;
}
/**
 * An encapsuled class to sync `kokomi.TextMesh` with DOM.
 */
declare class Moji {
    el: HTMLElement;
    textMesh: TextMesh;
    rect: DOMRect;
    constructor(el: HTMLElement, textMesh: TextMesh);
    setPosition(deltaY?: number): void;
}
/**
 * An encapsuled class to sync multiple `kokomi.TextMesh` with DOM.
 */
declare class MojiGroup extends Component {
    elList: HTMLElement[];
    vertexShader: string;
    fragmentShader: string;
    uniforms: {
        [uniform: string]: THREE.IUniform<any>;
    };
    textMeshConfig: any;
    isScrollPositionSync: boolean;
    textMeshMaterial: THREE.ShaderMaterial | null;
    mojis: Moji[];
    scroller: Scroller | null;
    uniformInjector: UniformInjector;
    materialParams: AllMaterialParams;
    useSelfScroller: boolean;
    constructor(base: Base, config?: Partial<MojiConfig>);
    addExisting(): void;
    update(): void;
}
export { Moji, MojiGroup };
