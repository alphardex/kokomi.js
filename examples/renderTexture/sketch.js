import * as kokomi from "kokomi.js";
import * as THREE from "three";
import gsap from "gsap";
import * as dat from "lil";

class Sketch extends kokomi.Base {
  create() {
    this.camera.position.set(1, 1, 1);

    new kokomi.OrbitControls(this);

    // rt
    const rtScene = new THREE.Scene();

    rtScene.background = new THREE.Color("red");

    const rtCamera = this.camera;

    const rtBox = new kokomi.Box(this, {
      width: 0.5,
      height: 0.5,
      depth: 0.5,
    });
    rtScene.add(rtBox.mesh);

    this.update((time) => {
      rtBox.spin(time);
    });

    const rt = new kokomi.RenderTexture(this, {
      rtScene,
      rtCamera,
    });

    // shape
    const box = new kokomi.Box(this, {
      width: 0.5,
      height: 0.5,
      depth: 0.5,
    });
    box.addExisting();
    box.mesh.material.map = rt.texture;
  }
}
