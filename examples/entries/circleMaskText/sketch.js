import * as kokomi from "kokomi.js";
import * as THREE from "three";
import gsap from "gsap";
import * as dat from "lil";

class Sketch extends kokomi.Base {
  create() {
    this.camera.position.set(0, 0, 2);

    new kokomi.OrbitControls(this);

    // text
    const text = "ALPHARDEX";
    const tm = new kokomi.TextMesh(this, text);
    tm.mesh.fontSize = 0.5;
    tm.mesh.strokeWidth = 0.01;
    tm.mesh.strokeColor = new THREE.Color("white");
    tm.addExisting();

    const uj = new kokomi.UniformInjector(this);

    const mat = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        ...uj.shadertoyUniforms,
        uDevicePixelRatio: {
          value: window.devicePixelRatio,
        },
        uMaskRadius: {
          value: 100,
        },
      },
    });
    tm.mesh.material = mat;

    this.update(() => {
      uj.injectShadertoyUniforms(mat.uniforms);
    });

    // particles
    const count = 1000;
    const particleGeo = new THREE.BufferGeometry();
    const posBuffer = kokomi.makeBuffer(
      count,
      () => THREE.MathUtils.randFloat(-0.5, 0.5) * 3
    );
    kokomi.iterateBuffer(posBuffer, count, (arr, axis) => {
      arr[axis.x] = THREE.MathUtils.randFloat(-0.5, 0.5) * 3;
      arr[axis.y] = THREE.MathUtils.randFloat(-0.5, 0.5) * 3;
      arr[axis.z] = THREE.MathUtils.randFloat(-0.5, 0.5) * 1;
    });
    particleGeo.setAttribute(
      "position",
      new THREE.BufferAttribute(posBuffer, 3)
    );
    const pIndexBuffer = kokomi.makeBuffer(count, (i) => i, 1);
    particleGeo.setAttribute(
      "pIndex",
      new THREE.BufferAttribute(pIndexBuffer, 1)
    );

    const pm = new kokomi.CustomPoints(this, {
      baseMaterial: new THREE.ShaderMaterial(),
      geometry: particleGeo,
      vertexShader: vertexShader2,
      fragmentShader: fragmentShader2,
      materialParams: {
        side: THREE.DoubleSide,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      },
      uniforms: {
        uDevicePixelRatio: {
          value: window.devicePixelRatio,
        },
        uMaskRadius: {
          value: 150,
        },
        uHover: {
          value: new THREE.Vector3(0, 0, 0),
        },
        uHit: {
          value: 0,
        },
      },
    });
    pm.addExisting();

    // hover effect
    const rs = new kokomi.RaycastSelector(this);

    // hit plane
    const hitPlane = new THREE.Mesh(
      new THREE.PlaneGeometry(4, tm.mesh.fontSize / 2, 10, 10),
      new THREE.MeshBasicMaterial({
        wireframe: true,
        side: THREE.DoubleSide,
      })
    );
    this.scene.add(hitPlane);
    hitPlane.position.z = 0.9;
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

        const uniforms = pm.points.material.uniforms;
        gsap.to(uniforms.uHover.value, {
          x: p.x,
        });
        gsap.to(uniforms.uHover.value, {
          y: p.y,
        });
        gsap.to(uniforms.uHover.value, {
          z: p.z,
        });
      }
    });

    this.interactionManager.add(tm.mesh);
    tm.mesh.addEventListener("mouseover", () => {
      const uniforms = pm.points.material.uniforms;
      gsap.to(uniforms.uHit, {
        value: 1,
      });
    });
    tm.mesh.addEventListener("mouseout", () => {
      const uniforms = pm.points.material.uniforms;
      gsap.to(uniforms.uHit, {
        value: 0,
      });
    });
  }
}
