import * as kokomi from "kokomi.js";
import * as THREE from "three";
import gsap from "gsap";
import * as dat from "lil";

class Sketch extends kokomi.Base {
  async create() {
    const screenCamera = new kokomi.ScreenCamera(this);
    screenCamera.addExisting();

    const scale = 0.25;

    const tex1 = new THREE.TextureLoader().load(
      "https://s2.loli.net/2022/09/08/gGY4VloDAeUwWxt.jpg"
    );

    const tex2 = new THREE.TextureLoader().load(
      "https://s2.loli.net/2022/09/08/wSYFN2izrMLulxh.jpg"
    );

    const tex3 = new THREE.TextureLoader().load(
      "https://s2.loli.net/2022/09/08/wX7tYIB9FCl1nQm.jpg"
    );

    const params = {
      progress: 0,
      move: 0,
    };
    this.params = params;

    const gallary = new kokomi.Gallery(this, {
      vertexShader,
      fragmentShader,
      makuConfig: {
        meshType: "points",
        segments: {
          width: 1920 * scale,
          height: 1080 * scale,
        },
      },
      uniforms: {
        uTexture1: {
          value: tex1,
        },
        uTexture2: {
          value: tex2,
        },
        uMove: {
          value: 0,
        },
        uHover: {
          value: new THREE.Vector3(0, 0, 0),
        },
        uIsHover: {
          value: 0,
        },
        uProgress: {
          value: params.progress,
        },
        uArea: {
          value: 100,
        },
      },
    });
    await gallary.addExisting();

    gallary.makuGroup.makus.forEach((maku) => {
      maku.mesh.material.transparent = true;
      maku.mesh.material.depthWrite = false;
    });

    this.update(() => {
      if (gallary.makuGroup) {
        gallary.makuGroup.makus.forEach((maku) => {
          maku.mesh.material.uniforms.uMove.value = params.move;
          maku.mesh.material.uniforms.uProgress.value = params.progress;
        });
      }
    });

    // hover
    const rs = new kokomi.RaycastSelector(this);

    const imageEl = gallary.makuGroup.makus[0].el;
    const hitPlane = new THREE.Mesh(
      new THREE.PlaneGeometry(imageEl.clientWidth, imageEl.clientHeight),
      new THREE.MeshBasicMaterial()
    );
    hitPlane.position.z = 1;
    hitPlane.visible = false;
    this.scene.add(hitPlane);

    window.addEventListener("mousemove", () => {
      const target = rs.onChooseIntersect(hitPlane);
      if (target) {
        const p = target.point;
        gallary.makuGroup.makus.forEach((maku) => {
          maku.mesh.material.uniforms.uHover.value = p;
        });
      }
    });

    const doHover = (mesh) => {
      gsap.to(mesh.material.uniforms.uIsHover, {
        value: 1,
        duration: 1,
        ease: "elastic.out(1, 0.3)",
      });
    };

    const undoHover = (mesh) => {
      gsap.to(mesh.material.uniforms.uIsHover, {
        value: 0,
        duration: 1,
        ease: "elastic.out(1, 0.3)",
      });
    };

    window.addEventListener("mouseover", () => {
      gallary.makuGroup.makus.forEach((maku) => {
        doHover(maku.mesh);
      });
    });

    window.addEventListener("mouseout", () => {
      gallary.makuGroup.makus.forEach((maku) => {
        undoHover(maku.mesh);
      });
    });

    // swap texture
    const textures = [tex1, tex2, tex3];

    this.update(() => {
      if (gallary.makuGroup) {
        gallary.makuGroup.makus.forEach((maku) => {
          const move =
            params.move < 0
              ? (params.move % textures.length) + textures.length
              : params.move;
          const prev = Math.floor(move % textures.length);
          // const next = Math.floor((move % textures.length) + 1);
          const next =
            Math.ceil(move) % textures.length === 0
              ? 0
              : Math.floor((move % textures.length) + 1);
          console.log({ move, prev, next });
          maku.mesh.material.uniforms.uTexture1.value = textures[prev];
          maku.mesh.material.uniforms.uTexture2.value = textures[next];
        });
      }
    });

    let canGotoNextImage = true;

    const imageTransition = (moveDelta = "+=1") => {
      if (!canGotoNextImage) {
        return;
      }
      canGotoNextImage = false;
      gsap.to(params, {
        progress: 1,
        duration: 1,
        ease: "power4.out",
      });
      gsap.to(params, {
        move: moveDelta,
        duration: 1.2,
        delay: 0.5,
      });
      gsap.to(params, {
        progress: 0,
        duration: 1,
        delay: 1.2,
        onComplete() {
          canGotoNextImage = true;
        },
      });
    };

    const nextImage = () => imageTransition("+=1");

    const prevImage = () => imageTransition("-=1");

    window.addEventListener("wheel", (e) => {
      const deltaY = e.deltaY;
      if (deltaY > 0) {
        nextImage();
      } else {
        prevImage();
      }
    });

    // this.createDebug();
  }
  createDebug() {
    const { params } = this;

    const gui = new dat.GUI();
    gui.add(params, "progress").min(0).max(1).step(0.01);
  }
}
