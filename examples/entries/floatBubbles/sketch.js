import * as kokomi from "kokomi.js";
import * as THREE from "three";
import gsap from "gsap";
import * as dat from "lil";

class Sketch extends kokomi.Base {
  create() {
    this.camera.position.set(0, 0, 3);

    new kokomi.OrbitControls(this);

    // https://polyhaven.com/
    const envMap = new THREE.CubeTextureLoader().load([
      "https://s2.loli.net/2022/09/29/X8TDZROlUo6uAyG.png",
      "https://s2.loli.net/2022/09/29/KYEJ9ylQNIe6h4R.png",
      "https://s2.loli.net/2022/09/29/GqseLg6tWoluDzV.png",
      "https://s2.loli.net/2022/09/29/LUk8P21MJG6AtNF.png",
      "https://s2.loli.net/2022/09/29/4BO1JHoM3phFCb7.png",
      "https://s2.loli.net/2022/09/29/5NvAxfCVqlKFRZU.png",
    ]);

    this.scene.background = envMap;

    const bumpMap = new THREE.TextureLoader().load(
      "https://s2.loli.net/2022/09/23/pzeAFm72TGIDq8S.jpg"
    );

    // bubble
    const cm = new kokomi.CustomMesh(this, {
      baseMaterial: new THREE.MeshPhysicalMaterial(),
      geometry: new THREE.IcosahedronGeometry(1, 4),
      vertexShader,
      fragmentShader,
      materialParams: {
        side: THREE.DoubleSide,
        roughness: 0,
        metalness: 1,
        clearcoat: 1,
        clearcoatRoughness: 1,
        bumpScale: 0.005,
        envMap,
        bumpMap,
      },
      uniforms: {
        uDistortion: {
          value: 0.4,
        },
        uRadius: {
          value: 1,
        },
        uVelocity: {
          value: 0.5,
        },
        uColor: {
          value: new THREE.Color("#ffffff"),
        },
      },
    });
    cm.addExisting();

    // bubbles
    const count = 64;

    const bubbles = [...Array(count).keys()].map(() => {
      const bubble = cm.mesh.clone();
      bubble.position.x = 4 * THREE.MathUtils.randFloat(-6, 6);
      bubble.position.y = 4 * THREE.MathUtils.randFloat(-5, 5);
      bubble.position.z = 4 * THREE.MathUtils.randFloat(-5, -1);
      const bubbleScale = THREE.MathUtils.randFloat(0, 1.5);
      bubble.scale.setScalar(bubbleScale);
      this.scene.add(bubble);
      return bubble;
    });

    // anime
    this.update(() => {
      const t = this.clock.elapsedTime;
      const mp = this.interactionManager.mouse;

      cm.mesh.rotation.z = t / 5;
      cm.mesh.rotation.x = THREE.MathUtils.lerp(
        cm.mesh.rotation.x,
        mp.y * Math.PI,
        0.1
      );
      cm.mesh.rotation.y = THREE.MathUtils.lerp(
        cm.mesh.rotation.y,
        mp.x * Math.PI,
        0.1
      );
      bubbles.forEach((bubble) => {
        bubble.position.y += THREE.MathUtils.randFloat(0.02, 0.06);
        if (bubble.position.y > 20) {
          bubble.position.y = -20;
        }
        bubble.rotation.x += 0.04;
        bubble.rotation.y += 0.04;
        bubble.rotation.z += 0.02;
      });
    });

    const ambiLight = new THREE.AmbientLight(0xffffff, 0.4);
    this.scene.add(ambiLight);
    const dirLight = new THREE.DirectionalLight(0xffffff, 1.2);
    dirLight.position.set(1, 2, 3);
    this.scene.add(dirLight);
  }
}
