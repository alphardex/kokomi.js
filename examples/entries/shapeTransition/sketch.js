import * as kokomi from "kokomi.js";
import * as THREE from "three";
import gsap from "gsap";
import * as dat from "lil";

class Sketch extends kokomi.Base {
  create() {
    this.camera.position.set(0, 0, 1.4);

    new kokomi.OrbitControls(this);

    const params = {
      pointCount: 100000,
      radius1: 0.9,
      radius2: 0.4,
      circleCount1: 1,
      multiplier1: 1,
      circleCount2: 5,
      multiplier2: 4,
      chromaticBlur: 0.1,
    };

    const chromaticBlur = params.chromaticBlur * 0.1;

    const configs = [
      { color: [0.0, 0.1, 0.9], chromaticBlur: 0 },
      { color: [0.0, 0.3, 0.5], chromaticBlur: chromaticBlur },
      { color: [0.1, 0.7, 0.1], chromaticBlur: 2 * chromaticBlur },
      { color: [0.5, 0.3, 0.0], chromaticBlur: 3 * chromaticBlur },
      { color: [0.9, 0.1, 0.0], chromaticBlur: 4 * chromaticBlur },
    ];

    const pointCount = params.pointCount;
    const angles = Array.from(
      { length: pointCount },
      () => 2 * Math.PI * Math.random()
    );

    const jitter = Array.from({ length: pointCount }, () => Math.random());

    const circleCenters = (radius, N) => {
      if (N === 1) {
        return [{ x: 0, y: 0 }];
      }
      let centers = [];
      for (let i = 0; i < N; i++) {
        const angle = (i * 2 * Math.PI) / N;
        const x = radius * Math.sin(angle);
        const y = radius * Math.cos(angle);
        const center = { x, y };
        centers.push(center);
      }
      return centers;
    };

    const createPoints = (centers, radius, multiplier) => {
      const pointCount = params.pointCount;
      let points = [];
      for (let i = 0; i < pointCount; i++) {
        const angle = angles[i];
        const offsetX = radius * Math.sin(multiplier * angle);
        const offsetY = radius * Math.cos(multiplier * angle);
        const center = centers[i % centers.length];
        const x = center.x + offsetX;
        const y = center.y + offsetY;
        points.push(x, y, 0);
      }
      return points;
    };

    const createShape = ({ color = [0.0, 0.1, 0.9], chromaticBlur = 0 }) => {
      // geometry
      const geometry = new THREE.BufferGeometry();

      // shape1
      const centers1 = circleCenters(params.radius1, params.circleCount1);
      const points1 = createPoints(
        centers1,
        params.radius1,
        params.multiplier1
      );
      const shape1Position = new Float32Array(points1);
      geometry.setAttribute(
        "position",
        new THREE.BufferAttribute(shape1Position, 3)
      );

      // shape2
      const centers2 = circleCenters(params.radius2, params.circleCount2);
      const points2 = createPoints(
        centers2,
        params.radius2,
        params.multiplier2
      );
      const shape2Position = new Float32Array(points2);
      geometry.setAttribute(
        "aPositionShape2",
        new THREE.BufferAttribute(shape2Position, 3)
      );

      // jitter
      const jitterPosition = new Float32Array(jitter);
      geometry.setAttribute(
        "aJitter",
        new THREE.BufferAttribute(jitterPosition, 3)
      );

      const cm = new kokomi.CustomPoints(this, {
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
          uColor: {
            value: new THREE.Color(color[0], color[1], color[2]),
          },
          uChromaticBlur: {
            value: chromaticBlur,
          },
        },
      });
      cm.addExisting();
    };

    configs.forEach((config) => {
      createShape(config);
    });
  }
}
