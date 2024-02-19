import * as kokomi from "kokomi.js";
import * as THREE from "three";
import gsap from "gsap";
import * as dat from "lil-gui";

class RippleWave extends kokomi.Component {
  constructor(base, config) {
    super(base);

    const { camera, texture, waveAmount = 25 } = config;

    const size = {
      width: window.innerWidth,
      height: window.innerHeight,
    };
    const aspect = size.width / size.height;
    this.aspect = aspect;

    const waveDatas = [...Array(waveAmount)].map((item) => ({
      progress: 0,
      center: new THREE.Vector2(0, 0),
      frequency: 0,
      amplitude: 0,
      speed: 5,
    }));

    const { width, height } = kokomi.calcPerspectiveScreenSize(
      0,
      camera,
      aspect
    );

    const cm = new kokomi.CustomMesh(this, {
      baseMaterial: new THREE.ShaderMaterial(),
      geometry: new THREE.PlaneGeometry(1, 1, 256, 256),
      vertexShader: vertexShader2,
      fragmentShader: fragmentShader2,
      materialParams: {
        side: THREE.DoubleSide,
        defines: {
          WAVE_AMOUNT: waveAmount,
        },
      },
      uniforms: {
        uTexture: {
          value: texture,
        },
        uAspect: {
          value: aspect,
        },
        uWaves: {
          value: waveDatas,
        },
      },
    });
    cm.mesh.scale.set(width, height, 1);
    cm.mesh.scale.multiply(new THREE.Vector3(1.1, 1.1, 1));
    this.cm = cm;

    const waves = cm.mesh.material.uniforms.uWaves.value;
    this.waves = waves;
  }
  addExisting() {
    this.container.add(this.cm.mesh);
  }
  playWaveAnime(wave, waveConfig, animeConfig = {}) {
    wave = Object.assign(wave, waveConfig);

    gsap.fromTo(
      wave,
      {
        progress: 0,
      },
      {
        progress: 1,
        duration: 2,
        ease: "none",
        ...animeConfig,
      }
    );
  }
  playCenterWave() {
    const targetWave = this.waves.slice(-1)[0];
    this.playWaveAnime(targetWave, {
      frequency: 3,
      amplitude: 0.05,
    });
  }
  playRandomWaves() {
    const targetWaves = this.waves.slice(10, 15);
    const singleDelay = 0.2;
    targetWaves.forEach((wave, i) => {
      this.playWaveAnime(
        wave,
        {
          frequency: 3,
          amplitude: 0.03,
          center: new THREE.Vector2(
            THREE.MathUtils.randFloatSpread(1 * this.aspect),
            THREE.MathUtils.randFloatSpread(1)
          ),
        },
        {
          delay: singleDelay * i,
          repeat: -1,
          repeatDelay: singleDelay * targetWaves.length * 1.5,
        }
      );
    });
  }
  playCornerWaves() {
    const targetWaves = this.waves.slice(20, 24);
    const centers = [
      new THREE.Vector2(1, 0),
      new THREE.Vector2(-1, 0),
      new THREE.Vector2(0, 1),
      new THREE.Vector2(0, -1),
    ];
    targetWaves.forEach((wave, i) => {
      this.playWaveAnime(
        wave,
        {
          frequency: 6,
          amplitude: 0.03,
          center: centers[i],
        },
        {
          duration: 3,
          repeat: -1,
          repeatDelay: 1,
        }
      );
    });
  }
}

class Sketch extends kokomi.Base {
  async create() {
    // 新版three.js的颜色、光照与旧版不兼容，要手动调整
    THREE.ColorManagement.enabled = false;
    this.renderer.outputColorSpace = THREE.LinearSRGBColorSpace;
    this.renderer.useLegacyLights = true;

    const screenCamera = new kokomi.ScreenCamera(this);
    screenCamera.addExisting();

    this.scene.background = new THREE.Color("#293150");

    // new kokomi.OrbitControls(this);

    // functions
    const start = async () => {
      document.querySelector(".loader-screen").classList.add("hollow");
    };

    // scroller
    const scroller = new kokomi.NormalScroller(this);
    scroller.scroll.ease = 0.025;
    scroller.listenForScroll();

    // load font
    await kokomi.preloadSDFFont("../../assets/HYWenHei-85W.ttf");

    // scene1
    const rtScene1 = new THREE.Scene();
    const rtCamera1 = new kokomi.ScreenCamera(this).camera;

    rtScene1.background = new THREE.Color("#293150");

    const wt = new kokomi.MojiGroup(this, {
      scroller,
      vertexShader,
      fragmentShader,
      textMeshConfig: {
        letterSpacing: 0.05,
      },
    });
    wt.container = rtScene1;
    wt.addExisting();

    const ga = new kokomi.Gallery(this, {
      scroller,
    });
    ga.container = rtScene1;
    ga.addExisting();

    await ga.checkImagesLoaded();

    const rt1 = new kokomi.RenderTexture(this, {
      rtScene: rtScene1,
      rtCamera: rtCamera1,
    });

    const quad1 = new kokomi.RenderQuad(this, rt1.texture, {
      materialParams: {
        opacity: 0,
      },
    });
    quad1.addExisting();
    quad1.mesh.position.z = -1;

    // scene2
    const rtScene2 = new THREE.Scene();
    const rtCamera2 = new THREE.PerspectiveCamera(
      70,
      window.innerWidth / window.innerHeight,
      0.01,
      100
    );
    rtCamera2.position.z = 1;

    const tex = new THREE.TextureLoader().load(
      "https://s2.loli.net/2022/09/08/gGY4VloDAeUwWxt.jpg"
    );

    const rw = new RippleWave(this, {
      camera: rtCamera2,
      texture: rt1.texture,
      // texture: tex,
    });
    rw.container = rtScene2;
    rw.addExisting();

    const rt2 = new kokomi.RenderTexture(this, {
      rtScene: rtScene2,
      rtCamera: rtCamera2,
    });

    const quad2 = new kokomi.RenderQuad(this, rt2.texture);
    quad2.addExisting();
    quad2.mesh.position.z = -2;

    await start();

    await kokomi.sleep(500);

    rw.playCenterWave();

    await kokomi.sleep(1500);

    rw.playRandomWaves();
  }
}
