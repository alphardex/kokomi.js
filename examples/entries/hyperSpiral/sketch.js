import * as kokomi from "kokomi.js";
import * as THREE from "three";
import gsap from "gsap";
import * as dat from "lil";

class Sketch extends kokomi.Base {
  create() {
    this.camera.position.set(0, 0, 2);

    new kokomi.OrbitControls(this);

    // hyper spiral
    const tex1 = new THREE.TextureLoader().load(
      "https://s2.loli.net/2022/08/17/ZmIE9l6UBnxGKXW.png"
    );

    const cm = new kokomi.CustomMesh(this, {
      baseMaterial: new THREE.MeshPhysicalMaterial({
        roughness: 0,
        metalness: 0.1,
        clearcoat: 1,
        clearcoatRoughness: 0.4,
      }),
      geometry: new kokomi.HyperbolicHelicoidGeometry(128, 128),
      vertexShader,
      fragmentShader,
      materialParams: {
        side: THREE.DoubleSide,
      },
      uniforms: {
        uTexture: {
          value: tex1,
        },
      },
    });
    cm.addExisting();
    cm.mesh.castShadow = true;
    cm.mesh.receiveShadow = true;

    this.update(() => {
      const t = this.clock.elapsedTime * 0.5;
      cm.mesh.rotation.y = t * Math.PI * 2;
    });

    // env
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    const dirLight = new THREE.DirectionalLight(new THREE.Color("#ffffff"), 3);
    dirLight.position.set(1, 1, 1);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 2048;
    dirLight.shadow.mapSize.height = 2048;
    dirLight.shadow.camera.top = 2;
    dirLight.shadow.camera.right = 2;
    dirLight.shadow.camera.bottom = -2;
    dirLight.shadow.camera.left = -2;
    this.scene.add(dirLight);
    const ambiLight = new THREE.AmbientLight(new THREE.Color("#ffffff"), 1);
    this.scene.add(ambiLight);

    // two balls
    const tex2 = new THREE.TextureLoader().load(
      "https://s2.loli.net/2022/08/17/TgXJe2B7VkhP9zv.png"
    );

    const cm2 = new kokomi.CustomMesh(this, {
      baseMaterial: new THREE.MeshPhysicalMaterial({
        roughness: 0,
        metalness: 0.1,
        clearcoat: 1,
        clearcoatRoughness: 0.4,
      }),
      geometry: new THREE.IcosahedronGeometry(0.2, 5),
      vertexShader,
      fragmentShader,
      materialParams: {
        side: THREE.DoubleSide,
      },
      uniforms: {
        uTexture: {
          value: tex2,
        },
      },
    });
    cm2.addExisting();
    cm2.mesh.castShadow = true;
    cm2.mesh.receiveShadow = true;

    const cm3 = new kokomi.CustomMesh(this, {
      baseMaterial: new THREE.MeshPhysicalMaterial({
        roughness: 0,
        metalness: 0.1,
        clearcoat: 1,
        clearcoatRoughness: 0.4,
      }),
      geometry: new THREE.IcosahedronGeometry(0.2, 5),
      vertexShader,
      fragmentShader,
      materialParams: {
        side: THREE.DoubleSide,
      },
      uniforms: {
        uTexture: {
          value: tex2,
        },
      },
    });
    cm3.addExisting();
    cm3.mesh.castShadow = true;
    cm3.mesh.receiveShadow = true;

    this.update(() => {
      const t = this.clock.elapsedTime * 0.5;
      const r = 0.6;
      const theta1 = Math.PI * 2 * t;
      const theta2 = Math.PI * 2 * t + Math.PI;
      cm2.mesh.position.x = r * Math.sin(theta1);
      cm2.mesh.position.z = r * Math.cos(theta1);
      cm3.mesh.position.x = r * Math.sin(theta2);
      cm3.mesh.position.z = r * Math.cos(theta2);
    });
  }
}
