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
    });
    await gallary.addExisting();

    const customEffect = new kokomi.CustomEffect(this, {
      vertexShader: vertexShader2,
      fragmentShader: fragmentShader2,
      uniforms: {
        uScrollDelta: {
          value: 0,
        },
      },
    });
    customEffect.addExisting();

    // scroll
    this.update(() => {
      gsap.to(customEffect.customPass.material.uniforms.uScrollDelta, {
        value: gallary.scroller.scroll.delta,
      });
    });
  }
}
