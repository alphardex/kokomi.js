import * as kokomi from "kokomi.js";
import * as THREE from "three";
import gsap from "gsap";
import * as dat from "lil";

class Sketch extends kokomi.Base {
  create() {
    this.camera.position.set(0, 0, 1.2);

    new kokomi.OrbitControls(this);

    const params = {
      text: "ALPHARDEX",
      velocity: 0.3,
      textColor: "#ffffff",
      textContainerColor: "#000000",
      cameraZ: 3,
    };

    // text
    const tm = new kokomi.TextMesh(this, params.text);
    tm.mesh.fontSize = 0.5;
    tm.mesh.color = params.textColor;
    tm.addExisting();

    // rt
    const rtScene = new THREE.Scene();
    const rtCamera = this.camera.clone();
    rtCamera.position.z = params.cameraZ;

    rtScene.add(tm.mesh);

    rtScene.background = new THREE.Color(params.textContainerColor);

    const rt = new kokomi.RenderTexture(this, {
      rtScene,
      rtCamera,
    });

    // cylinder
    const heightRatio = (0.5 / (params.text.length / 10)) * 2;

    const cm = new kokomi.CustomMesh(this, {
      baseMaterial: new THREE.ShaderMaterial(),
      geometry: new THREE.CylinderGeometry(0.5, 0.5, heightRatio, 50, 1, true),
      vertexShader,
      fragmentShader,
      materialParams: {
        side: THREE.DoubleSide,
        transparent: true,
      },
      uniforms: {
        uTexture: {
          value: rt.texture,
        },
        uVelocity: {
          value: params.velocity,
        },
      },
    });
    cm.addExisting();

    // anime
    this.update(() => {
      cm.mesh.rotation.z = this.interactionManager.mouse.x;
    });
  }
}
