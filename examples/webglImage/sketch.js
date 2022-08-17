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
      isScrollPositionSync: false,
    });
    await gallary.addExisting();

    this.update(() => {
      if (gallary.makuGroup) {
        gallary.makuGroup.makus.forEach((maku) => {
          gsap.to(maku.mesh.position, {
            x: (this.interactionManager.mouse.x * window.innerWidth) / 2,
            y: (this.interactionManager.mouse.y * window.innerHeight) / 2,
          });

          gsap.to(maku.el, {
            x: this.iMouse.mouseDOM.x - maku.el.clientWidth / 2,
            y: this.iMouse.mouseDOM.y - maku.el.clientHeight / 2,
          });
        });
      }
    });
  }
}
