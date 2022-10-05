import * as kokomi from "kokomi.js";
import * as THREE from "three";
import gsap from "gsap";
import * as dat from "lil";

class Sketch extends kokomi.Base {
  create() {
    this.camera.position.set(0, 0, 40);

    new kokomi.OrbitControls(this);

    const params = {
      text: "ALPHARDEX",
      velocity: 0.3,
      textColor: "#ffffff",
      textContainerColor: "#66ccff",
      cameraZ: 2.5,
      shadow: 2.5,
    };

    // text
    const tm = new kokomi.TextMesh(this, params.text);
    tm.mesh.fontSize = 1.2;
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

    // shape
    const cm = new kokomi.CustomMesh(this, {
      baseMaterial: new THREE.ShaderMaterial(),
      geometry: new THREE.TorusKnotGeometry(9, 3, 768, 3, 4, 3),
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
        uShadow: {
          value: params.shadow,
        },
      },
    });
    cm.addExisting();
  }
}
