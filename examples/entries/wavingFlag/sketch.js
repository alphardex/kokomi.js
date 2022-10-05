import * as kokomi from "kokomi.js";
import * as THREE from "three";
import gsap from "gsap";
import * as dat from "lil";

class Sketch extends kokomi.Base {
  create() {
    this.camera.position.set(0, 0, 2);

    new kokomi.OrbitControls(this);

    const tex = new THREE.TextureLoader().load(
      "https://s2.loli.net/2022/09/28/dcmljXUH8oMKV7Q.jpg"
    );

    const cm = new kokomi.CustomMesh(this, {
      baseMaterial: new THREE.MeshLambertMaterial(),
      geometry: new THREE.PlaneGeometry(2.5, 1.65, 16, 16),
      vertexShader,
      fragmentShader,
      materialParams: {
        side: THREE.DoubleSide,
      },
      uniforms: {
        uTexture: {
          value: tex,
        },
        uFrequency: {
          value: new THREE.Vector2(5, 0),
        },
      },
    });
    cm.addExisting();

    const ambiLight = new THREE.AmbientLight(0xffffff, 0.4);
    this.scene.add(ambiLight);
    const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
    dirLight.position.set(1, 2, 3);
    this.scene.add(dirLight);
  }
}
