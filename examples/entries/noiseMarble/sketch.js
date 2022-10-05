import * as kokomi from "kokomi.js";
import * as THREE from "three";
import gsap from "gsap";
import * as dat from "lil";

class Sketch extends kokomi.Base {
  create() {
    this.camera.position.set(0, 0, 2);

    const controls = new kokomi.OrbitControls(this);
    controls.controls.autoRotate = true;

    this.renderer.outputEncoding = THREE.sRGBEncoding;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;

    const params = {
      roughness: 0.1,
      color1: "#000000",
      color2: "#66ccff",
      depth: 0.6,
      smooth: 0.2,
      speed: 0.05,
      strength: 0.2,
      slice: 1.6,
    };
    this.params = params;

    // https://polyhaven.com/
    const envMap = new THREE.CubeTextureLoader().load([
      "https://s2.loli.net/2022/09/29/X8TDZROlUo6uAyG.png",
      "https://s2.loli.net/2022/09/29/KYEJ9ylQNIe6h4R.png",
      "https://s2.loli.net/2022/09/29/GqseLg6tWoluDzV.png",
      "https://s2.loli.net/2022/09/29/LUk8P21MJG6AtNF.png",
      "https://s2.loli.net/2022/09/29/4BO1JHoM3phFCb7.png",
      "https://s2.loli.net/2022/09/29/5NvAxfCVqlKFRZU.png",
    ]);
    this.scene.environment = envMap;

    // http://kitfox.com/projects/perlinNoiseMaker/
    const heightMapTex = new THREE.TextureLoader().load(
      "https://s2.loli.net/2022/09/29/EONsJn2BIvC8DY9.jpg"
    );

    const displacementMapTex = new THREE.TextureLoader().load(
      "https://s2.loli.net/2022/09/29/1npdc2HAwimxWZV.jpg"
    );
    displacementMapTex.wrapS = THREE.RepeatWrapping;
    displacementMapTex.wrapT = THREE.RepeatWrapping;

    const cm = new kokomi.CustomMesh(this, {
      baseMaterial: new THREE.MeshStandardMaterial(),
      geometry: new THREE.SphereGeometry(1, 128, 128),
      vertexShader,
      fragmentShader,
      materialParams: {
        side: THREE.DoubleSide,
        roughness: params.roughness,
      },
      uniforms: {
        uHeightMap: {
          value: heightMapTex,
        },
        uColor1: {
          value: new THREE.Color(params.color1),
        },
        uColor2: {
          value: new THREE.Color(params.color2),
        },
        uDepth: {
          value: params.depth,
        },
        uSmooth: {
          value: params.smooth,
        },
        uDisplacementMap: {
          value: displacementMapTex,
        },
        uSpeed: {
          value: params.speed,
        },
        uStrength: {
          value: params.strength,
        },
        uSlice: {
          value: params.slice,
        },
      },
    });
    cm.addExisting();
    this.cm = cm;

    // this.createDebug();
  }
  createDebug() {
    const params = this.params;
    const material = this.cm.mesh.material;
    const uniforms = this.cm.mesh.material.uniforms;

    const gui = new dat.GUI();
    gui.add(params, "roughness", 0, 1, 0.01).onChange((value) => {
      material.roughness = value;
    });
    gui.add(params, "depth", 0, 1, 0.01).onChange((value) => {
      uniforms.uDepth.value = value;
    });
    gui.add(params, "smooth", 0, 1, 0.01).onChange((value) => {
      uniforms.uSmooth.value = value;
    });
    gui.add(params, "speed", 0, 1, 0.01).onChange((value) => {
      uniforms.uSpeed.value = value;
    });
    gui.add(params, "strength", 0, 1, 0.01).onChange((value) => {
      uniforms.uStrength.value = value;
    });
    gui.add(params, "slice", 0, 5, 0.01).onChange((value) => {
      uniforms.uSlice.value = value;
    });
    gui.addColor(params, "color1").onChange((value) => {
      uniforms.uColor1.value = new THREE.Color(value);
    });
    gui.addColor(params, "color2").onChange((value) => {
      uniforms.uColor2.value = new THREE.Color(value);
    });
  }
}
