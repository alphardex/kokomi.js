import * as THREE from "three";
import { Animator } from "../components/animator";
import { InteractionManager } from "three.interactive";
import type { EffectComposer } from "three-stdlib";

class Base {
  camera: THREE.PerspectiveCamera;
  scene: THREE.Scene;
  renderer: THREE.WebGLRenderer;
  container: HTMLElement;
  animator: Animator;
  interactionManager: InteractionManager;
  composer: EffectComposer | null;
  constructor(sel = "#sketch") {
    const camera = new THREE.PerspectiveCamera(
      70,
      window.innerWidth / window.innerHeight,
      0.01,
      10
    );
    camera.position.z = 1;
    this.camera = camera;

    const scene = new THREE.Scene();
    this.scene = scene;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(2, window.devicePixelRatio));
    this.renderer = renderer;

    const container = document.querySelector(sel) as HTMLElement;
    container?.appendChild(renderer.domElement);
    this.container = container;

    const animator = new Animator(this);
    this.animator = animator;

    const interactionManager = new InteractionManager(
      this.renderer,
      this.camera,
      this.renderer.domElement,
      false
    );
    this.interactionManager = interactionManager;

    this.composer = null;

    this.init();

    window.addEventListener("resize", () => {
      this.onResize();
    });
  }
  animate(fn: any) {
    this.animator.add(fn);
  }
  init() {
    this.animate(() => {
      this.interactionManager.update();
    });

    this.animator.animate();
  }
  onResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(2, window.devicePixelRatio));
  }
}

export { Base };
