import * as THREE from "three";

import type { Base } from "../base/base";
import { Component } from "../components/component";

import { mapNumberRange } from "../utils/math";

export interface PersistenceEffectConfig {
  clearColor: number;
  fadeFactor: number;
  fadeColor: THREE.Color;
  scaleX: number;
  scaleY: number;
  rotationAngle: number;
}

/**
 * A drop-in Persistence Effect
 *
 * Credit: https://tympanus.net/codrops/2021/12/28/adding-a-persistence-effect-to-three-js-scenes/
 */
class PersistenceEffect extends Component {
  isActive: boolean;
  clearColor: number;
  fadeFactor: number;
  fadeColor: THREE.Color;
  scaleX: number;
  scaleY: number;
  rotationAngle: number;
  orthoCamera: THREE.OrthographicCamera;
  uvMatrix: THREE.Matrix3;
  fadeMaterial: THREE.ShaderMaterial;
  fadePlane: THREE.Mesh;
  resultPlane: THREE.Mesh;
  framebuffer1: THREE.WebGLRenderTarget;
  framebuffer2: THREE.WebGLRenderTarget;
  constructor(base: Base, config: Partial<PersistenceEffectConfig> = {}) {
    super(base);

    this.isActive = false;

    const {
      clearColor = 0x111111,
      fadeFactor = 0.2,
      fadeColor = new THREE.Color("#000000"),
      scaleX = 0,
      scaleY = 0,
      rotationAngle = 0,
    } = config;
    this.clearColor = clearColor;
    this.fadeFactor = fadeFactor;
    this.fadeColor = fadeColor;
    this.scaleX = scaleX;
    this.scaleY = scaleY;
    this.rotationAngle = rotationAngle;

    const leftScreenBorder = -innerWidth / 2;
    const rightScreenBorder = innerWidth / 2;
    const topScreenBorder = -innerHeight / 2;
    const bottomScreenBorder = innerHeight / 2;
    const near = -100;
    const far = 100;
    const orthoCamera = new THREE.OrthographicCamera(
      leftScreenBorder,
      rightScreenBorder,
      topScreenBorder,
      bottomScreenBorder,
      near,
      far
    );
    orthoCamera.position.z = -10;
    orthoCamera.lookAt(new THREE.Vector3(0, 0, 0));
    this.orthoCamera = orthoCamera;

    const fullscreenQuadGeometry = new THREE.PlaneGeometry(
      innerWidth,
      innerHeight
    );

    const uvMatrix = new THREE.Matrix3();
    this.uvMatrix = uvMatrix;

    const fadeMaterial = new THREE.ShaderMaterial({
      uniforms: {
        inputTexture: { value: null },
        fadeFactor: { value: this.fadeFactor },
        fadeColor: { value: this.fadeColor },
        uvMatrix: { value: uvMatrix },
      },
      vertexShader: `
        uniform mat3 uvMatrix;
        varying vec2 vUv;
        void main () {
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          vUv = (uvMatrix * vec3(uv, 1.0)).xy;
        }
      `,
      fragmentShader: `
        uniform sampler2D inputTexture;
        uniform float fadeFactor;
        uniform vec3 fadeColor;
        varying vec2 vUv;
        void main () {
          vec4 texColor = texture2D(inputTexture, vUv);
          vec4 fadeColorWithAlpha = vec4(fadeColor, 1.0);
          gl_FragColor = mix(texColor, fadeColorWithAlpha, fadeFactor);
        }
      `,
    });
    this.fadeMaterial = fadeMaterial;

    // Create our fadePlane
    const fadePlane = new THREE.Mesh(fullscreenQuadGeometry, fadeMaterial);
    this.fadePlane = fadePlane;

    // create our resultPlane
    // Please notice we don't use fancy shader materials for resultPlane
    // We will use it simply to copy the contents of fadePlane to the device screen
    // So we can just use the .map property of THREE.MeshBasicMaterial
    const resultMaterial = new THREE.MeshBasicMaterial({ map: null });
    const resultPlane = new THREE.Mesh(fullscreenQuadGeometry, resultMaterial);
    this.resultPlane = resultPlane;

    // Create two extra framebuffers manually
    // It is important we use let instead of const variables,
    // as we will need to swap them as discussed in Step 4!
    const framebuffer1 = new THREE.WebGLRenderTarget(innerWidth, innerHeight);
    const framebuffer2 = new THREE.WebGLRenderTarget(innerWidth, innerHeight);
    this.framebuffer1 = framebuffer1;
    this.framebuffer2 = framebuffer2;
  }
  addExisting(): void {
    const { base } = this;
    const { renderer } = base;
    const { framebuffer1, framebuffer2 } = this;

    // Before we start using these framebuffers by rendering to them,
    // let's explicitly clear their pixel contents to #111111
    // If we don't do this, our persistence effect will end up wrong,
    // due to how accumulation between step 1 and 3 works.
    // The first frame will never fade out when we mix Framebuffer 1 to
    // Framebuffer 2 and will be always visible.
    // This bug is better observed, rather then explained, so please
    // make sure to comment out these lines and see the change for yourself.
    renderer.setClearColor(this.clearColor);
    renderer.setRenderTarget(framebuffer1);
    renderer.clearColor();
    renderer.setRenderTarget(framebuffer2);
    renderer.clearColor();

    this.enable();
  }
  enable() {
    this.isActive = true;
  }
  disable() {
    this.isActive = false;
  }
  update(time: number): void {
    if (!this.isActive) {
      return;
    }

    const { base } = this;
    const { renderer, scene, camera } = base;
    const { orthoCamera, uvMatrix, fadeMaterial, fadePlane, resultPlane } =
      this;
    const { framebuffer1, framebuffer2 } = this;

    renderer.autoClearColor = false;
    fadeMaterial.uniforms.inputTexture.value = framebuffer1.texture;
    fadeMaterial.uniforms.fadeFactor.value = this.fadeFactor;
    renderer.setRenderTarget(framebuffer2);
    renderer.render(fadePlane, orthoCamera);
    renderer.render(scene, camera);

    renderer.setRenderTarget(null);
    (resultPlane.material as THREE.MeshBasicMaterial).map =
      framebuffer2.texture;
    renderer.render(resultPlane, orthoCamera);

    const uvScaleX = mapNumberRange(this.scaleX, -1, 1, 1.05, 0.95);
    const uvScaleY = mapNumberRange(this.scaleY, -1, 1, 1.05, 0.95);
    const rotation = THREE.MathUtils.degToRad(this.rotationAngle);
    uvMatrix.setUvTransform(0, 0, uvScaleX, uvScaleY, rotation, 0.5, 0.5);

    const swap = framebuffer1;
    this.framebuffer1 = framebuffer2;
    this.framebuffer2 = swap;
  }
}

export { PersistenceEffect };
