import * as THREE from "three";

export interface Voxel {
  position: THREE.Vector3;
  color?: THREE.Color;
}

/**
 * A utility class to voxelize meshes or models.
 * Ref: https://tympanus.net/codrops/2023/03/28/turning-3d-models-to-voxel-art-with-three-js/
 */
class Voxelizer {
  raycaster: THREE.Raycaster;
  constructor() {
    const raycaster = new THREE.Raycaster();
    this.raycaster = raycaster;
  }
  isInsideMesh(
    pos: THREE.Vector3,
    mesh: THREE.Mesh,
    dir = new THREE.Vector3(0, -1, 0)
  ) {
    const { raycaster } = this;
    raycaster.set(pos, dir);
    const intersects = raycaster.intersectObject(mesh, false);
    return intersects.length % 2 === 1;
  }
  voxelizeMesh(
    mesh: THREE.Mesh,
    gridSize: number,
    dir = new THREE.Vector3(0, -1, 0),
    boundingBoxFunc?: (boundingBox: THREE.Box3) => void
  ) {
    let voxels = [];
    const boundingBox = new THREE.Box3().setFromObject(mesh);

    if (boundingBoxFunc) {
      boundingBoxFunc(boundingBox);
    }

    for (let i = boundingBox.min.x; i < boundingBox.max.x; i += gridSize) {
      for (let j = boundingBox.min.y; j < boundingBox.max.y; j += gridSize) {
        for (let k = boundingBox.min.z; k < boundingBox.max.z; k += gridSize) {
          const pos = new THREE.Vector3(i, j, k);
          if (this.isInsideMesh(pos, mesh, dir)) {
            voxels.push({
              position: pos,
            });
          }
        }
      }
    }
    return voxels;
  }
  voxelizeModel(
    scene: THREE.Group,
    gridSize: number,
    modelSize: number,
    dir = new THREE.Vector3(0, -1, 0),
    boundingBoxFunc?: (boundingBox: THREE.Box3) => void
  ) {
    let voxels: Voxel[] = [];
    let meshes: THREE.Mesh[] = [];
    scene.traverse((item) => {
      if ((item as THREE.Mesh).isMesh) {
        // @ts-ignore
        item.material.side = THREE.DoubleSide;
        // @ts-ignore
        meshes.push(item);
      }
    });

    let boundingBox = new THREE.Box3().setFromObject(scene);
    let center = new THREE.Vector3();
    boundingBox.getCenter(center);

    const size = boundingBox.getSize(new THREE.Vector3());
    const scaleFactor = modelSize / size.length();
    center = center.multiplyScalar(-scaleFactor);

    // scale model to the standard size and center it
    scene.scale.multiplyScalar(scaleFactor);
    scene.position.copy(center);

    boundingBox = new THREE.Box3().setFromObject(scene);

    if (boundingBoxFunc) {
      boundingBoxFunc(boundingBox);
    }

    for (let i = boundingBox.min.x; i < boundingBox.max.x; i += gridSize) {
      for (let j = boundingBox.min.y; j < boundingBox.max.y; j += gridSize) {
        for (let k = boundingBox.min.z; k < boundingBox.max.z; k += gridSize) {
          meshes.forEach((mesh) => {
            const pos = new THREE.Vector3(i, j, k);
            const color = new THREE.Color();
            // @ts-ignore
            const { h, s, l } = mesh.material.color.getHSL(color);
            color.setHSL(h, s, l);
            if (this.isInsideMesh(pos, mesh, dir)) {
              voxels.push({
                position: pos,
                color,
              });
            }
          });
        }
      }
    }
    return voxels;
  }
}

export { Voxelizer };
