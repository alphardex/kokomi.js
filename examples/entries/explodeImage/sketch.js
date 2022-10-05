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
      uniforms: {
        uProgress: {
          value: 0,
        },
      },
      makuConfig: {
        meshType: "points",
        segments: {
          width: 200,
          height: 129,
        },
      },
    });
    await gallary.addExisting();

    let isOpen = false;

    if (gallary.makuGroup) {
      gallary.makuGroup.makus.forEach((maku) => {
        const material = maku.mesh.material;

        maku.el.addEventListener("click", () => {
          if (!isOpen) {
            gsap.to(material.uniforms.uProgress, {
              value: 3,
              duration: 1,
            });
            isOpen = true;
          } else {
            gsap.to(material.uniforms.uProgress, {
              value: 0,
              duration: 1,
            });
            isOpen = false;
          }
        });
      });
    }
  }
}
