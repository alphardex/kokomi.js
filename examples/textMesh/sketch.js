import * as kokomi from "kokomi.js";
import * as THREE from "three";
import gsap from "gsap";
import * as dat from "lil";

class Sketch extends kokomi.Base {
  create() {
    this.camera.position.set(0, 0, 2);

    new kokomi.OrbitControls(this);

    const tm = new kokomi.TextMesh(this, "kokomi");
    tm.addExisting();

    tm.mesh.fontSize = 0.5;
    tm.mesh.color = "#ffffff";

    const mat = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      side: THREE.DoubleSide,
    });
    tm.mesh.material = mat;
  }
}
