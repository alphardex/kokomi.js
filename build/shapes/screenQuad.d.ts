import * as THREE from "three";
import type { Base } from "../base/base";
import { Component } from "../components/component";
import { UniformInjector } from "../components/uniformInjector";
export interface PlaneConfig {
    vertexShader: string;
    fragmentShader: string;
    uniforms: {
        [uniform: string]: THREE.IUniform<any>;
    };
    shadertoyMode: boolean;
}
/**
 * A fullsceen plane with which you can create fullscreen effects such as raymarching.
 * By default, it has almost all the uniforms that [shadertoy](https://www.shadertoy.com/) has: `iTime`, `iResolution`, `iMouse`, etc
 * If you just want to run your shadertoy shader locally, you can turn on `shadertoyMode`, which will inject all the shadertoy uniforms into the fragment shader as well as `main()` function for three.js. Thus, you can just copy & paste your shadertoy shader and run!
 *
 * Demo: https://kokomi-js.vercel.app/examples/#screenQuad
 */
declare class ScreenQuad extends Component {
    material: THREE.ShaderMaterial;
    mesh: THREE.Mesh;
    uniformInjector: UniformInjector;
    constructor(base: Base, config?: Partial<PlaneConfig>);
    addExisting(): void;
    update(time: number): void;
}
export { ScreenQuad };
