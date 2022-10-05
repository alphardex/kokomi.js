import * as kokomi from "kokomi.js";
import * as THREE from "three";
import gsap from "gsap";
import * as dat from "lil";

class Sketch extends kokomi.Base {
  create() {
    this.camera.position.set(0, 0, 2);

    new kokomi.OrbitControls(this);

    const colorParams = {
      brightness: "#808080",
      contrast: "#808080",
      oscilation: "#ffffff",
      phase: "#4c3333",
    };

    const cm = new kokomi.CustomMesh(this, {
      baseMaterial: new THREE.ShaderMaterial(),
      geometry: new THREE.SphereGeometry(0.5, 64, 64),
      vertexShader,
      fragmentShader,
      materialParams: {
        side: THREE.DoubleSide,
      },
      uniforms: {
        uSpeed: {
          value: 0.2,
        },
        uNoiseStrength: {
          value: 0.2,
        },
        uNoiseDensity: {
          value: 1.5,
        },
        uFrequency: {
          value: 3,
        },
        uAmplitude: {
          value: 6,
        },
        uIntensity: {
          value: 7,
        },
        uBrightness: {
          value: new THREE.Color(colorParams.brightness),
        },
        uContrast: {
          value: new THREE.Color(colorParams.contrast),
        },
        uOscilation: {
          value: new THREE.Color(colorParams.oscilation),
        },
        uPhase: {
          value: new THREE.Color(colorParams.phase),
        },
      },
    });
    cm.addExisting();
  }
}
