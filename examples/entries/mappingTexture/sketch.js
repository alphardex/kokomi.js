import * as kokomi from "kokomi.js";
import * as THREE from "three";
import gsap from "gsap";
import * as dat from "lil";

class Sketch extends kokomi.Base {
  create() {
    this.camera.position.set(0, 0, 3);

    new kokomi.OrbitControls(this);

    const displaceTex = new THREE.TextureLoader().load(
      "https://s2.loli.net/2022/09/29/NyWCjnvS7OuUw96.png"
    );

    const normalTex = new THREE.TextureLoader().load(
      "https://s2.loli.net/2022/09/29/VfgLMGRlB9S3zAe.png"
    );

    const mapTex = new THREE.TextureLoader().load(
      "https://s2.loli.net/2022/09/29/56lPJ1WYsr2NKp3.png"
    );

    const cm = new kokomi.CustomMesh(this, {
      baseMaterial: new THREE.MeshPhysicalMaterial(),
      geometry: new THREE.PlaneGeometry(2, 2, 100, 100),
      vertexShader,
      fragmentShader,
      materialParams: {
        side: THREE.DoubleSide,
        // wireframe: true,
        transparent: true,
        displacementMap: displaceTex,
        normalMap: normalTex,
        map: mapTex,
      },
      uniforms: {
        uTexture: {
          value: mapTex,
        },
        uTranslate: {
          value: new THREE.Vector2(0, 0),
        },
        uScale: {
          value: new THREE.Vector2(1, 3),
        },
      },
    });
    cm.addExisting();
    this.cm = cm;

    const ambiLight = new THREE.AmbientLight(0xffffff, 0.4);
    this.scene.add(ambiLight);
    const dirLight = new THREE.DirectionalLight(0xffffff, 1.2);
    dirLight.position.set(1, 2, 3);
    this.scene.add(dirLight);

    this.container.addEventListener("mousemove", () => {
      const { x, y } = this.interactionManager.mouse;
      cm.mesh.rotation.y = 0.45 * x;
      cm.mesh.rotation.x = -0.3 * y;
    });

    this.update(() => {
      const t = this.clock.elapsedTime;

      const translate = Math.sin(t * 0.5) * 0.75;

      cm.material.uniforms.uTranslate.value = new THREE.Vector2(
        translate * 0.05,
        translate * 0.5
      );
    });

    // this.createDebug();
  }
  createDebug() {
    const params = {
      translateX: 0,
      translateY: 0,
    };

    const uniforms = this.cm?.mesh.material.uniforms;

    const gui = new dat.GUI();
    gui
      .add(params, "translateX")
      .min(-2)
      .max(2)
      .step(0.01)
      .onChange((value) => {
        if (uniforms) {
          uniforms.uTranslate.value.x = value;
        }
      });
    gui
      .add(params, "translateY")
      .min(-2)
      .max(2)
      .step(0.01)
      .onChange((value) => {
        if (uniforms) {
          uniforms.uTranslate.value.y = value;
        }
      });
  }
}
