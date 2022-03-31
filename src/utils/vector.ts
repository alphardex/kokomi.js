import * as THREE from "three";

const getScreenVector = (worldVector: THREE.Vector3, camera: THREE.Camera) => {
  const vector = worldVector.clone();
  vector.project(camera);

  const widthHalf = window.innerWidth / 2;
  const heightHalf = window.innerHeight / 2;
  vector.x = vector.x * widthHalf + widthHalf;
  vector.y = -(vector.y * heightHalf) + heightHalf;
  vector.z = 0;

  return vector;
};

const isObjectBehindCamera = (
  objectPos: THREE.Vector3,
  camera: THREE.Camera
) => {
  const deltaCamObj = objectPos.sub(camera.position);
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

export { getScreenVector, isObjectBehindCamera, isObjectVisible };
