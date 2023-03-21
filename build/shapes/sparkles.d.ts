import * as THREE from "three";
import type { Base } from "../base/base";
import { Component } from "../components/component";
import { UniformInjector } from "../components/uniformInjector";
export interface SparklesConfig {
    count: number;
    speed: number | Float32Array;
    opacity: number | Float32Array;
    color: THREE.ColorRepresentation | Float32Array;
    size: number | Float32Array;
    scale: number | [number, number, number] | THREE.Vector3;
    noise: number | [number, number, number] | THREE.Vector3 | Float32Array;
    blending: THREE.Blending;
}
declare class Sparkles extends Component {
    uj: UniformInjector;
    sparkles: THREE.Points;
    constructor(base: Base, config?: Partial<SparklesConfig>);
    addExisting(): void;
    update(time: number): void;
}
export { Sparkles };
