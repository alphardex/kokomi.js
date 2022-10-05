import * as kokomi from "kokomi.js";
import * as THREE from "three";
import gsap from "gsap";
import * as dat from "lil";

class Sketch extends kokomi.Base {
  create() {
    this.camera.position.set(0, 0, 1);

    const cm = new kokomi.CustomMesh(this, {
      baseMaterial: new THREE.ShaderMaterial(),
      geometry: new THREE.BoxGeometry(0.5, 0.5, 0.5, 10, 10, 10),
      vertexShader,
      fragmentShader,
      materialParams: {
        side: THREE.DoubleSide,
      },
      uniforms: {
        uColor1: {
          value: new THREE.Color("#f83600"),
        },
        uColor2: {
          value: new THREE.Color("#f9d423"),
        },
      },
    });
    cm.addExisting();

    this.update(() => {
      const t = this.clock.elapsedTime;
      cm.mesh.rotation.z = t / 10;
    });

    const customEffect = new kokomi.CustomEffect(this, {
      vertexShader: vertexShader2,
      fragmentShader: fragmentShader2,
    });
    customEffect.addExisting();
  }
}
