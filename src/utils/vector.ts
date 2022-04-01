import * as THREE from "three";

const calcObjectPosition = (objectPos: THREE.Vector3, camera: THREE.Camera) => {
  const screenPos = objectPos.clone();
  screenPos.project(camera);
  const widthHalf = window.innerWidth / 2;
  const heightHalf = window.innerHeight / 2;
  const x = screenPos.x * widthHalf + widthHalf;
  const y = -(screenPos.y * heightHalf) + heightHalf;
  const pos = new THREE.Vector2(x, y);
  return pos;
};

const isObjectBehindCamera = (
  objectPos: THREE.Vector3,
  camera: THREE.Camera
) => {
  const deltaCamObj = objectPos.clone().sub(camera.position);
  const camDir = camera.getWorldDirection(new THREE.Vector3());
  return deltaCamObj.angleTo(camDir) > Math.PI / 2;
};

const isObjectVisible = (
  elPos: THREE.Vector3,
  camera: THREE.Camera,
  raycaster: THREE.Raycaster,
  occlude: THREE.Object3D[]
) => {
  const screenPos = elPos.clone();
  screenPos.project(camera);
  raycaster.setFromCamera(screenPos, camera);
  const intersects = raycaster.intersectObjects(occlude, true);
  if (intersects.length) {
    const intersectionDistance = intersects[0].distance;
    const pointDistance = elPos.distanceTo(raycaster.ray.origin);
    return pointDistance < intersectionDistance;
  }
  return true;
};

const objectZIndex = (
  objectPos: THREE.Vector3,
  camera: THREE.Camera,
  zIndexRange = [16777271, 0]
) => {
  if (
    camera instanceof THREE.PerspectiveCamera ||
    camera instanceof THREE.OrthographicCamera
  ) {
    const cameraPos = camera.position;
    const dist = objectPos.distanceTo(cameraPos);
    const A = (zIndexRange[1] - zIndexRange[0]) / (camera.far - camera.near);
    const B = zIndexRange[1] - A * camera.far;
    return Math.round(A * dist + B);
  }
  return undefined;
};

export {
  calcObjectPosition,
  isObjectBehindCamera,
  isObjectVisible,
  objectZIndex,
};
