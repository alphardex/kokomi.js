import * as kokomi from "kokomi.js";
import * as THREE from "three";
import gsap from "gsap";
import * as dat from "lil";

class Sketch extends kokomi.Base {
  create() {
    this.camera.position.set(0, 0, 3);

    new kokomi.OrbitControls(this);

    const params = {
      spikeCount: 18,
      spikeLength: 2,
      impulseIntensity: {
        x: 1.6,
        y: 0.4,
      },
      rotationAcceleration: 0.24,
      impulseDecay: {
        x: 0.9,
        y: 0.9,
      },
      rotationYSpeed: 0.001,
      color1: "#00ADB5",
      color2: "#EEEEEE",
    };

    const cm = new kokomi.CustomMesh(this, {
      baseMaterial: new THREE.ShaderMaterial(),
      geometry: new THREE.SphereGeometry(1, 256, 256),
      vertexShader,
      fragmentShader,
      materialParams: {
        side: THREE.DoubleSide,
      },
      uniforms: {
        uSpikeCount: {
          value: params.spikeCount,
        },
        uSpikeLength: {
          value: params.spikeLength,
        },
        uColor1: {
          value: new THREE.Color(params.color1),
        },
        uColor2: {
          value: new THREE.Color(params.color2),
        },
        uImpulse: {
          value: new THREE.Vector2(0, 0),
        },
        uSceneRotationY: {
          value: 0,
        },
      },
    });
    cm.addExisting();

    // impulse
    let impulse = new THREE.Vector2(0, 0);

    const calcImpulse = () => {
      const deltaX = this.iMouse.mouseDOMDelta.x / window.innerWidth;
      const deltaY = -this.iMouse.mouseDOMDelta.y / window.innerHeight;
      const direction =
        ((cm.mesh.rotation.x + Math.PI / 2) / Math.PI) % 2 > 1 ? -1 : 1;

      impulse.x += deltaX * params.impulseIntensity.x * direction;
      impulse.y -= deltaY * params.impulseIntensity.y;
      impulse.x *= params.impulseDecay.x;
      impulse.y *= params.impulseDecay.y;
    };

    // anime
    this.update(() => {
      calcImpulse();

      cm.mesh.rotation.y +=
        impulse.x * params.rotationAcceleration + params.rotationYSpeed;
      cm.mesh.rotation.x += impulse.y * params.rotationAcceleration;
      cm.mesh.material.uniforms.uSceneRotationY.value = cm.mesh.rotation.y;
      cm.mesh.material.uniforms.uImpulse.value = new THREE.Vector2(
        impulse.x,
        impulse.y
      );
    });
  }
}
