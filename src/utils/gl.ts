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
  bufferAttribute: THREE.BufferAttribute
) => {
  const vectors = Array.from(
    { length: bufferAttribute.array.length / 3 },
    (v, k) => new THREE.Vector3().fromBufferAttribute(bufferAttribute, k)
  );
  return vectors;
};

export { makeBuffer, iterateBuffer, convertBufferAttributeToVector };
