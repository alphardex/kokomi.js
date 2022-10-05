import * as kokomi from "kokomi.js";
import * as THREE from "three";
import gsap from "gsap";
import * as dat from "lil";

class Sketch extends kokomi.Base {
  create() {
    this.camera.position.set(0, 0, 2);

    new kokomi.OrbitControls(this);

    const params = {
      color1: "#612574",
      color2: "#293583",
      color3: "#1954ec",
      progress: 0,
      size: 15,
      // gradMaskTop: 0.41,
      // gradMaskBottom: 0.82,
      // size: 36,
      gradMaskTop: 0,
      gradMaskBottom: 0,
    };

    const caParams = {
      CAMaxDistortion: 0.25,
      CASize: 0.58,
    };

    // dna mat
    const DNAMaterial = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      side: THREE.DoubleSide,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: {
        uTime: {
          value: 0,
        },
        uMouse: {
          value: new THREE.Vector2(0, 0),
        },
        uResolution: {
          value: new THREE.Vector2(window.innerWidth, window.innerHeight),
        },
        uColor1: {
          value: new THREE.Color(params.color1),
        },
        uColor2: {
          value: new THREE.Color(params.color2),
        },
        uColor3: {
          value: new THREE.Color(params.color3),
        },
        uSize: {
          value: params.size,
        },
        uGradMaskTop: {
          value: params.gradMaskTop,
        },
        uGradMaskBottom: {
          value: params.gradMaskBottom,
        },
        uProgress: {
          value: params.progress,
        },
      },
    });

    // points
    const geometry = new THREE.SphereGeometry(1, 64, 64);
    const points = new THREE.Points(geometry, DNAMaterial);
    this.scene.add(points);

    // ca
    const customEffect = new kokomi.CustomEffect(this, {
      vertexShader: vertexShader2,
      fragmentShader: fragmentShader2,
      uniforms: {
        uResolution: {
          value: new THREE.Vector2(window.innerWidth, window.innerHeight),
        },
        uCAMaxDistortion: {
          value: caParams.CAMaxDistortion,
        },
        uCASize: {
          value: caParams.CASize,
        },
      },
    });
    customEffect.addExisting();
  }
}
