import * as kokomi from "kokomi.js";
import * as THREE from "three";
import gsap from "gsap";
import * as dat from "lil";

class Sketch extends kokomi.Base {
  create() {
    this.camera.position.set(0, 0, 0.2);

    new kokomi.OrbitControls(this);

    // https://colorhunt.co
    // const palette = ["#F9ED69", "#F08A5D", "#B83B5E", "#6A2C70"];
    const palette = ["#F9F7F7", "#DBE2EF", "#3F72AF", "#112D4E"];

    const cm = new kokomi.CustomMesh(this, {
      baseMaterial: new THREE.ShaderMaterial(),
      geometry: new THREE.PlaneGeometry(1, 1, 300, 300),
      vertexShader,
      fragmentShader,
      materialParams: {
        side: THREE.DoubleSide,
        // wireframe: true,
        defines: {
          COLOR_COUNT: palette.length,
        },
      },
      uniforms: {
        uColors: {
          value: palette.map((color) => new THREE.Color(color)),
        },
        uNoiseAmp: {
          value: 0.3,
        },
        uIncline: {
          value: 0.1,
        },
      },
    });
    cm.addExisting();
  }
}
