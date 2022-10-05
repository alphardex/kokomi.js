import * as kokomi from "kokomi.js";
import * as THREE from "three";
import gsap from "gsap";
import * as dat from "lil";

class Sketch extends kokomi.Base {
  create() {
    this.camera.position.set(-0.25, 0, 1.5);

    new kokomi.OrbitControls(this);

    const params = {
      faceZ: -0.75,
      depthScale: 0.75,
      faceColor: "#ED5464",
      lineColor: "#4EC0E9",
    };

    // depth mat
    // From: three.js\examples\webgl_depth_texture.html
    const rt = new THREE.WebGLRenderTarget(
      window.innerWidth,
      window.innerHeight
    );
    rt.depthTexture = new THREE.DepthTexture(1, 1);

    const rtCamera = new THREE.PerspectiveCamera(40, 1, 2.1, 3);
    rtCamera.position.set(0, 0, 2);

    const depthMaterial = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      side: THREE.DoubleSide,
      uniforms: {
        uDepth: {
          value: rt.depthTexture,
        },
        cameraNear: {
          value: rtCamera.near,
        },
        cameraFar: {
          value: rtCamera.far,
        },
        uTime: {
          value: 0,
        },
        uDepthScale: {
          value: params.depthScale,
        },
        uFaceColor: {
          value: new THREE.Color(params.faceColor),
        },
        uLineColor: {
          value: new THREE.Color(params.lineColor),
        },
      },
    });

    // shape
    const shapeMesh = new THREE.Mesh(
      new THREE.SphereGeometry(8, 100),
      new THREE.MeshBasicMaterial({
        color: 0x000000,
      })
    );
    shapeMesh.scale.set(0.05, 0.05, 0.05);
    shapeMesh.position.set(0, 0, params.faceZ);
    this.scene.add(shapeMesh);

    // lines
    const count = 100;

    for (let i = 0; i < count; i++) {
      const geometry = new THREE.PlaneGeometry(2, 0.005, 300, 1);
      const yCoordCount = geometry.attributes.position.array.length / 3;
      const yCoord = i / count;
      const yCoords = new Float32Array(yCoordCount).fill(yCoord);
      geometry.setAttribute("aY", new THREE.BufferAttribute(yCoords, 1));
      const halfCount = count / 2;
      const lineY = (i - halfCount) / halfCount;

      const mesh = new THREE.Mesh(geometry, depthMaterial);
      this.scene.add(mesh);
      mesh.position.copy(new THREE.Vector3(0, lineY, 0));
    }

    // anime
    this.update(() => {
      this.renderer.setRenderTarget(rt);
      this.renderer.render(this.scene, rtCamera);
      this.renderer.setRenderTarget(null);

      const t = this.clock.elapsedTime;
      if (shapeMesh) {
        shapeMesh.position.z = params.faceZ + 0.2 * Math.sin(t);
      }
      depthMaterial.uniforms.uTime.value = t;
    });
  }
}
