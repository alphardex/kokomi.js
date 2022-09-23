import * as THREE from "three";
declare const makeBuffer: (count: number | undefined, fn: any, dimension?: number) => Float32Array;
declare const iterateBuffer: (buffer: ArrayLike<number>, count: number, fn: any, dimension?: number) => void;
declare const convertBufferAttributeToVector: (bufferAttribute: THREE.BufferAttribute | THREE.InterleavedBufferAttribute, dimension?: number) => any[];
export { makeBuffer, iterateBuffer, convertBufferAttributeToVector };
