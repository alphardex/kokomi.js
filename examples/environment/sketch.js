import * as kokomi from "kokomi.js";
import * as THREE from "three";
import gsap from "gsap";
import * as dat from "lil";

class Sketch extends kokomi.Base {
  create() {
    this.camera.position.set(0, 0, 5);

    new kokomi.OrbitControls(this);

    const sphere = new THREE.Mesh(
      new THREE.SphereGeometry(2, 64, 64),
      new THREE.MeshStandardMaterial({ color: new THREE.Color("orange") })
    );
    this.scene.add(sphere);

    const light = new THREE.AmbientLight(0xffffff, 0.8);
    this.scene.add(light);

    const env = new kokomi.Environment(this);
    // this.scene.background = env.texture;
    this.scene.environment = env.texture;
    const lf1 = new kokomi.LightFormer(this, {
      form: "ring",
      intensity: 50,
    });
    lf1.mesh.scale.setScalar(2);
    lf1.mesh.position.z = -2;
    env.add(lf1.mesh);
  }
}
