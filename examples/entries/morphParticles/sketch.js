import * as kokomi from "kokomi.js";
import * as THREE from "three";
import gsap from "gsap";
import * as dat from "lil";

class Sketch extends kokomi.Base {
  create() {
    this.camera.position.set(0, 0, 2);

    new kokomi.OrbitControls(this);

    const params = {
      rotateSpeed: 0.01,
      pointColor: "#4ec0e9",
    };

    // geo
    const geometry = new THREE.BufferGeometry();

    // sphere
    const sphereGeometry = new THREE.SphereGeometry(1, 128, 128);
    const spherePositions = kokomi.sampleParticlesPositionFromMesh(
      sphereGeometry.toNonIndexed()
    );
    geometry.setAttribute(
      "position",
      new THREE.BufferAttribute(spherePositions, 3)
    );

    // box
    const boxGeometry = new THREE.BoxGeometry(1, 1, 1, 128, 128);
    const boxPositions = kokomi.sampleParticlesPositionFromMesh(
      boxGeometry.toNonIndexed()
    );
    geometry.setAttribute(
      "aPositionBox",
      new THREE.BufferAttribute(boxPositions, 3)
    );

    // torus
    const torusGeometry = new THREE.TorusGeometry(0.7, 0.3, 128, 128);
    const torusPositions = kokomi.sampleParticlesPositionFromMesh(
      torusGeometry.toNonIndexed()
    );
    geometry.setAttribute(
      "aPositionTorus",
      new THREE.BufferAttribute(torusPositions, 3)
    );

    // points
    const cp = new kokomi.CustomPoints(this, {
      baseMaterial: new THREE.ShaderMaterial(),
      geometry,
      vertexShader,
      fragmentShader,
      materialParams: {
        side: THREE.DoubleSide,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      },
      uniforms: {
        uTransition1: {
          value: 0,
        },
        uTransition2: {
          value: 0,
        },
        uColor: {
          value: new THREE.Color(params.pointColor),
        },
      },
    });
    cp.addExisting();

    // anime
    this.update(() => {
      const rotateSpeed = params.rotateSpeed;
      this.scene.rotation.x += rotateSpeed;
      this.scene.rotation.y += rotateSpeed;
    });

    // interact
    let currentTransition = 0;

    const changeParticles = () => {
      const uniforms = cp.points.material.uniforms;
      if (currentTransition === 0) {
        gsap.to(uniforms.uTransition1, {
          value: 1,
        });
        currentTransition += 1;
      } else if (currentTransition === 1) {
        gsap.to(uniforms.uTransition2, {
          value: 1,
        });
        currentTransition += 1;
      } else if (currentTransition === 2) {
        gsap.to(uniforms.uTransition2, {
          value: 0,
        });
        currentTransition += 1;
      } else if (currentTransition === 3) {
        gsap.to(uniforms.uTransition1, {
          value: 0,
        });
        currentTransition = 0;
      }
    };

    window.addEventListener("click", () => {
      changeParticles();
    });
    window.addEventListener("touchstart", () => {
      changeParticles();
    });
  }
}
