import * as kokomi from "kokomi.js";
import * as THREE from "three";
import gsap from "gsap";
import * as dat from "lil";

class Sketch extends kokomi.Base {
  async create() {
    const screenCamera = new kokomi.ScreenCamera(this);
    screenCamera.addExisting();

    const innerTex = new THREE.TextureLoader().load(
      "https://s2.loli.net/2022/09/08/wSYFN2izrMLulxh.jpg"
    );

    const params = {
      radius: 0,
      swirl: 0,
      fisheye: -1,
    };
    this.params = params;

    const gallary = new kokomi.Gallery(this, {
      vertexShader,
      fragmentShader,
      uniforms: {
        uInnerTexture: {
          value: innerTex,
        },
        uRadius: {
          value: params.radius,
        },
        uSwirl: {
          value: params.swirl,
        },
        uFisheye: {
          value: params.fisheye,
        },
      },
    });
    this.gallary = gallary;
    await gallary.addExisting();

    const duration = 1.5;

    const doTransition = (mesh) => {
      gsap.to(mesh.material.uniforms.uRadius, {
        value: 2,
        duration,
        ease: "sine.inOut",
      });
      gsap.to(mesh.material.uniforms.uSwirl, {
        value: 1,
        duration,
        ease: "expo.out",
      });
      gsap.to(mesh.material.uniforms.uFisheye, {
        value: 0,
        duration,
      });
    };

    const undoTransition = (mesh) => {
      gsap.to(mesh.material.uniforms.uRadius, {
        value: 0,
        duration,
        ease: "expo.out",
      });
      gsap.to(mesh.material.uniforms.uSwirl, {
        value: 0,
        duration,
        ease: "expo.out",
      });
      gsap.to(mesh.material.uniforms.uFisheye, {
        value: params.fisheye,
        duration,
        ease: "expo.in",
      });
    };

    gallary.makuGroup.makus.forEach((maku) => {
      this.interactionManager.add(maku.mesh);

      maku.mesh.addEventListener("click", () => {
        const progress = maku.mesh.material.uniforms.uRadius.value;
        if (progress < 1.2) {
          doTransition(maku.mesh);
        } else if (progress > 1.2) {
          undoTransition(maku.mesh);
        }
      });
    });

    // this.createDebug();
  }
  createDebug() {
    const params = this.params;
    const gallery = this.gallary;

    const gui = new dat.GUI();
    gui
      .add(params, "radius")
      .min(0)
      .max(2)
      .step(0.01)
      .onChange((value) => {
        gallery.makuGroup.makus.forEach((maku) => {
          maku.mesh.material.uniforms.uRadius.value = value;
        });
      });
    gui
      .add(params, "swirl")
      .min(0)
      .max(1)
      .step(0.01)
      .onChange((value) => {
        gallery.makuGroup.makus.forEach((maku) => {
          maku.mesh.material.uniforms.uSwirl.value = value;
        });
      });
    gui
      .add(params, "fisheye")
      .min(-10)
      .max(0)
      .step(0.01)
      .onChange((value) => {
        gallery.makuGroup.makus.forEach((maku) => {
          maku.mesh.material.uniforms.uFisheye.value = value;
        });
      });
  }
}
