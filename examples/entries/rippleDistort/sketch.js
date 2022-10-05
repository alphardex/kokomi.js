import * as kokomi from "kokomi.js";
import * as THREE from "three";
import gsap from "gsap";
import * as dat from "lil";

class Sketch extends kokomi.Base {
  async create() {
    new kokomi.OrbitControls(this);

    const screenCamera = new kokomi.ScreenCamera(this);
    screenCamera.addExisting();

    const gallary = new kokomi.Gallery(this);
    await gallary.addExisting();

    // ripple displacement renderTexture
    const createRippleRt = (config = {}) => {
      const {
        waveCount = 100,
        mapUrl = `https://s2.loli.net/2022/08/09/nztMbdORvp5o2CJ.png`,
      } = config;

      const rt = new kokomi.RenderTexture(this, {
        rtCamera: this.camera,
      });

      let currentWave = 0;

      const geometry = new THREE.PlaneGeometry(64, 64);

      const ripples = [];
      for (let i = 0; i < waveCount; i++) {
        const material = new THREE.MeshBasicMaterial({
          map: new THREE.TextureLoader().load(mapUrl),
          transparent: true,
          blending: THREE.AdditiveBlending,
          depthTest: false,
          depthWrite: false,
        });

        const ripple = new THREE.Mesh(geometry, material);
        rt.add(ripple);
        ripples.push(ripple);
        ripple.visible = false;
        ripple.rotation.z = 2 * Math.PI * Math.random();
      }

      this.update(() => {
        if (this.iMouse.isMouseMoving) {
          currentWave = (currentWave + 1) % waveCount;

          let activeRipple = ripples[currentWave];
          activeRipple.visible = true;
          activeRipple.position.x = this.iMouse.mouseScreen.x;
          activeRipple.position.y = this.iMouse.mouseScreen.y;
          activeRipple.material.opacity = 0.5;
          activeRipple.scale.x = 0.2;
          activeRipple.scale.y = 0.2;
        }

        ripples.forEach((ripple) => {
          if (!ripple.visible) {
            return;
          }
          ripple.rotation.z += 0.02;
          ripple.material.opacity *= 0.96;
          ripple.scale.x = 0.982 * ripple.scale.x + 0.108;
          ripple.scale.y = ripple.scale.x;
          if (ripple.material.opacity < 0.002) {
            ripple.visible = false;
          }
        });
      });

      return rt;
    };

    const rippleRt = createRippleRt();

    const customEffect = new kokomi.CustomEffect(this, {
      vertexShader,
      fragmentShader,
      uniforms: {
        uDisplacement: {
          value: null,
        },
      },
    });
    customEffect.addExisting();

    customEffect.customPass.material.uniforms.uDisplacement.value =
      rippleRt.texture;
  }
}
