import * as kokomi from "kokomi.js";
import * as THREE from "three";
import gsap from "gsap";
import * as dat from "lil";

class Sketch extends kokomi.Base {
  create() {
    this.camera.position.set(0, 0.5, 1);

    new kokomi.OrbitControls(this);

    const rs = new kokomi.RaycastSelector(this);

    const createGalaxy = (config) => {
      const {
        count = 10000,
        minRadius = 0.5,
        maxRadius = 1,
        color = "#f7b373",
        size = 1,
        amp = 1,
        randSizeMax = 0.75,
        randSizeMin = 1.25,
      } = config;
      const geometry = new THREE.InstancedBufferGeometry();
      geometry.instanceCount = count;
      const particleGeo = new THREE.PlaneGeometry(1, 1);
      geometry.setAttribute("position", particleGeo.getAttribute("position"));
      geometry.index = particleGeo.index;

      const posBuffer = kokomi.makeBuffer(
        count,
        () => THREE.MathUtils.randFloat(-0.25, 0.25) * 5.5
      );
      geometry.setAttribute(
        "aPosition",
        new THREE.InstancedBufferAttribute(posBuffer, 3)
      );
      kokomi.iterateBuffer(posBuffer, count, (arr, axis) => {
        const theta = Math.random() * 2 * Math.PI;
        const r = THREE.MathUtils.randFloat(minRadius, maxRadius);
        arr[axis.x] = r * Math.cos(theta);
        arr[axis.y] = THREE.MathUtils.randFloat(-0.5, 0.5) * 0.1;
        arr[axis.z] = r * Math.sin(theta);
      });
      const opacityBuffer = kokomi.makeBuffer(
        count,
        () => THREE.MathUtils.randFloat(0.4, 1),
        1
      );
      geometry.setAttribute(
        "aOpacity",
        new THREE.InstancedBufferAttribute(opacityBuffer, 1)
      );

      const particleSize =
        size * THREE.MathUtils.randFloat(randSizeMin, randSizeMax);

      const uj = new kokomi.UniformInjector(this);

      const material = new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader,
        side: THREE.DoubleSide,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        uniforms: {
          ...uj.shadertoyUniforms,
          uColor: {
            value: new THREE.Color(color),
          },
          uSize: {
            value: particleSize,
          },
          uHover: {
            value: new THREE.Vector3(0, 0, 0),
          },
          uAmp: {
            value: amp,
          },
        },
      });

      this.update(() => {
        uj.injectShadertoyUniforms(material.uniforms);
      });

      const galaxy = new THREE.Mesh(geometry, material);
      this.scene.add(galaxy);

      return galaxy;
    };

    // palette: https://www.pinterest.jp/pin/305681893448133638/
    const configs = [
      {
        count: 10000,
        minRadius: 0.3,
        maxRadius: 1.5,
        size: 1,
        color: "#d1a657",
        amp: 1,
        randSizeMax: 0.7,
        randSizeMin: 1.3,
      },
      {
        count: 20000,
        minRadius: 0.3,
        maxRadius: 1.5,
        size: 0.7,
        color: "#62b1cf",
        amp: 3,
        randSizeMax: 0.9,
        randSizeMin: 1.1,
      },
    ];
    const galaxies = configs.map((config) => {
      return createGalaxy(config);
    });

    // hover effect
    // hit plane
    const hitPlane = new THREE.Mesh(
      new THREE.PlaneGeometry(10, 10, 10, 10).rotateX(Math.PI / 2),
      new THREE.MeshBasicMaterial({
        wireframe: true,
        side: THREE.DoubleSide,
      })
    );
    this.scene.add(hitPlane);
    hitPlane.visible = false;

    // test sphere
    const testSphere = new THREE.Mesh(
      new THREE.SphereGeometry(0.1, 10, 10),
      new THREE.MeshBasicMaterial({
        color: new THREE.Color("#ff0000"),
        wireframe: true,
      })
    );
    this.scene.add(testSphere);
    testSphere.visible = false;

    // mouse
    this.container.addEventListener("mousemove", (e) => {
      const target = rs.onChooseIntersect(hitPlane);
      if (target) {
        const p = target.point;
        testSphere.position.copy(p);

        galaxies.forEach((galaxy) => {
          const material = galaxy.material;
          const uniforms = material.uniforms;
          gsap.to(uniforms.uHover.value, {
            x: p.x,
          });
          gsap.to(uniforms.uHover.value, {
            y: p.y,
          });
          gsap.to(uniforms.uHover.value, {
            z: p.z,
          });
        });
      }
    });
  }
}
