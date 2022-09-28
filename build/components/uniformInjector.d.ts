import * as THREE from "three";
import { Component } from "./component";
import { Base } from "../base/base";
declare class UniformInjector extends Component {
    shadertoyUniforms: {
        [key: string]: THREE.IUniform<any>;
    };
    constructor(base: Base);
    injectShadertoyUniforms(uniforms?: {
        [key: string]: THREE.IUniform<any>;
    }): void;
}
export { UniformInjector };
