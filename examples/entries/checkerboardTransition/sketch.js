import * as kokomi from "kokomi.js";
import * as THREE from "three";
import gsap from "gsap";
import * as dat from "lil";

class Sketch extends kokomi.Base {
  create() {
    this.camera.position.set(0, 0, 2);

    new kokomi.OrbitControls(this);

    const params = {
      text: "HELLO WORLD",
      fontSize: 0.5,
      progress: 0,
      progress1: 0,
      baseDuration: 0.2,
      stagger: 0.1,
      color: "#ffffff",
      shadowColor: "#03D8F3",
      start: () => {
        const duration = params.text.length * params.baseDuration;
        const stagger = params.stagger;
        const t1 = gsap.timeline();
        t1.to(mat.uniforms.uProgress, {
          value: 1,
          duration,
        });
        t1.to(
          mat.uniforms.uProgress1,
          {
            value: 1,
            duration,
          },
          stagger
        );
      },
      reset: () => {
        const duration = params.text.length * params.baseDuration;
        const stagger = params.stagger;
        const t1 = gsap.timeline();
        t1.to(mat.uniforms.uProgress1, {
          value: 0,
          duration,
        });
        t1.to(
          mat.uniforms.uProgress,
          {
            value: 0,
            duration,
          },
          stagger
        );
      },
    };
    this.params = params;

    const tm = new kokomi.TextMesh(this, params.text);
    this.tm = tm;
    tm.addExisting();
    tm.mesh.fontSize = params.fontSize;
    const mat = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uProgress: {
          value: params.progress,
        },
        uProgress1: {
          value: params.progress1,
        },
        uGridSize: {
          value: params.text.length,
        },
        uTextColor: {
          value: new THREE.Color(params.color),
        },
        uShadowColor: {
          value: new THREE.Color(params.shadowColor),
        },
      },
    });
    this.mat = mat;
    tm.mesh.material = mat;

    params.start();

    // this.createDebug();
  }
  createDebug() {
    const params = this.params;
    const mat = this.mat;
    const tm = this.tm;

    const gui = new dat.GUI();
    // gui
    //   .add(params, "progress")
    //   .min(0)
    //   .max(1)
    //   .step(0.01)
    //   .onChange((val) => {
    //     mat.uniforms.uProgress.value = val;
    //   });
    // gui
    //   .add(params, "progress1")
    //   .min(0)
    //   .max(1)
    //   .step(0.01)
    //   .onChange((val) => {
    //     mat.uniforms.uProgress1.value = val;
    //   });
    gui.add(params, "start");
    gui.add(params, "reset");
    gui.addColor(params, "color").onChange((val) => {
      mat.uniforms.uTextColor.value = new THREE.Color(val);
    });
    gui.addColor(params, "shadowColor").onChange((val) => {
      mat.uniforms.uShadowColor.value = new THREE.Color(val);
    });
    gui.add(params, "text").onChange((val) => {
      tm.mesh.text = val;
      mat.uniforms.uGridSize.value = val.length;
    });
  }
}
