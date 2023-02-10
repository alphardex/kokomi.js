import * as kokomi from "kokomi.js";
import * as THREE from "three";
import gsap from "gsap";
import * as dat from "lil";

class Fox extends kokomi.Component {
  constructor(base) {
    super(base);

    this.gltf = this.base.am.items["foxModel"];

    this.animations = new kokomi.AnimationManager(
      this.base,
      this.gltf.animations,
      this.gltf.scene
    );
    this.currentAction = null;
  }
  addExisting() {
    this.gltf.scene.scale.set(0.02, 0.02, 0.02);
    this.base.scene.add(this.gltf.scene);
  }
  playAction(name) {
    if (this.currentAction) {
      this.currentAction.fadeOut(0.5);
    }
    const action = this.animations.actions[name];
    action.reset().fadeIn(0.5).play();
    this.currentAction = action;
  }
}

class Sketch extends kokomi.Base {
  create() {
    new kokomi.OrbitControls(this);

    this.camera.position.set(3, 3, 3);

    const am = new kokomi.AssetManager(this, [
      {
        name: "foxModel",
        type: "gltfModel",
        path: "./Fox.glb",
      },
    ]);
    this.am = am;
    this.am.on("ready", () => {
      document.querySelector(".loader-screen").classList.add("hollow");

      const ambiLight = new THREE.AmbientLight(0xffffff, 0.3);
      this.scene.add(ambiLight);
      const dirLight = new THREE.DirectionalLight(0xffffff, 1.5);
      dirLight.position.set(1, 2, 3);
      this.scene.add(dirLight);

      const fox = new Fox(this);
      fox.addExisting();
      fox.playAction("Survey");
    });
  }
}
