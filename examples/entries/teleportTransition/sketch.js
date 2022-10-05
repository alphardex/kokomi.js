import * as kokomi from "kokomi.js";
import * as THREE from "three";
import gsap from "gsap";
import * as dat from "lil";

class Sketch extends kokomi.Base {
  async create() {
    const screenQuad = new kokomi.ScreenQuad(this, {
      fragmentShader,
      uniforms: {
        iChannel0: {
          value: new THREE.TextureLoader().load(
            `https://s2.loli.net/2022/08/21/jhMUXFog8xRrOJN.jpg`
          ),
        },
        iChannel1: {
          value: new THREE.TextureLoader().load(
            `https://s2.loli.net/2022/08/21/zu41WJF6IXU8HlB.jpg`
          ),
        },
        uProgress: {
          value: 0.5,
        },
      },
    });
    screenQuad.addExisting();

    this.interactionManager.add(screenQuad.mesh);

    const doTransition = (mesh) => {
      gsap.to(mesh.material.uniforms.uProgress, {
        value: 1,
        duration: 3,
      });
    };

    const undoTransition = (mesh) => {
      gsap.to(mesh.material.uniforms.uProgress, {
        value: 0.5,
        duration: 3,
      });
    };

    screenQuad.mesh.addEventListener("click", () => {
      const progress = screenQuad.mesh.material.uniforms.uProgress.value;
      if (progress < 0.9) {
        doTransition(screenQuad.mesh);
      } else if (progress > 0.9) {
        undoTransition(screenQuad.mesh);
      }
    });
  }
}
