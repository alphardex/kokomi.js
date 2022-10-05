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
        uHoverState: {
          value: 0,
        },
        uHoverUv: {
          value: new THREE.Vector2(0, 0),
        },
      },
    });
    await gallary.addExisting();

    // hover
    gallary.makuGroup.makus.forEach((maku) => {
      maku.el.addEventListener("mouseenter", () => {
        gsap.to(maku.mesh.material.uniforms.uHoverState, {
          value: 1,
          duration: 1,
        });
      });

      maku.el.addEventListener("mouseleave", () => {
        gsap.to(maku.mesh.material.uniforms.uHoverState, {
          value: 0,
          duration: 1,
        });
      });
    });

    const rs = new kokomi.RaycastSelector(this);

    window.addEventListener("mousemove", () => {
      const intersect = rs.getFirstIntersect();
      if (intersect) {
        const obj = intersect.object;
        if (obj.material.uniforms) {
          obj.material.uniforms.uHoverUv.value = intersect.uv;
        }
      }
    });
  }
}
