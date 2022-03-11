import * as THREE from "three";
import { Animator } from "../components/animator";
import { InteractionManager } from "three.interactive";
import type { EffectComposer } from "three-stdlib";

class Base {
  camera: THREE.PerspectiveCamera | THREE.OrthographicCamera;
  scene: THREE.Scene;
  renderer: THREE.WebGLRenderer;
  container: HTMLElement;
  animator: Animator;
  interactionManager: InteractionManager;
  composer: EffectComposer | null;
  clock: THREE.Clock;
  constructor(sel = "#sketch") {
    const camera = new THREE.PerspectiveCamera(
      70,
      window.innerWidth / window.innerHeight,
      0.01,
      100
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

    const clock = new THREE.Clock();
    this.clock = clock;

    this.init();

    window.addEventListener("resize", () => {
      this.onResize();
    });
  }
  update(fn: any) {
    this.animator.add(fn);
  }
  init() {
    this.update(() => {
      this.interactionManager.update();
    });

    this.animator.update();
  }
  onResize() {
    if (this.camera instanceof THREE.PerspectiveCamera) {
      this.camera.aspect = this.aspect;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
      this.renderer.setPixelRatio(Math.min(2, window.devicePixelRatio));
    }
  }
  get aspect() {
    return window.innerWidth / window.innerHeight;
  }
}

export { Base };
