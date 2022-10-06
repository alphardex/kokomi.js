import * as THREE from "three";

const saturate = (value: number) => THREE.MathUtils.clamp(value, 0, 1);

const mapNumberRange = (
  val: number,
  inMin: number,
  inMax: number,
  outMin: number,
  outMax: number
) => {
  return ((val - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
};

export { saturate, mapNumberRange };
