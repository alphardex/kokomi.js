import * as kokomi from "kokomi.js";
import * as THREE from "three";
import gsap from "gsap";
import * as dat from "lil";

class Sketch extends kokomi.Base {
  create() {
    this.camera.position.set(0, 0, 3);

    new kokomi.OrbitControls(this);

    const cm = new kokomi.CustomMesh(this, {
      baseMaterial: new THREE.ShaderMaterial(),
      geometry: new kokomi.SphubeGeometry(400, 400),
      vertexShader,
      fragmentShader,
      uniforms: {
        uVelocity: {
          value: 0.3,
        },
        uAxis: {
          value: new THREE.Vector3(1, 0, 0),
        },
        uDistortion: {
          value: 3,
        },
        uColor: {
          value: new THREE.Color("#000000"),
        },
      },
    });
    cm.addExisting();

    const ambiLight = new THREE.AmbientLight(0xffffff, 0.4);
    this.scene.add(ambiLight);
    const dirLight = new THREE.DirectionalLight(0xffffff, 1.2);
    dirLight.position.set(1, 2, 3);
    this.scene.add(dirLight);
  }
}
