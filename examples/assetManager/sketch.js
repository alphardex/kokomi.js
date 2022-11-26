import * as kokomi from "kokomi.js";
import * as THREE from "three";
import gsap from "gsap";
import * as dat from "lil";

const resourceList = [
  {
    name: "foxModel",
    type: "gltfModel",
    path: "./Fox.glb",
  },
];

class Fox extends kokomi.Component {
  constructor(base) {
    super(base);

    this.gltf = this.base.am.items["foxModel"];

    const mixer = new THREE.AnimationMixer(this.gltf.scene);
    this.mixer = mixer;

    this.actions = {};
    this.setActions();
  }
  addExisting() {
    this.gltf.scene.scale.set(0.02, 0.02, 0.02);
    this.base.scene.add(this.gltf.scene);
  }
  update(time) {
    const delta = this.base.clock.deltaTime;
    this.mixer.update(delta);
  }
  setActions() {
    this.actions.idle = this.mixer.clipAction(this.gltf.animations[0]);
    this.actions.walk = this.mixer.clipAction(this.gltf.animations[1]);
    this.actions.run = this.mixer.clipAction(this.gltf.animations[2]);
  }
  playAction(name = "idle") {
    const prevAction = this.actions.current;
    const nextAction = this.actions[name];

    nextAction.reset();
    nextAction.play();
    if (prevAction) {
      nextAction.crossFadeFrom(prevAction, 1, true);
    }

    this.actions.current = nextAction;
  }
}

class Sketch extends kokomi.Base {
  create() {
    new kokomi.OrbitControls(this);

    this.camera.position.set(3, 3, 3);

    const am = new kokomi.AssetManager(this, resourceList);
    this.am = am;
    this.am.on("ready", () => {
      const fox = new Fox(this);
      fox.addExisting();
      fox.playAction("idle");

      const ambiLight = new THREE.AmbientLight(0xffffff, 0.3);
      this.scene.add(ambiLight);
      const dirLight = new THREE.DirectionalLight(0xffffff, 1.5);
      dirLight.position.set(1, 2, 3);
      this.scene.add(dirLight);
    });
  }
}
