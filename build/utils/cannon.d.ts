import * as THREE from "three";
import * as CANNON from "cannon-es";
declare const convertGeometryToShape: (geometry: THREE.BufferGeometry) => CANNON.Box | CANNON.Plane | CANNON.Sphere | CANNON.ConvexPolyhedron;
export { convertGeometryToShape };
