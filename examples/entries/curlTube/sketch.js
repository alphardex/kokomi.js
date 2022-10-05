import * as kokomi from "kokomi.js";
import * as THREE from "three";
import gsap from "gsap";
import * as dat from "lil";

class Sketch extends kokomi.Base {
  create() {
    this.camera.position.set(0, 0, 1.2);

    new kokomi.OrbitControls(this);

    // palette: https://colorhunt.co/palette/167893
    const colorParams = {
      planeColor: "#1b262c",
      tubeColor: "#3282b8",
      spotLightColor: "#3282b8",
    };

    const params = {
      tubeCount: 150,
      tubePointCount: 600,
      tubePointScale: 1,
      scatterDivider: 150,
      scatterPow: 0.6,
      planeScatterDivider: 150,
      tubeScatterDivider: 15,
      velocity: 0.5,
      tubeThreshold: 0.3,
    };

    // scatter mat
    const scatterMaterial = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      side: THREE.DoubleSide,
      uniforms: {
        uTime: {
          value: 0,
        },
        uMouse: {
          value: new THREE.Vector2(0, 0),
        },
        uResolution: {
          value: new THREE.Vector2(window.innerWidth, window.innerHeight),
        },
        uSpotLight: {
          value: new THREE.Vector3(0, 0, 0),
        },
        uScatterDivider: {
          value: params.scatterDivider,
        },
        uScatterPow: {
          value: params.scatterPow,
        },
        uIsTube: {
          value: 0,
        },
        uIsPlane: {
          value: 0,
        },
        uPlaneColor: {
          value: new THREE.Color(colorParams.planeColor),
        },
        uTubeColor: {
          value: new THREE.Color(colorParams.tubeColor),
        },
        uSpotColor: {
          value: new THREE.Color(colorParams.spotLightColor),
        },
        uVelocity: {
          value: params.velocity,
        },
        uTubeThreshold: {
          value: params.tubeThreshold,
        },
      },
    });

    // tube mat
    const tubeMaterial = scatterMaterial.clone();
    tubeMaterial.uniforms.uScatterDivider.value = params.tubeScatterDivider;
    tubeMaterial.uniforms.uIsTube.value = 1;

    const createCurve = ({
      startPoint = new THREE.Vector3(0, 0, 0),
      pointCount = 600,
      pointScale = 1,
    }) => {
      const currentPoint = startPoint.clone();
      const points = [...Array(pointCount).keys()].map((item) => {
        const noise = kokomi.computeCurl(
          currentPoint.x * pointScale,
          currentPoint.y * pointScale,
          currentPoint.z * pointScale
        );
        currentPoint.addScaledVector(noise, 0.001);
        return currentPoint.clone();
      });
      const curve = new THREE.CatmullRomCurve3(points);
      return curve;
    };

    const createTube = (
      curveConfig = {
        startPoint: new THREE.Vector3(0, 0, 0),
        pointCount: 600,
        pointScale: 1,
      }
    ) => {
      const curve = createCurve(curveConfig);
      const geometry = new THREE.TubeGeometry(curve, 600, 0.005, 8);
      const material = tubeMaterial;
      const mesh = new THREE.Mesh(geometry, material);
      this.scene.add(mesh);
      return mesh;
    };

    // tube group
    const tubeGroup = new THREE.Group();
    for (let i = 0; i < params.tubeCount; i++) {
      const mesh = createTube({
        startPoint: new THREE.Vector3(
          THREE.MathUtils.randFloat(-0.5, 0.5),
          THREE.MathUtils.randFloat(-0.5, 0.5),
          THREE.MathUtils.randFloat(-0.5, 0.5)
        ),
        pointCount: params.tubePointCount,
        pointScale: params.tubePointScale,
      });
      tubeGroup.add(mesh);
    }
    this.scene.add(tubeGroup);

    // plane
    const planeMaterial = scatterMaterial.clone();
    planeMaterial.uniforms.uScatterDivider.value = params.planeScatterDivider;
    planeMaterial.uniforms.uIsPlane.value = 1;

    const planeGeometry = new THREE.PlaneGeometry(100, 100);
    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    this.scene.add(plane);

    // hover
    const rs = new kokomi.RaycastSelector(this);

    let mp = new THREE.Vector3(0, 0, 0);

    this.container.addEventListener("mousemove", () => {
      const target = rs.onChooseInclude(plane);
      if (target) {
        const p = target.point;
        mp = p;
      }
    });

    // anime
    this.update(() => {
      const t = this.clock.elapsedTime;

      tubeMaterial.uniforms.uTime.value = t;

      tubeMaterial.uniforms.uSpotLight.value = mp;
      planeMaterial.uniforms.uSpotLight.value = mp;

      if (mp) {
        this.scene.rotation.x = mp.y / 16;
        this.scene.rotation.y = mp.x / 16;
      }
    });
  }
}
