import * as kokomi from "kokomi.js";
import * as THREE from "three";
import gsap from "gsap";
import * as dat from "lil";

class Sketch extends kokomi.Base {
  async create() {
    this.camera.position.set(0, 0, 3);

    new kokomi.OrbitControls(this);

    const font = await kokomi.loadFont();

    const t3d = new kokomi.Text3D(
      this,
      "kokomi",
      font,
      {
        size: 0.5,
        height: 0.2,
        curveSegments: 120,
        bevelEnabled: true,
        bevelThickness: 0.03,
        bevelSize: 0.02,
        bevelOffset: 0,
        bevelSegments: 5,
      },
      {
        baseMaterial: new THREE.ShaderMaterial(),
        vertexShader,
        fragmentShader,
        materialParams: {
          side: THREE.DoubleSide,
        },
      }
    );
    t3d.mesh.geometry.center();
    t3d.addExisting();
  }
}
