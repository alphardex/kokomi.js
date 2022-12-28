import * as THREE from "three";
declare const saturate: (value: number) => number;
declare const mapNumberRange: (val: number, inMin: number, inMax: number, outMin: number, outMax: number) => number;
declare const polySort: (pointObjs: THREE.Vector2[]) => {
    x: number;
    y: number;
}[];
declare const sample: (arr: any[]) => any;
export { saturate, mapNumberRange, polySort, sample };
