import * as kokomi from "kokomi.js";
import * as THREE from "three";
import gsap from "gsap";
import * as dat from "lil";

class Sketch extends kokomi.Base {
  create() {
    this.camera.position.set(0, 0, 1.3);

    new kokomi.OrbitControls(this);

    const cm = new kokomi.CustomMesh(this, {
      baseMaterial: new THREE.MeshBasicMaterial(),
      geometry: new THREE.SphereGeometry(1.5, 32, 32),
      vertexShader,
      fragmentShader,
      materialParams: {
        side: THREE.DoubleSide,
      },
    });
    cm.addExisting();

    const cm2 = new kokomi.CustomMesh(this, {
      baseMaterial: new THREE.ShaderMaterial(),
      geometry: new THREE.SphereGeometry(0.4, 32, 32),
      vertexShader: vertexShader2,
      fragmentShader: fragmentShader2,
      materialParams: {
        side: THREE.DoubleSide,
        transparent: true,
      },
      uniforms: {
        tCube: {
          value: null,
        },
      },
    });
    cm2.addExisting();

    const cubeRt = new THREE.WebGLCubeRenderTarget(256);
    const cubeCamera = new THREE.CubeCamera(0.1, 10, cubeRt);
    this.update(() => {
      cm2.mesh.visible = false;
      cubeCamera.update(this.renderer, this.scene);
      cm2.mesh.visible = true;
      cm2.mesh.material.uniforms.tCube.value = cubeRt.texture;
    });

    const customEffect = new kokomi.CustomEffect(this, {
      vertexShader: vertexShader3,
      fragmentShader: fragmentShader3,
    });
    customEffect.addExisting();
  }
}
