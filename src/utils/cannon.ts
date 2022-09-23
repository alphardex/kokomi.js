import * as THREE from "three";
import * as CANNON from "cannon-es";
import * as STDLIB from "three-stdlib";

// 将three.js的geometry转化为cannon.js的shape
const convertGeometryToShape = (geometry: THREE.BufferGeometry) => {
  switch (geometry.type) {
    case "BoxGeometry":
    case "BoxBufferGeometry": {
      const {
        width = 1,
        height = 1,
        depth = 1,
      } = (geometry as THREE.BoxGeometry).parameters;

      const halfExtents = new CANNON.Vec3(width / 2, height / 2, depth / 2);
      return new CANNON.Box(halfExtents);
    }

    case "PlaneGeometry":
    case "PlaneBufferGeometry": {
      return new CANNON.Plane();
    }

    case "SphereGeometry":
    case "SphereBufferGeometry": {
      const { radius } = (geometry as THREE.SphereGeometry).parameters;
      return new CANNON.Sphere(radius);
    }

    case "CylinderGeometry":
    case "CylinderBufferGeometry": {
      const { radiusTop, radiusBottom, height, radialSegments } = (
        geometry as THREE.CylinderGeometry
      ).parameters;

      return new CANNON.Cylinder(
        radiusTop,
        radiusBottom,
        height,
        radialSegments
      );
    }

    default: {
      // Ref: https://github.com/pmndrs/cannon-es/issues/103#issuecomment-1002183975
      let geo = new THREE.BufferGeometry();
      geo.setAttribute("position", geometry.getAttribute("position"));

      geo = STDLIB.mergeVertices(geo);

      const position = geo.attributes.position.array;
      const index = geo.index!.array;

      const points = [];
      for (let i = 0; i < position.length; i += 3) {
        points.push(
          new CANNON.Vec3(position[i], position[i + 1], position[i + 2])
        );
      }
      const faces = [];
      for (let i = 0; i < index.length; i += 3) {
        faces.push([index[i], index[i + 1], index[i + 2]]);
      }

      return new CANNON.ConvexPolyhedron({ vertices: points, faces });
    }
  }
};

export { convertGeometryToShape };
