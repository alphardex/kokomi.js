import * as kokomi from "kokomi.js";
import * as THREE from "three";
import gsap from "gsap";
import * as dat from "lil-gui";

class Sketch extends kokomi.Base {
  create() {
    const screenCamera = new kokomi.ScreenCamera(this);
    screenCamera.addExisting();

    new kokomi.OrbitControls(this);

    // scene1
    const rtScene1 = new THREE.Scene();
    const rtCamera1 = new THREE.PerspectiveCamera(
      70,
      window.innerWidth / window.innerHeight,
      0.01,
      1000
    );
    rtCamera1.position.z = 2;

    const cm = new kokomi.CustomMesh(this, {
      baseMaterial: new THREE.ShaderMaterial(),
      geometry: new THREE.PlaneGeometry(1, 1, 16, 16),
      vertexShader,
      fragmentShader,
      materialParams: {
        side: THREE.DoubleSide,
      },
    });
    cm.container = rtScene1;
    cm.addExisting();

    const rt = new kokomi.RenderTexture(this, {
      rtScene: rtScene1,
      rtCamera: rtCamera1,
    });

    const quad1 = new kokomi.RenderQuad(this, rt.texture);
    quad1.addExisting();
    quad1.mesh.position.z = -1;
  }
}
