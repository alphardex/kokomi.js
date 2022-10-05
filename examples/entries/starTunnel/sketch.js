import * as kokomi from "kokomi.js";
import * as THREE from "three";
import gsap from "gsap";
import * as dat from "lil";

class Particles extends kokomi.Component {
  constructor(base, config) {
    super(base);

    const {
      count = 10000,
      pointColor1 = "#ff6030",
      pointColor2 = "#1b3984",
      pointSize = 3,
      angularVelocity = 0,
      velocity = 0.01,
    } = config;

    this.count = count;
    this.pointColor1 = pointColor1;
    this.pointColor2 = pointColor2;
    this.pointSize = pointSize;
    this.angularVelocity = angularVelocity;
    this.velocity = velocity;

    this.geometry = null;
    this.material = null;
    this.cp = null;

    this.create();
  }
  create() {
    const { base, count } = this;

    this.dispose();

    const geometry = new THREE.BufferGeometry();
    this.geometry = geometry;

    const positions = kokomi.makeBuffer(
      count,
      () => THREE.MathUtils.randFloat(-0.5, 0.5) * 50
    );
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

    const seeds = kokomi.makeBuffer(
      count,
      () => THREE.MathUtils.randFloat(0, 1),
      2
    );
    geometry.setAttribute("aSeed", new THREE.BufferAttribute(seeds, 2));

    const sizes = kokomi.makeBuffer(
      count,
      () => this.pointSize + THREE.MathUtils.randFloat(0, 1),
      1
    );
    geometry.setAttribute("aSize", new THREE.BufferAttribute(sizes, 1));

    const cp = new kokomi.CustomPoints(base, {
      geometry,
      vertexShader,
      fragmentShader,
      materialParams: {
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      },
      uniforms: {
        iColor1: {
          value: new THREE.Color(this.pointColor1),
        },
        iColor2: {
          value: new THREE.Color(this.pointColor2),
        },
        iVelocity: {
          value: this.velocity,
        },
      },
    });

    this.cp = cp;

    this.changePos();
  }
  addExisting() {
    this.cp.addExisting();
  }
  update(time) {
    if (this.cp) {
      this.cp.points.rotation.z += this.angularVelocity * 0.01;
    }
  }
  changePos() {
    const { geometry, count } = this;
    if (geometry) {
      const positionAttrib = geometry.attributes.position;

      kokomi.iterateBuffer(positionAttrib.array, count, (arr, axis) => {
        const theta = THREE.MathUtils.randFloat(0, 360);
        const r = THREE.MathUtils.randFloat(10, 50);
        const x = r * Math.cos(theta);
        const y = r * Math.sin(theta);
        const z = THREE.MathUtils.randFloat(0, 2000);
        arr[axis.x] = x;
        arr[axis.y] = y;
        arr[axis.z] = z;
      });
    }
  }
  dispose() {
    const { base } = this;
    const { scene } = base;

    if (this.geometry) {
      this.geometry.dispose();
    }

    if (this.material) {
      this.material.dispose();
    }

    if (this.cp) {
      scene.remove(this.cp.points);
    }
  }
}

const params = {
  count: 10000,
  pointColor1: "#2155CD",
  pointColor2: "#FF4949",
  angularVelocity: 0,
  fadeFactor: 0.2,
  velocity: 0.01,
};

class Sketch extends kokomi.Base {
  constructor(sel = "#sketch") {
    super(sel);

    this.particles = null;
    this.persistenceEffect = null;
  }
  create() {
    this.createCamera();

    // new kokomi.OrbitControls(this);

    this.createParticles();

    window.addEventListener("resize", () => {
      this.createParticles();
    });

    // this.createDebug();
  }
  createCamera() {
    const camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      10000
    );
    this.camera = camera;
    this.interactionManager.camera = camera;
    camera.position.z = 1000;
  }
  createParticles() {
    if (this.particles) {
      this.particles.dispose();
    }

    if (this.persistenceEffect) {
      this.persistenceEffect.disable();
    }

    const particles = new Particles(this, {
      count: params.count,
      pointColor1: params.pointColor1,
      pointColor2: params.pointColor2,
      angularVelocity: params.angularVelocity,
      velocity: params.velocity,
    });
    particles.addExisting();
    this.particles = particles;

    const persistenceEffect = new kokomi.PersistenceEffect(this, {
      fadeColor: new THREE.Color("#191919"),
      fadeFactor: params.fadeFactor,
    });
    persistenceEffect.addExisting();
    this.persistenceEffect = persistenceEffect;
  }
  createDebug() {
    const gui = new dat.GUI();

    const { particles, persistenceEffect } = this;

    const uniforms = particles?.cp.material.uniforms;

    gui
      .add(params, "count")
      .min(0)
      .max(50000)
      .step(1)
      .onChange(() => {
        this.createParticles();
      });

    gui.addColor(params, "pointColor1").onChange(() => {
      if (uniforms) {
        uniforms.iColor1.value = new THREE.Color(params.pointColor1);
      }
    });

    gui.addColor(params, "pointColor2").onChange(() => {
      if (uniforms) {
        uniforms.iColor2.value = new THREE.Color(params.pointColor2);
      }
    });

    gui
      .add(params, "angularVelocity")
      .min(0)
      .max(1)
      .step(0.001)
      .onChange(() => {
        if (particles) {
          particles.angularVelocity = params.angularVelocity;
        }
      });

    gui
      .add(params, "fadeFactor")
      .min(0)
      .max(1)
      .step(0.001)
      .onChange(() => {
        if (persistenceEffect) {
          persistenceEffect.fadeFactor = params.fadeFactor;
        }
      });

    gui
      .add(params, "velocity")
      .min(0)
      .max(0.1)
      .step(0.001)
      .onChange(() => {
        if (uniforms) {
          uniforms.iVelocity.value = params.velocity;
        }
      });
  }
}
