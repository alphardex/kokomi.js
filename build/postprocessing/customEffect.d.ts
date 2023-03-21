import * as THREE from "three";
import { EffectComposer, ShaderPass } from "three-stdlib";
import type { Base } from "../base/base";
import { Component } from "../components/component";
import { UniformInjector } from "../components/uniformInjector";
export interface CustomEffectConfig {
    vertexShader: string;
    fragmentShader: string;
    uniforms: {
        [uniform: string]: THREE.IUniform<any>;
    };
}
/**
 * With this, you can just provide your vertex and fragment shader to make a customized postprocessing effect.
 *
 * Demo: https://kokomi-playground.vercel.app/entries/#volumetricLight
 */
declare class CustomEffect extends Component {
    composer: EffectComposer;
    customPass: ShaderPass;
    uniformInjector: UniformInjector;
    constructor(base: Base, config?: Partial<CustomEffectConfig>);
    addExisting(): void;
    update(time: number): void;
}
export { CustomEffect };
