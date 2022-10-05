import * as kokomi from "kokomi.js";
import * as THREE from "three";
import gsap from "gsap";
import * as dat from "lil";

class Sketch extends kokomi.Base {
  create() {
    this.camera.position.set(0, 0, 2);

    new kokomi.OrbitControls(this);

    // noise
    const cm = new kokomi.CustomMesh(this, {
      baseMaterial: new THREE.ShaderMaterial(),
      geometry: new THREE.SphereGeometry(1, 100, 100),
      vertexShader,
      fragmentShader,
      materialParams: {
        side: THREE.DoubleSide,
      },
    });

    // cube
    const cubeRt = new THREE.WebGLCubeRenderTarget(256);
    const cubeCamera = new THREE.CubeCamera(0.1, 10, cubeRt);
    const cubeScene = new THREE.Scene();
    cubeScene.add(cm.mesh);
    this.update(() => {
      cubeCamera.update(this.renderer, cubeScene);
    });

    // shape
    const cm2 = new kokomi.CustomMesh(this, {
      baseMaterial: new THREE.ShaderMaterial(),
      geometry: new THREE.SphereGeometry(1, 100, 100),
      vertexShader: vertexShader2,
      fragmentShader: fragmentShader2,
      materialParams: {
        side: THREE.DoubleSide,
      },
      uniforms: {
        uNoiseTexture: {
          value: null,
        },
        uVelocity: {
          value: 0.05,
        },
        uBrightness: {
          value: 0.33,
        },
        uStagger: {
          value: 16,
        },
      },
    });
    cm2.addExisting();
    this.update(() => {
      cm2.mesh.material.uniforms.uNoiseTexture.value = cubeRt.texture;
    });

    // ring
    const cm3 = new kokomi.CustomMesh(this, {
      baseMaterial: new THREE.ShaderMaterial(),
      geometry: new THREE.SphereGeometry(1.2, 100, 100),
      vertexShader: vertexShader3,
      fragmentShader: fragmentShader3,
      materialParams: {
        side: THREE.BackSide,
      },
    });
    cm3.addExisting();
  }
}
