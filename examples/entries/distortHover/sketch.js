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
        uOffset: {
          value: new THREE.Vector2(0, 0),
        },
        uRGBShift: {
          value: 0.5,
        },
      },
      makuConfig: {
        meshSizeType: "scale",
      },
      isScrollPositionSync: false,
    });
    await gallary.addExisting();

    let targetX = 0;
    let targetY = 0;

    let offsetX = 0;
    let offsetY = 0;

    this.update(() => {
      targetX = this.interactionManager.mouse.x;
      targetY = this.interactionManager.mouse.y;

      offsetX = THREE.MathUtils.lerp(offsetX, targetX, 0.1);
      offsetY = THREE.MathUtils.lerp(offsetY, targetY, 0.1);

      if (gallary.makuGroup) {
        gallary.makuGroup.makus.forEach((maku) => {
          const material = maku.mesh.material;

          material.uniforms.uOffset.value = new THREE.Vector2(
            (targetX - offsetX) * 0.5,
            (targetY - offsetY) * 0.5
          );

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
