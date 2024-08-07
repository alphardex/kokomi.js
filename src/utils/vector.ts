import * as THREE from "three";

const v1 = new THREE.Vector3();
const v2 = new THREE.Vector3();
const v3 = new THREE.Vector3();
const v4 = new THREE.Vector2();

const calcObjectPosition = (el: THREE.Object3D, camera: THREE.Camera) => {
  const objectPos = v1.setFromMatrixPosition(el.matrixWorld);
  objectPos.project(camera);
  const widthHalf = window.innerWidth / 2;
  const heightHalf = window.innerHeight / 2;
  const x = objectPos.x * widthHalf + widthHalf;
  const y = -(objectPos.y * heightHalf) + heightHalf;
  const pos = new THREE.Vector2(x, y);
  return pos;
};

const isObjectBehindCamera = (el: THREE.Object3D, camera: THREE.Camera) => {
  const objectPos = v1.setFromMatrixPosition(el.matrixWorld);
  const cameraPos = v2.setFromMatrixPosition(camera.matrixWorld);
  const deltaCamObj = objectPos.sub(cameraPos);
  const camDir = camera.getWorldDirection(v3);
  return deltaCamObj.angleTo(camDir) > Math.PI / 2;
};

const isObjectVisible = (
  el: THREE.Object3D,
  camera: THREE.Camera,
  raycaster: THREE.Raycaster,
  occlude: THREE.Object3D[]
) => {
  const elPos = v1.setFromMatrixPosition(el.matrixWorld);
  const screenPos = elPos.clone();
  screenPos.project(camera);
  v4.set(screenPos.x, screenPos.y);
  raycaster.setFromCamera(v4, camera);
  const intersects = raycaster.intersectObjects(occlude, true);
  if (intersects.length) {
    const intersectionDistance = intersects[0].distance;
    const pointDistance = elPos.distanceTo(raycaster.ray.origin);
    return pointDistance < intersectionDistance;
  }
  return true;
};

const objectZIndex = (
  el: THREE.Object3D,
  camera: THREE.Camera,
  zIndexRange = [16777271, 0]
) => {
  if (
    camera instanceof THREE.PerspectiveCamera ||
    camera instanceof THREE.OrthographicCamera
  ) {
    const objectPos = v1.setFromMatrixPosition(el.matrixWorld);
    const cameraPos = v2.setFromMatrixPosition(camera.matrixWorld);
    const dist = objectPos.distanceTo(cameraPos);
    const A = (zIndexRange[1] - zIndexRange[0]) / (camera.far - camera.near);
    const B = zIndexRange[1] - A * camera.far;
    return Math.round(A * dist + B);
  }
  return undefined;
};

const objectScale = (el: THREE.Object3D, camera: THREE.Camera) => {
  if (camera instanceof THREE.OrthographicCamera) {
    return camera.zoom;
  } else if (camera instanceof THREE.PerspectiveCamera) {
    const objectPos = v1.setFromMatrixPosition(el.matrixWorld);
    const cameraPos = v2.setFromMatrixPosition(camera.matrixWorld);
    const vFOV = (camera.fov * Math.PI) / 180;
    const dist = objectPos.distanceTo(cameraPos);
    const scaleFOV = 2 * Math.tan(vFOV / 2) * dist;
    return 1 / scaleFOV;
  } else {
    return 1;
  }
};

const calcTransformFov = (camera: THREE.Camera) => {
  const heightHalf = window.innerHeight / 2;
  const fov = camera.projectionMatrix.elements[5] * heightHalf;
  return fov;
};

const epsilon = (value: number) => (Math.abs(value) < 1e-10 ? 0 : value);

const getCSSMatrix = (
  matrix: THREE.Matrix4,
  multipliers: number[],
  prepend = ""
) => {
  let matrix3d = "matrix3d(";
  for (let i = 0; i !== 16; i++) {
    matrix3d +=
      epsilon(multipliers[i] * matrix.elements[i]) + (i !== 15 ? "," : ")");
  }
  return prepend + matrix3d;
};

const getCameraCSSMatrix = ((multipliers) => {
  return (matrix: THREE.Matrix4) => getCSSMatrix(matrix, multipliers);
})([1, -1, 1, 1, 1, -1, 1, 1, 1, -1, 1, 1, 1, -1, 1, 1]);

const getObjectCSSMatrix = ((scaleMultipliers) => {
  return (matrix: THREE.Matrix4, factor: number) =>
    getCSSMatrix(matrix, scaleMultipliers(factor), "translate(-50%,-50%)");
})((f: number) => [
  1 / f,
  1 / f,
  1 / f,
  1,
  -1 / f,
  -1 / f,
  -1 / f,
  -1,
  1 / f,
  1 / f,
  1 / f,
  1,
  1,
  1,
  1,
  1,
]);

export {
  calcObjectPosition,
  isObjectBehindCamera,
  isObjectVisible,
  objectZIndex,
  objectScale,
  calcTransformFov,
  epsilon,
  getCSSMatrix,
  getCameraCSSMatrix,
  getObjectCSSMatrix,
};
