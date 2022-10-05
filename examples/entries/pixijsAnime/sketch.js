import * as kokomi from "kokomi.js";
import * as THREE from "three";
import gsap from "gsap";
import * as dat from "lil";

class Sketch extends kokomi.Base {
  create() {
    const screenCamera = new kokomi.ScreenCamera(this);
    screenCamera.addExisting();

    // new kokomi.OrbitControls(this);

    const outerTex = new THREE.TextureLoader().load(
      "https://s2.loli.net/2022/09/08/gGY4VloDAeUwWxt.jpg"
    );

    const innerTex = new THREE.TextureLoader().load(
      "https://s2.loli.net/2022/09/08/wSYFN2izrMLulxh.jpg"
    );

    const maskTex = new THREE.TextureLoader().load(
      "https://s2.loli.net/2022/09/19/kfi6G8LcSRXygvt.png"
    );

    // mask
    const cm = new kokomi.CustomMesh(this, {
      baseMaterial: new THREE.MeshLambertMaterial(),
      geometry: new THREE.PlaneGeometry(window.innerWidth, window.innerHeight),
      vertexShader,
      fragmentShader,
      materialParams: {
        side: THREE.DoubleSide,
        transparent: true,
      },
      uniforms: {
        uBackground: {
          value: innerTex,
        },
        uMask: {
          value: maskTex,
        },
      },
    });
    cm.addExisting();
    cm.mesh.position.z += 1;

    // bg
    const cm2 = new kokomi.CustomMesh(this, {
      baseMaterial: new THREE.MeshBasicMaterial(),
      geometry: new THREE.PlaneGeometry(window.innerWidth, window.innerHeight),
      materialParams: {
        side: THREE.DoubleSide,
        map: outerTex,
      },
      vertexShader: "",
      fragmentShader: "",
    });
    cm2.addExisting();

    // hover
    const rs = new kokomi.RaycastSelector(this);

    let mp = new THREE.Vector3(0, 0, 0);

    this.container.addEventListener("mousemove", () => {
      const target = rs.onChooseIntersect(cm.mesh);
      if (target) {
        const p = target.point;
        mp = p;
      }
    });

    // blob
    const count = 50;
    const unit = window.innerWidth / 10;
    const cm3 = new kokomi.CustomMesh(this, {
      baseMaterial: new THREE.MeshBasicMaterial(),
      geometry: new THREE.PlaneGeometry(unit * 2, unit * 2),
      materialParams: {
        side: THREE.DoubleSide,
        map: maskTex,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        opacity: 0.9,
      },
      vertexShader: "",
      fragmentShader: "",
    });
    cm3.addExisting();
    cm3.mesh.position.z += 2;
    this.scene.remove(cm3.mesh);

    // rt
    const scene1 = new THREE.Scene();

    const rt = new kokomi.RenderTexture(this, {
      rtScene: scene1,
      rtCamera: screenCamera.camera,
    });

    // rt as mask
    cm.mesh.material.uniforms.uMask.value = rt.texture;

    // blobs
    const blobs = [...Array(count).keys()].map((item, i) => {
      const blob = cm3.mesh.clone();
      // this.scene.add(blob);
      scene1.add(blob);

      const theta = THREE.MathUtils.randFloat(0, 2 * Math.PI);
      const r = THREE.MathUtils.randFloat(unit, unit * 2);
      const x = r * Math.cos(theta);
      const y = r * Math.sin(theta);

      blob.position.x = x;
      blob.position.y = y;
      blob.position.z = 2 + i;
      blob.userData.life = THREE.MathUtils.randFloat(-2 * Math.PI, 2 * Math.PI);
      return blob;
    });

    // anime
    this.update(() => {
      blobs.forEach((blob) => {
        blob.userData.life += 0.1;
        blob.scale.setScalar(Math.sin(0.5 * blob.userData.life));

        if (blob.userData.life > 2 * Math.PI) {
          blob.userData.life = -2 * Math.PI;

          const theta = THREE.MathUtils.randFloat(0, 2 * Math.PI);
          const r = THREE.MathUtils.randFloat(unit * 0.5, unit * 1.4);
          const x = r * Math.cos(theta);
          const y = r * Math.sin(theta);

          const newPos = new THREE.Vector3(mp.x + x, mp.y + y, mp.z);
          blob.position.copy(newPos);
        }
      });
    });
  }
}
