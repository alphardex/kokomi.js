import * as THREE from "three";
import { InteractionManager } from "three.interactive";
import type { EffectComposer } from "three-stdlib";
import {
  Animator,
  Clock,
  Physics,
  Resizer,
  IMouse,
  Keyboard,
} from "../components";
import { downloadBlob } from "../utils";

export interface BaseConfig {
  hello: boolean;
  gl: THREE.WebGLRendererParameters;
}

/**
 * By extending this class, you can kickstart a basic three.js scene easily.
 *
 * Demo: https://kokomi-js.vercel.app/examples/#base
 */
class Base {
  camera: THREE.PerspectiveCamera | THREE.OrthographicCamera;
  scene: THREE.Scene;
  renderer: THREE.WebGLRenderer;
  container: HTMLElement;
  animator: Animator;
  interactionManager: InteractionManager;
  composer: EffectComposer | null;
  clock: Clock;
  iMouse: IMouse;
  physics: Physics;
  resizer: Resizer;
  keyboard: Keyboard;
  constructor(sel = "#sketch", config: Partial<BaseConfig> = {}) {
    const { hello = true, gl = {} } = config;

    if (hello) {
      console.log(
        `%c- powered by kokomi.js -`,
        `padding: 5px 10px; background: #030A8C; font-size: 11px`
      );
    }

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

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      ...gl,
    });
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
      this.renderer.domElement
    );
    this.interactionManager = interactionManager;

    this.composer = null;

    const clock = new Clock(this);
    this.clock = clock;

    const iMouse = new IMouse(this);
    this.iMouse = iMouse;

    const physics = new Physics(this);
    this.physics = physics;

    const resizer = new Resizer(this);
    this.resizer = resizer;

    const keyboard = new Keyboard();
    this.keyboard = keyboard;

    this.init();

    this.addEventListeners();
  }
  addEventListeners() {
    // resize
    this.resizer.listenForResize();

    // mouse
    this.iMouse.listenForMouse();

    // keyboard
    this.keyboard.listenForKey();
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
  render() {
    if (this.composer) {
      this.composer.render();
    } else {
      this.renderer.render(this.scene, this.camera);
    }
  }
  async saveScreenshot(name = `screenshot.png`) {
    this.render();
    const blob: Blob | null = await new Promise((resolve) => {
      this.renderer.domElement.toBlob(resolve, "image/png");
    });
    if (blob) {
      downloadBlob(blob, name);
    }
  }
  destroy() {
    // scene
    this.scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.geometry?.dispose();

        Object.values(child.material).forEach((value: any) => {
          if (value && typeof value.dispose === "function") {
            value.dispose();
          }
        });
      }
    });

    // renderer
    this.renderer.dispose();
  }
}

export { Base };
