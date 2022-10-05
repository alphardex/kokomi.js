import * as kokomi from "kokomi.js";
import * as THREE from "three";
import gsap from "gsap";
import * as dat from "lil";

class Sketch extends kokomi.Base {
  create() {
    this.camera.position.set(0, 0, 2);

    new kokomi.OrbitControls(this);

    this.renderer.shadowMap.enabled = true;
    kokomi.enableRealisticRender(this.renderer);

    const cm = new kokomi.CustomMesh(this, {
      baseMaterial: new THREE.ShaderMaterial(),
      geometry: new THREE.SphereGeometry(0.5, 64, 64),
      vertexShader,
      fragmentShader,
      materialParams: {
        side: THREE.DoubleSide,
        lights: true,
      },
      uniforms: {
        ...THREE.UniformsLib.lights,
        ...{
          uColor: {
            value: new THREE.Color("#6495ed"),
          },
          uGlossiness: {
            value: 4,
          },
        },
      },
    });
    cm.addExisting();

    const ambiLight = new THREE.AmbientLight(0xffffff, 1);
    this.scene.add(ambiLight);
    const dirLight = new THREE.DirectionalLight(0xffffff, 0.5);
    dirLight.position.set(4, 4, 4);
    dirLight.castShadow = true;
    this.scene.add(dirLight);
  }
}
