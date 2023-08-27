import * as kokomi from "kokomi.js";
import * as THREE from "three";
import gsap from "gsap";
import * as dat from "lil-gui";

class Sketch extends kokomi.Base {
  async create() {
    const screenCamera = new kokomi.ScreenCamera(this);
    screenCamera.addExisting();

    const ig = new kokomi.InfiniteGallery(this, {
      direction: "horizontal",
      vertexShader,
      fragmentShader,
    });
    await ig.addExisting();

    const wheelScroller = new kokomi.WheelScroller();
    wheelScroller.listenForScroll();

    const dragDetecter = new kokomi.DragDetecter(this);
    dragDetecter.detectDrag();

    dragDetecter.on("drag", (delta) => {
      wheelScroller.scroll.target -= delta[ig.dimensionType] * 2;
    });
    dragDetecter.on("dragend", () => {
      const snapTarget = ig.snap(wheelScroller.scroll.target);
      gsap.to(wheelScroller.scroll, {
        target: snapTarget,
        duration: 0.2,
      });
    });

    this.update(() => {
      wheelScroller.syncScroll();
      const { current } = wheelScroller.scroll;
      ig.sync(current);
    });
  }
}
