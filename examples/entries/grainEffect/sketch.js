import * as kokomi from "kokomi.js";
import * as THREE from "three";
import gsap from "gsap";
import * as dat from "lil";

class Sketch extends kokomi.Base {
  create() {
    this.camera.position.set(0, 0, 2);

    new kokomi.OrbitControls(this);

    const geometry = new THREE.SphereGeometry(0.5, 64, 64);
    const material = new THREE.ShaderMaterial({
      vertexShader: THREE.ShaderLib.lambert.vertexShader,
      fragmentShader,
      uniforms: THREE.UniformsUtils.merge([
        THREE.ShaderLib.lambert.uniforms,
        {
          uColor: {
            value: new THREE.Color(0x51b1f5),
          },
        },
      ]),
      lights: true,
      transparent: true,
    });
    const mesh = new THREE.Mesh(geometry, material);
    this.scene.add(mesh);

    const spotLight = new THREE.SpotLight(0xffffff, 1.8);
    spotLight.position.set(0, 5, 4);
    this.scene.add(spotLight);
  }
}
