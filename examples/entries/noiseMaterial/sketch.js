import * as kokomi from "kokomi.js";
import * as THREE from "three";
import gsap from "gsap";
import * as dat from "lil";

class Sketch extends kokomi.Base {
  create() {
    this.camera.position.set(0, 0, 2);

    new kokomi.OrbitControls(this);

    const cm = new kokomi.CustomMesh(this, {
      baseMaterial: new THREE.ShaderMaterial(),
      geometry: new THREE.BoxGeometry(1, 1, 1, 10, 10, 10),
      vertexShader,
      fragmentShader,
      materialParams: {
        side: THREE.DoubleSide,
      },
      uniforms: {
        uPerlinNoiseTexture: {
          value: new THREE.TextureLoader().load(
            "https://s2.loli.net/2022/08/17/HUqhRNvuCEmZrby.png"
          ),
        },
        uTransitionProgress: {
          value: 0,
        },
      },
    });
    cm.addExisting();

    // interaction
    let isOpen = false;

    this.interactionManager.add(cm.mesh);

    cm.mesh.addEventListener("click", () => {
      const material = cm.mesh.material;
      if (!isOpen) {
        gsap.to(material.uniforms.uTransitionProgress, {
          value: 1,
          duration: 1.2,
        });
        isOpen = true;
      } else {
        gsap.to(material.uniforms.uTransitionProgress, {
          value: 0,
          duration: 1.2,
        });
        isOpen = false;
      }
    });
  }
}
