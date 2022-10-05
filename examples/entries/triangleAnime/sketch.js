import * as kokomi from "kokomi.js";
import * as THREE from "three";
import gsap from "gsap";
import * as dat from "lil";

class Sketch extends kokomi.Base {
  create() {
    this.camera.position.set(0, 0, 3);

    new kokomi.OrbitControls(this);

    const params = {
      progress: 0,
    };
    this.params = params;

    const cm = new kokomi.CustomMesh(this, {
      baseMaterial: new THREE.MeshStandardMaterial(),
      // geometry: new THREE.PlaneGeometry(1, 1).toNonIndexed(),
      // geometry: new THREE.SphereGeometry(1, 32, 32).toNonIndexed(),
      geometry: new THREE.IcosahedronGeometry(1, 10).toNonIndexed(),
      vertexShader,
      fragmentShader,
      materialParams: {
        side: THREE.DoubleSide,
        // wireframe: true,
      },
      uniforms: {
        uProgress: {
          value: params.progress,
        },
      },
    });
    cm.addExisting();
    this.cm = cm;

    // random
    const posCount = cm.mesh.geometry.attributes.position.count;
    const randomBuffer = kokomi.makeBuffer(posCount, () => Math.random(), 1);
    kokomi.iterateBuffer(randomBuffer, randomBuffer.length, (arr, axis) => {
      const rand = Math.random();
      arr[axis.x] = rand;
      arr[axis.y] = rand;
      arr[axis.z] = rand;
    });
    cm.mesh.geometry.setAttribute(
      "aRandom",
      new THREE.BufferAttribute(randomBuffer, 1)
    );

    // center
    kokomi.getPositionCentroids(cm.mesh.geometry);

    // lights
    const ambiLight = new THREE.AmbientLight(0xffffff, 0.4);
    this.scene.add(ambiLight);
    const dirLight = new THREE.DirectionalLight(0xffffff, 1);
    dirLight.position.set(1, 2, 3);
    this.scene.add(dirLight);

    // transition
    const duration = 3;

    const doTransition = () => {
      gsap.to(params, {
        progress: 1,
        duration,
        ease: "power1.inOut",
      });
    };

    const undoTransition = () => {
      gsap.to(params, {
        progress: 0,
        duration,
        ease: "power1.inOut",
      });
    };

    this.interactionManager.add(cm.mesh);
    cm.mesh.addEventListener("click", () => {
      const progress = params.progress;
      if (progress < 0.5) {
        doTransition();
      } else {
        undoTransition();
      }
    });

    this.update(() => {
      cm.mesh.material.uniforms.uProgress.value = params.progress;
    });

    // this.createDebug();
  }
  createDebug() {
    const params = this.params;
    const cm = this.cm;

    const gui = new dat.GUI();
    gui
      .add(params, "progress")
      .min(0)
      .max(1)
      .step(0.01)
      .onChange((val) => {
        cm.mesh.material.uniforms.uProgress.value = val;
      });
  }
}
