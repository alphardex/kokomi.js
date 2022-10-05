import * as kokomi from "kokomi.js";
import * as THREE from "three";
import gsap from "gsap";
import * as dat from "lil";

class Sketch extends kokomi.Base {
  create() {
    this.camera.position.z = 600;

    this.camera.near = 100;
    this.camera.far = 1000;
    this.camera.updateProjectionMatrix();

    new kokomi.OrbitControls(this);

    const pointSize = 4;

    const params = {
      mapOffsetX: -80,
      mapOffsetY: 160,
      activePointPerLine: 100,
      opacityRate: 15,
      pointSize: 30000,
      pointSpeed: 1,
      pointColor: "#4ec0e9",
    };

    // get svg path
    const lines = [];

    const paths = [...document.querySelectorAll(".svg-particles path")];
    paths.forEach((path) => {
      const points = [];
      const pathPoints = kokomi.getPointsInPath(path, pointSize);
      pathPoints.forEach((point) => {
        let { x, y } = point;
        // 使点在屏幕正中央
        x -= params.mapOffsetX;
        y -= params.mapOffsetY;
        // 加点随机性
        const randX = THREE.MathUtils.randFloat(-1.5, 1.5);
        const randY = THREE.MathUtils.randFloat(-1.5, 1.5);
        x += randX;
        y += randY;
        points.push(new THREE.Vector3(x, y, 0));
      });
      const line = {
        points,
        pointCount: points.length,
        currentPos: 0,
      };
      lines.push(line);
    });

    // particles
    let activePointCount = 0;
    activePointCount = lines.length * params.activePointPerLine;

    const geometry = new THREE.BufferGeometry();
    const pointCoords = lines
      .map((line) => line.points.map((point) => [point.x, point.y, point.z]))
      .flat(1)
      .slice(0, activePointCount)
      .flat(1);
    const positions = new Float32Array(pointCoords);

    const opacitys = new Float32Array(positions.length).map(
      () => Math.random() / params.opacityRate
    );

    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("aOpacity", new THREE.BufferAttribute(opacitys, 1));

    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      side: THREE.DoubleSide,
      transparent: true,
      blending: THREE.AdditiveBlending,
      uniforms: {
        uSize: {
          value: params.pointSize,
        },
        uColor: {
          value: new THREE.Color(params.pointColor),
        },
      },
    });

    const points = new THREE.Points(geometry, material);
    this.scene.add(points);

    this.update(() => {
      if (points) {
        let activePoint = 0;
        lines.forEach((line) => {
          // 使线的前n个点动起来
          line.currentPos += params.pointSpeed;
          for (let i = 0; i < params.activePointPerLine; i++) {
            const currentIndex = (line.currentPos + i) % line.pointCount;
            // 将数据同步到着色器上
            const point = line.points[currentIndex];
            if (point) {
              const { x, y, z } = point;
              positions.set([x, y, z], activePoint * 3);
              opacitys.set(
                [i / (params.activePointPerLine * params.opacityRate)],
                activePoint
              );
              activePoint++;
            }
          }
        });
        geometry.attributes.position.needsUpdate = true;
      }
    });
  }
}
