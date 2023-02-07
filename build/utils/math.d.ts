import * as THREE from "three";
declare const saturate: (value: number) => number;
declare const polySort: (pointObjs: THREE.Vector2[]) => {
    x: number;
    y: number;
}[];
declare const sample: (arr: any[]) => any;
declare const range: (start: number, end: number, step?: number) => Generator<number, void, unknown>;
export { saturate, polySort, sample, range };
