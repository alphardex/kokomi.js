import * as THREE from "three";
import * as STDLIB from "three-stdlib";
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
declare class CustomEffect extends Component {
    composer: STDLIB.EffectComposer;
    customPass: STDLIB.ShaderPass;
    uniformInjector: UniformInjector;
    constructor(base: Base, config?: Partial<CustomEffectConfig>);
    addExisting(): void;
    update(time: number): void;
}
export { CustomEffect };
