import * as THREE from "three";

const saturate = (value: number) => THREE.MathUtils.clamp(value, 0, 1);

export { saturate };
