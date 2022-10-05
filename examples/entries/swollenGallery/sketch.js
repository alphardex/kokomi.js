import * as kokomi from "kokomi.js";
import * as THREE from "three";
import gsap from "gsap";
import * as dat from "lil";

class Sketch extends kokomi.Base {
  async create() {
    const screenCamera = new kokomi.ScreenCamera(this);
    screenCamera.addExisting();

    const gallary = new kokomi.Gallery(this);
    await gallary.addExisting();

    this.update(() => {
      if (gallary.makuGroup) {
        gallary.makuGroup.makus.forEach((maku) => {});
      }
    });

    const customEffect = new kokomi.CustomEffect(this, {
      vertexShader,
      fragmentShader,
      uniforms: {
        uRadius: {
          value: 0.75,
        },
        uPower: {
          value: 0,
        },
      },
    });
    customEffect.addExisting();

    this.update(() => {
      const ss = gallary.scroller.scroll.delta;

      customEffect.customPass.uniforms.uPower.value = ss;
    });
  }
}
