import * as THREE from "three";
declare const calcObjectPosition: (objectPos: THREE.Vector3, camera: THREE.Camera) => THREE.Vector2;
declare const isObjectBehindCamera: (objectPos: THREE.Vector3, camera: THREE.Camera) => boolean;
declare const isObjectVisible: (elPos: THREE.Vector3, camera: THREE.Camera, raycaster: THREE.Raycaster, occlude: THREE.Object3D[]) => boolean;
declare const objectZIndex: (objectPos: THREE.Vector3, camera: THREE.Camera, zIndexRange?: number[]) => number | undefined;
export { calcObjectPosition, isObjectBehindCamera, isObjectVisible, objectZIndex, };
