import * as THREE from "three";

import type { Base } from "../base/base";
import { Component } from "../components/component";

import { BlurPass } from "../lib/other/BlurPass";
import { MeshReflectorMaterialImpl } from "../lib/other/MeshReflectorMaterial";

export interface MeshReflectorMaterialConfig {
  resolution: number;
  mixBlur: number;
  mixStrength: number;
  blur: [number, number] | number;
  mirror: number;
  ignoreObjects: THREE.Object3D[];
}

/**
 * A material for reflection, which has blur support.
 */
class MeshReflectorMaterial extends Component {
  parent: THREE.Mesh;
  material: MeshReflectorMaterialImpl;
  virtualCamera: THREE.PerspectiveCamera;
  fbo1: THREE.WebGLRenderTarget;
  fbo2: THREE.WebGLRenderTarget;
  blurpass: BlurPass;
  hasBlur: boolean;
  ignoreObjects: THREE.Object3D[];
  beforeRender: () => void;
  constructor(
    base: Base,
    parent: THREE.Mesh,
    config: Partial<MeshReflectorMaterialConfig> = {}
  ) {
    super(base);

    this.parent = parent;

    let {
      resolution = 256,
      mixBlur = 0,
      mixStrength = 1,
      blur = [0, 0],
      mirror = 0,
      ignoreObjects = [],
    } = config;

    this.ignoreObjects = ignoreObjects;

    blur = Array.isArray(blur) ? blur : [blur, blur];
    const hasBlur = blur[0] + blur[1] > 0;
    this.hasBlur = hasBlur;

    const gl = this.base.renderer;

    // from kokomi.Reflector
    const scope = parent;

    const reflectorPlane = new THREE.Plane();
    const normal = new THREE.Vector3();
    const reflectorWorldPosition = new THREE.Vector3();
    const cameraWorldPosition = new THREE.Vector3();
    const rotationMatrix = new THREE.Matrix4();
    const lookAtPosition = new THREE.Vector3(0, 0, -1);
    const clipPlane = new THREE.Vector4();

    const view = new THREE.Vector3();
    const target = new THREE.Vector3();
    const q = new THREE.Vector4();

    const textureMatrix = new THREE.Matrix4();
    const virtualCamera = new THREE.PerspectiveCamera();

    this.virtualCamera = virtualCamera;

    const camera = this.base.camera;

    this.beforeRender = () => {
      reflectorWorldPosition.setFromMatrixPosition(scope.matrixWorld);
      cameraWorldPosition.setFromMatrixPosition(camera.matrixWorld);

      rotationMatrix.extractRotation(scope.matrixWorld);

      normal.set(0, 0, 1);
      normal.applyMatrix4(rotationMatrix);

      view.subVectors(reflectorWorldPosition, cameraWorldPosition);

      // Avoid rendering when reflector is facing away

      if (view.dot(normal) > 0) return;

      view.reflect(normal).negate();
      view.add(reflectorWorldPosition);

      rotationMatrix.extractRotation(camera.matrixWorld);

      lookAtPosition.set(0, 0, -1);
      lookAtPosition.applyMatrix4(rotationMatrix);
      lookAtPosition.add(cameraWorldPosition);

      target.subVectors(reflectorWorldPosition, lookAtPosition);
      target.reflect(normal).negate();
      target.add(reflectorWorldPosition);

      virtualCamera.position.copy(view);
      virtualCamera.up.set(0, 1, 0);
      virtualCamera.up.applyMatrix4(rotationMatrix);
      virtualCamera.up.reflect(normal);
      virtualCamera.lookAt(target);

      // @ts-ignore
      virtualCamera.far = camera.far; // Used in WebGLBackground

      virtualCamera.updateMatrixWorld();
      virtualCamera.projectionMatrix.copy(camera.projectionMatrix);

      // Update the texture matrix
      textureMatrix.set(
        0.5,
        0.0,
        0.0,
        0.5,
        0.0,
        0.5,
        0.0,
        0.5,
        0.0,
        0.0,
        0.5,
        0.5,
        0.0,
        0.0,
        0.0,
        1.0
      );
      textureMatrix.multiply(virtualCamera.projectionMatrix);
      textureMatrix.multiply(virtualCamera.matrixWorldInverse);
      textureMatrix.multiply(scope.matrixWorld);

      // Now update projection matrix with new clip plane, implementing code from: http://www.terathon.com/code/oblique.html
      // Paper explaining this technique: http://www.terathon.com/lengyel/Lengyel-Oblique.pdf
      reflectorPlane.setFromNormalAndCoplanarPoint(
        normal,
        reflectorWorldPosition
      );
      reflectorPlane.applyMatrix4(virtualCamera.matrixWorldInverse);

      clipPlane.set(
        reflectorPlane.normal.x,
        reflectorPlane.normal.y,
        reflectorPlane.normal.z,
        reflectorPlane.constant
      );

      const projectionMatrix = virtualCamera.projectionMatrix;

      q.x =
        (Math.sign(clipPlane.x) + projectionMatrix.elements[8]) /
        projectionMatrix.elements[0];
      q.y =
        (Math.sign(clipPlane.y) + projectionMatrix.elements[9]) /
        projectionMatrix.elements[5];
      q.z = -1.0;
      q.w =
        (1.0 + projectionMatrix.elements[10]) / projectionMatrix.elements[14];

      // Calculate the scaled plane vector
      clipPlane.multiplyScalar(2.0 / clipPlane.dot(q));

      // Replacing the third row of the projection matrix
      projectionMatrix.elements[2] = clipPlane.x;
      projectionMatrix.elements[6] = clipPlane.y;
      projectionMatrix.elements[10] = clipPlane.z + 1.0;
      projectionMatrix.elements[14] = clipPlane.w;
    };

    // init material
    const parameters = {
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
      type: THREE.HalfFloatType,
    };
    const fbo1 = new THREE.WebGLRenderTarget(
      resolution,
      resolution,
      parameters
    );
    fbo1.depthBuffer = true;
    fbo1.depthTexture = new THREE.DepthTexture(resolution, resolution);
    fbo1.depthTexture.format = THREE.DepthFormat;
    fbo1.depthTexture.type = THREE.UnsignedShortType;
    const fbo2 = new THREE.WebGLRenderTarget(
      resolution,
      resolution,
      parameters
    );
    const blurpass = new BlurPass({
      gl,
      resolution,
      width: blur[0],
      height: blur[1],
    });
    const reflectorProps = {
      mirror,
      textureMatrix,
      mixBlur,
      tDiffuse: fbo1.texture,
      tDepth: fbo1.depthTexture,
      tDiffuseBlur: fbo2.texture,
      hasBlur,
      mixStrength,
    };
    const defines = {
      "defines-USE_BLUR": hasBlur ? "" : undefined,
    };

    this.fbo1 = fbo1;
    this.fbo2 = fbo2;
    this.blurpass = blurpass;

    const material = new MeshReflectorMaterialImpl(reflectorProps);
    material.defines.USE_BLUR = defines["defines-USE_BLUR"];
    this.material = material;
  }
  update(time: number): void {
    const {
      parent,
      beforeRender,
      virtualCamera,
      fbo1,
      fbo2,
      blurpass,
      hasBlur,
      ignoreObjects,
    } = this;
    const gl = this.base.renderer;
    const scene = this.base.scene;

    parent.visible = false;

    ignoreObjects.forEach((item) => {
      item.visible = false;
    });

    const currentXrEnabled = gl.xr.enabled;
    const currentShadowAutoUpdate = gl.shadowMap.autoUpdate;
    beforeRender();
    gl.xr.enabled = false;
    gl.shadowMap.autoUpdate = false;
    gl.setRenderTarget(fbo1);
    gl.state.buffers.depth.setMask(true);
    if (!gl.autoClear) {
      gl.clear();
    }
    gl.render(scene, virtualCamera);
    if (hasBlur) {
      blurpass.render(gl, fbo1, fbo2);
    }
    gl.xr.enabled = currentXrEnabled;
    gl.shadowMap.autoUpdate = currentShadowAutoUpdate;

    parent.visible = true;

    ignoreObjects.forEach((item) => {
      item.visible = true;
    });

    gl.setRenderTarget(null);
  }
}

export { MeshReflectorMaterial };
