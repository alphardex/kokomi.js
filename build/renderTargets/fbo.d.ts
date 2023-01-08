import * as THREE from "three";
import type { Base } from "../base/base";
import { Component } from "../components/component";
export interface FBOConfig {
    width: number;
    height: number;
    samples: number;
}
declare class FBO extends Component {
    rt: THREE.WebGLRenderTarget;
    constructor(base: Base, config?: Partial<FBOConfig>);
}
export { FBO };
