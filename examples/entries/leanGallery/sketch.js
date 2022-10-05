import * as kokomi from "kokomi.js";
import * as THREE from "three";
import gsap from "gsap";
import * as dat from "lil";

class Sketch extends kokomi.Base {
  async create() {
    window.scrollTo(0, 0);

    const screenCamera = new kokomi.ScreenCamera(this);
    screenCamera.addExisting();

    const gallary = new kokomi.Gallery(this, {
      vertexShader,
      fragmentShader,
      makuConfig: {
        meshSizeType: "scale",
      },
      uniforms: {
        uDistanceCenter: {
          value: 0,
        },
      },
    });
    await gallary.addExisting();

    const g = new THREE.Group();
    gallary.makuGroup.makus.forEach((maku) => {
      g.add(maku.mesh);
    });
    this.scene.add(g);

    g.rotation.y = -THREE.MathUtils.degToRad(30);
    g.rotation.x = -THREE.MathUtils.degToRad(18);
    g.rotation.z = -THREE.MathUtils.degToRad(6);

    const gap = 64;

    this.update(() => {
      if (gallary.makuGroup) {
        const dists = Array(gallary.makuGroup.makus.length).fill(0);

        gallary.makuGroup.makus.forEach((maku, i) => {
          const sc = gallary.scroller.scroll.current;
          const h = maku.el.clientHeight;

          const d1 = Math.min(Math.abs(sc - i * (h + gap)) / h, 1);
          const d2 = 1 - d1 ** 2;
          dists[i] = d2;

          maku.mesh.material.uniforms.uDistanceCenter.value = d2;

          const activeIndex = dists.findIndex(
            (item) => item === Math.max(...dists)
          );
          this.activeIndex = activeIndex;
        });
      }
    });

    this.updateDOM();
  }
  updateDOM() {
    document.addEventListener("keypress", (e) => {
      if (e.code === "Space") {
        e.preventDefault();
      }
    });

    const charInfos = [
      { name: "珊瑚宫心海", color: "#d27273" },
      { name: "甘雨", color: "#46a4e1" },
      { name: "神里绫华", color: "#45484f" },
      { name: "雷电将军", color: "#141c4b" },
      { name: "胡桃", color: "#452b2c" },
    ];
    const charNameEl = document.querySelector(".char-name");

    this.update(() => {
      const activeIndex = this.activeIndex;
      charNameEl.textContent = charInfos[activeIndex].name;

      gsap.to("#sketch", {
        backgroundColor: charInfos[activeIndex].color,
        ease: "none",
      });
    });
  }
}
