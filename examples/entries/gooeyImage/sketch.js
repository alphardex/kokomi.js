import * as kokomi from "kokomi.js";
import * as THREE from "three";
import gsap from "gsap";
import * as dat from "lil";

class Sketch extends kokomi.Base {
  async create() {
    const screenCamera = new kokomi.ScreenCamera(this);
    screenCamera.addExisting();

    const tex1 = new THREE.TextureLoader().load(
      "https://s2.loli.net/2022/09/08/gGY4VloDAeUwWxt.jpg"
    );

    const tex2 = new THREE.TextureLoader().load(
      "https://s2.loli.net/2022/09/08/wSYFN2izrMLulxh.jpg"
    );

    const gallary = new kokomi.Gallery(this, {
      vertexShader,
      fragmentShader,
      uniforms: {
        uTexture1: {
          value: tex1,
        },
        uTexture2: {
          value: tex2,
        },
        uHoverUv: {
          value: new THREE.Vector2(3, 3),
        },
        uDevicePixelRatio: {
          value: window.devicePixelRatio,
        },
      },
    });
    await gallary.addExisting();

    this.update(() => {
      if (gallary.makuGroup) {
        gallary.makuGroup.makus.forEach((maku) => {});
      }
    });

    // hover
    const rs = new kokomi.RaycastSelector(this);

    if (gallary.makuGroup) {
      gallary.makuGroup.makus.forEach((maku) => {
        maku.el.addEventListener("mouseout", () => {
          const uniforms = maku.mesh.material.uniforms;
          gsap.set(uniforms.uHoverUv, {
            value: new THREE.Vector2(3, 3),
          });
        });
      });
    }

    window.addEventListener("mousemove", () => {
      const intersect = rs.getFirstIntersect();
      if (intersect) {
        const obj = intersect.object;
        const material = obj.material;
        const uniforms = material.uniforms;
        uniforms.uHoverUv.value = intersect.uv;
      }
    });
  }
}
