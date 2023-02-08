import * as THREE from "three";

// 制作buffer
const makeBuffer = (count = 100, fn: any, dimension = 3) => {
  const buffer = Float32Array.from({ length: count * dimension }, (v, k) => {
    return fn(k);
  });
  return buffer;
};

// 迭代buffer
const iterateBuffer = (
  buffer: ArrayLike<number>,
  count: number,
  fn: any,
  dimension = 3
) => {
  for (let i = 0; i < count; i++) {
    const axis = i * dimension;
    const x = axis;
    const y = axis + 1;
    const z = axis + 2;
    const w = axis + 3;
    fn(buffer, { x, y, z, w }, i);
  }
};

// 将bufferAttribute转为向量
const convertBufferAttributeToVector = (
  bufferAttribute: THREE.BufferAttribute | THREE.InterleavedBufferAttribute,
  dimension = 3
) => {
  const vectorDimensionMap = {
    2: new THREE.Vector2(),
    3: new THREE.Vector3(),
    4: new THREE.Vector4(),
  };
  const vectors = Array.from(
    { length: bufferAttribute.array.length / dimension },
    (v, k) => {
      const vector = (vectorDimensionMap as any)[dimension].clone();
      return vector.fromBufferAttribute(bufferAttribute, k);
    }
  );
  return vectors;
};

const isVector = (v: any): v is THREE.Vector2 | THREE.Vector3 | THREE.Vector4 =>
  v instanceof THREE.Vector2 ||
  v instanceof THREE.Vector3 ||
  v instanceof THREE.Vector4;

const normalizeVector = (v: any): number[] => {
  if (Array.isArray(v)) return v;
  else if (isVector(v)) return v.toArray();
  return [v, v, v] as number[];
};

const isFloat32Array = (def: any): def is Float32Array =>
  def && (def as Float32Array).constructor === Float32Array;

const expandColor = (v: THREE.Color) => [v.r, v.g, v.b];

const usePropAsIsOrAsAttribute = <T extends any>(
  count: number,
  prop: T | Float32Array,
  setDefault?: (v: T) => number
) => {
  if (prop !== undefined) {
    if (isFloat32Array(prop)) {
      return prop as Float32Array;
    } else {
      if (prop instanceof THREE.Color) {
        const a = Array.from({ length: count * 3 }, () =>
          expandColor(prop)
        ).flat();
        return Float32Array.from(a);
      } else if (isVector(prop) || Array.isArray(prop)) {
        const a = Array.from({ length: count * 3 }, () =>
          normalizeVector(prop)
        ).flat();
        return Float32Array.from(a);
      }
      return Float32Array.from({ length: count }, () => prop as number);
    }
  }
  return Float32Array.from({ length: count }, setDefault!);
};

export {
  makeBuffer,
  iterateBuffer,
  convertBufferAttributeToVector,
  isVector,
  normalizeVector,
  isFloat32Array,
  expandColor,
  usePropAsIsOrAsAttribute,
};
