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
        uProgress: {
          value: 0.7, // 扭曲进度
        },
        uWaveScale: {
          value: 1.5, // 扭曲波浪大小
        },
        uDistA: {
          value: 0.64,
        },
        uDistB: {
          value: 2.5,
        },
      },
    });
    customEffect.addExisting();

    this.update(() => {
      const currentScrollY = gallary.scroller.scroll.target;
      if (currentScrollY > 0) {
        gsap.to(customEffect.customPass.material.uniforms.uProgress, {
          value: 0,
          ease: "power3.inout",
          duration: 1.2,
        });
      } else if (currentScrollY <= 0) {
        gsap.to(customEffect.customPass.material.uniforms.uProgress, {
          value: 0.7,
          ease: "power3.out",
          duration: 1.2,
        });
      }
    });

    this.update(() => {
      if (gallary.makuGroup) {
        gallary.makuGroup.makus.forEach((maku) => {
          gsap.to(maku.mesh.rotation, {
            z:
              Math.PI *
              0.5 *
              customEffect.customPass.material.uniforms.uProgress.value,
            ease: "power2.out",
            duration: 1.2,
          });
        });
      }
    });
  }
}
