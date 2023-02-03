import * as THREE from "three";

/**
 * Credit: https://github.com/Sean-Bradley/Bender
 */
class Bender {
  bend(geometry: THREE.BufferGeometry, axis: string, angle: number) {
    let theta = 0;
    if (angle !== 0) {
      // @ts-ignore
      const v = geometry.attributes.position.array;
      for (let i = 0; i < v.length; i += 3) {
        let x = v[i];
        let y = v[i + 1];
        let z = v[i + 2];

        switch (axis) {
          case "x":
            theta = z * angle;
            break;
          case "y":
            theta = x * angle;
            break;
          default: //z
            theta = x * angle;
            break;
        }

        let sinTheta = Math.sin(theta);
        let cosTheta = Math.cos(theta);

        switch (axis) {
          case "x":
            (v as any)[i] = x;
            (v as any)[i + 1] = (y - 1.0 / angle) * cosTheta + 1.0 / angle;
            (v as any)[i + 2] = -(y - 1.0 / angle) * sinTheta;
            break;
          case "y":
            (v as any)[i] = -(z - 1.0 / angle) * sinTheta;
            (v as any)[i + 1] = y;
            (v as any)[i + 2] = (z - 1.0 / angle) * cosTheta + 1.0 / angle;
            break;
          default: //z
            (v as any)[i] = -(y - 1.0 / angle) * sinTheta;
            (v as any)[i + 1] = (y - 1.0 / angle) * cosTheta + 1.0 / angle;
            (v as any)[i + 2] = z;
            break;
        }
      }
      geometry.attributes.position.needsUpdate = true;
    }
  }
}

export { Bender };
