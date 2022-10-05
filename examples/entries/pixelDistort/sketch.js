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
        uDataTexture: {
          value: null,
        },
      },
    });
    await gallary.addExisting();

    // create DataTexture
    const w = 64;
    const width = w;
    const height = w;

    const size = width * height;
    const dimension = 4;

    const data = kokomi.makeBuffer(size, (val) => val, dimension);

    kokomi.iterateBuffer(
      data,
      size,
      (arr, axis) => {
        const r = Math.random() * 255;

        arr[axis.x] = r;
        arr[axis.y] = r;
        arr[axis.z] = r;
        arr[axis.w] = 1;
      },
      dimension
    );

    const dataTex = new THREE.DataTexture(data, width, height);
    dataTex.needsUpdate = true;
    dataTex.format = THREE.RGBAFormat;
    dataTex.type = THREE.FloatType;
    dataTex.magFilter = THREE.NearestFilter;
    dataTex.minFilter = THREE.NearestFilter;

    gallary.makuGroup.makus.forEach((maku) => {
      maku.mesh.material.uniforms.uDataTexture.value = dataTex;
    });

    // get hover delta
    let hd = new THREE.Vector2(0, 0);

    window.addEventListener("mousemove", () => {
      const hoverDelta = new THREE.Vector2(
        this.iMouse.mouseDOMDelta.x / window.innerWidth,
        this.iMouse.mouseDOMDelta.y / window.innerHeight
      );
      hd = hoverDelta;
    });

    // anime
    const acceleration = 0.9;
    const strength = 100;

    this.update(() => {
      dataTex.needsUpdate = true;
      const data = dataTex.image.data;

      kokomi.iterateBuffer(
        data,
        data.length,
        (arr, axis) => {
          arr[axis.x] *= acceleration;
          arr[axis.y] *= acceleration;
        },
        dimension
      );

      const gridMouseX = (w * this.iMouse.mouse.x) / window.innerWidth;
      const gridMouseY = (w * this.iMouse.mouse.y) / window.innerHeight;
      const maxDist = w / 4;

      for (let i = 0; i < w; i++) {
        for (let j = 0; j < w; j++) {
          const dist = Math.hypot(gridMouseX - i, gridMouseY - j);

          if (dist < maxDist) {
            const idx = (i + w * j) * dimension;

            let power = maxDist / dist;
            if (dist < w / 32) {
              power = 1;
            }

            data[idx] += hd.x * power * strength;
            data[idx + 1] -= hd.y * power * strength;
          }
        }
      }

      hd.x *= acceleration;
      hd.y *= acceleration;
    });
  }
}
