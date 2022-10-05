import * as kokomi from "kokomi.js";
import * as THREE from "three";
import gsap from "gsap";
import * as dat from "lil";

class Sketch extends kokomi.Base {
  async create() {
    const screenCamera = new kokomi.ScreenCamera(this);
    screenCamera.addExisting();

    // scroll
    const wheelScroller = new kokomi.WheelScroller();
    wheelScroller.listenForScroll();

    // texts
    const repeatArray = (arr, n) => [].concat(...Array(n).fill(arr));

    const texts = repeatArray(
      ["kokomi", "ganyu", "ayaka", "raiden", "hutao"],
      10
    );

    const fontSize = 60;

    const mat = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uScrollDelta: {
          value: 0,
        },
      },
    });

    const textMeshs = texts.map((text, i) => {
      const tm = new kokomi.TextMesh(this, text);
      tm.addExisting();
      tm.mesh.fontSize = fontSize;
      tm.mesh.position.y = -(fontSize * i);
      tm.mesh.anchorX = "left";
      tm.mesh.position.x = -fontSize;
      tm.mesh.material = mat;

      return tm;
    });

    const tg = new THREE.Group();
    textMeshs.forEach((tm) => {
      tg.add(tm.mesh);
    });
    this.scene.add(tg);

    this.update(() => {
      wheelScroller.syncScroll();

      const sc = wheelScroller.scroll.current;
      const sd = wheelScroller.scroll.delta;

      tg.position.y = sc * 0.5;

      textMeshs.forEach((tm) => {
        tm.mesh.material.uniforms.uScrollDelta.value = sd;
      });
    });

    // image
    const gallary = new kokomi.Gallery(this, {
      vertexShader: vertexShader2,
      fragmentShader: fragmentShader2,
      isScrollPositionSync: false,
    });
    await gallary.addExisting();

    const pg = new THREE.Group();
    gallary.makuGroup.makus.forEach((maku) => {
      pg.add(maku.mesh);
    });
    this.scene.add(pg);

    const bender = new kokomi.Bender();

    gallary.makuGroup.makus.forEach((maku, i) => {
      bender.bend(maku.mesh.geometry, "y", -Math.PI / 1000);
    });

    this.update(() => {
      const sc = wheelScroller.scroll.current;
      const ml = gallary.makuGroup.makus.length;
      const activeIndex = Math.round((sc / (fontSize * 2)) % ml);

      // image anime
      if (gallary.makuGroup) {
        gallary.makuGroup.makus.forEach((maku, i) => {
          maku.mesh.position.z = 250;
          pg.scale.setScalar(1);
          pg.rotation.y = sc * Math.PI * 2 * 0.008;
          pg.rotation.z = Math.sin(sc * 0.005) * 0.25;

          maku.mesh.visible = false;
          if (i === activeIndex) {
            maku.mesh.visible = true;
          }
        });
      }

      // text anime
      textMeshs.forEach((tm, i) => {
        if (i % ml === activeIndex) {
          tm.mesh.material.depthTest = false;
        } else {
          tm.mesh.material.depthTest = true;
        }
      });
    });

    // interesting one
    // const pe = new kokomi.PersistenceEffect(this);
    // pe.addExisting();
  }
}
