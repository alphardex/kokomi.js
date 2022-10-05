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

    const wheelScroller = new kokomi.WheelScroller();
    wheelScroller.listenForScroll();

    const gap = 10;

    const syncGallery = () => {
      wheelScroller.syncScroll();

      if (gallary.makuGroup) {
        const imgWidth = gallary.makuGroup.makus[0].el.clientWidth;

        const totalWidth = (imgWidth + gap) * gallary.makuGroup.makus.length;

        gallary.makuGroup.makus.forEach((maku, i) => {
          maku.mesh.position.x =
            (((imgWidth + gap) * i -
              wheelScroller.scroll.current -
              114514 * totalWidth) %
              totalWidth) +
            (imgWidth + gap) * 3;
        });
      }
    };

    this.update(() => {
      syncGallery();
    });

    // material quad
    const materialQuad = new THREE.ShaderMaterial({
      vertexShader: vertexShader2,
      fragmentShader: fragmentShader2,
      side: THREE.DoubleSide,
      transparent: true,
      uniforms: {
        uTexture: {
          value: null,
        },
        uScrollDelta: {
          value: 0,
        },
      },
    });

    this.update(() => {
      materialQuad.uniforms.uTexture.value = rt1.texture;

      materialQuad.uniforms.uScrollDelta.value = wheelScroller.scroll.delta;
    });

    // bg quad
    const bgQuad = new THREE.Mesh(
      new THREE.PlaneGeometry(window.innerWidth, window.innerHeight),
      new THREE.MeshBasicMaterial()
    );
    bgQuad.position.z -= 10;
    this.scene.add(bgQuad);

    this.update(() => {
      bgQuad.material.map = rt2.texture;
    });

    // scene quad
    const sceneQuad = new THREE.Scene();

    const quad = new THREE.Mesh(
      new THREE.PlaneGeometry(window.innerWidth, window.innerHeight),
      materialQuad
    );
    sceneQuad.add(quad);

    // rt
    const rt1 = new kokomi.RenderTexture(this, {
      rtScene: this.scene,
      rtCamera: this.camera,
    });

    const rt2 = new kokomi.RenderTexture(this, {
      rtScene: sceneQuad,
      rtCamera: this.camera,
    });
  }
}
