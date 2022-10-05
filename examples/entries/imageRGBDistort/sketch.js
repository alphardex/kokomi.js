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
        uScrollDelta: {
          value: 0,
        },
        uRGBShift: {
          value: 0.2,
        },
      },
    });
    await gallary.addExisting();

    // scroll
    this.update(() => {
      gallary.makuGroup.makus.forEach((maku) => {
        gsap.to(maku.mesh.material.uniforms.uScrollDelta, {
          value: gallary.scroller.scroll.delta,
        });
      });
    });
  }
}
