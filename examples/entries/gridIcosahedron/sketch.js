import * as kokomi from "kokomi.js";
import * as THREE from "three";
import gsap from "gsap";
import * as dat from "lil";

class Sketch extends kokomi.Base {
  create() {
    new kokomi.OrbitControls(this);

    this.camera.position.z = 2.2;

    const ico = new THREE.Group();
    this.scene.add(ico);

    const tex = new THREE.TextureLoader().load(
      "https://s2.loli.net/2022/08/17/FOEp341XK8ns7AW.jpg"
    );
    tex.wrapS = tex.wrapT = THREE.MirroredRepeatWrapping;

    const cm1 = new kokomi.CustomMesh(this, {
      geometry: new THREE.IcosahedronGeometry(1, 1),
      baseMaterial: new THREE.ShaderMaterial(),
      vertexShader,
      fragmentShader,
      materialParams: {
        side: THREE.DoubleSide,
      },
      uniforms: {
        uTexture: {
          value: tex,
        },
        uRefractionStrength: {
          value: 0,
        },
        uRandomEnabled: {
          value: 1,
        },
        uNoiseDensity: {
          value: 0,
        },
      },
    });
    cm1.addExisting();
    ico.add(cm1.mesh);

    const geo2 = new THREE.IcosahedronGeometry(1.001, 1);
    kokomi.getBaryCoord(geo2);
    const cm2 = new kokomi.CustomMesh(this, {
      geometry: geo2,
      baseMaterial: new THREE.ShaderMaterial(),
      vertexShader: vertexShader2,
      fragmentShader: fragmentShader2,
      materialParams: {
        side: THREE.DoubleSide,
      },
      uniforms: {
        uWidth: {
          value: 1,
        },
        uNoiseDensity: {
          value: 0,
        },
      },
    });
    cm2.addExisting();
    ico.add(cm2.mesh);

    this.update(() => {
      const t = this.clock.elapsedTime;

      ico.rotation.x = t / 15;
      ico.rotation.y = t / 15;
    });
  }
}
