import * as kokomi from "kokomi.js";
import * as THREE from "three";
import gsap from "gsap";
import * as dat from "lil-gui";

class Sketch extends kokomi.Base {
  async create() {
    const screenCamera = new kokomi.ScreenCamera(this);
    screenCamera.addExisting();

    const hg = new kokomi.HorizontalGallery(this, {
      vertexShader,
      fragmentShader,
    });
    await hg.addExisting();

    const wheelScroller = new kokomi.WheelScroller();
    wheelScroller.listenForScroll();

    this.update(() => {
      wheelScroller.syncScroll();
      const { current } = wheelScroller.scroll;
      hg.sync(current);
    });
  }
}
