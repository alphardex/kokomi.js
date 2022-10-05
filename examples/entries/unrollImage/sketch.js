import * as kokomi from "kokomi.js";
import * as THREE from "three";
import gsap from "gsap";
import * as dat from "lil";

class Sketch extends kokomi.Base {
  async create() {
    const screenCamera = new kokomi.ScreenCamera(this);
    screenCamera.addExisting();

    const gallary = new kokomi.Gallery(this, {
      vertexShader,
      fragmentShader,
      makuConfig: {
        meshSizeType: "scale",
      },
      uniforms: {
        uProgress: {
          value: 0,
        },
        uAngle: {
          value: THREE.MathUtils.degToRad(15),
        },
      },
    });
    await gallary.addExisting();

    gallary.makuGroup.makus.forEach((maku) => {
      maku.mesh.material.transparent = true;
    });

    const doTransition = (mesh) => {
      gsap.to(mesh.material.uniforms.uProgress, {
        value: 1,
        duration: 3,
        ease: "power2.out",
      });
    };

    const undoTransition = (mesh) => {
      gsap.to(mesh.material.uniforms.uProgress, {
        value: 0,
        duration: 3,
        ease: "power2.out",
      });
    };

    gallary.makuGroup.makus.forEach((maku) => {
      doTransition(maku.mesh);

      this.interactionManager.add(maku.mesh);

      maku.mesh.addEventListener("click", () => {
        const progress = maku.mesh.material.uniforms.uProgress.value;
        if (progress < 0.5) {
          doTransition(maku.mesh);
        } else if (progress > 0.5) {
          undoTransition(maku.mesh);
        }
      });
    });
  }
}
