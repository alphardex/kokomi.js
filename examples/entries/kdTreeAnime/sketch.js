import * as kokomi from "kokomi.js";
import * as THREE from "three";
import gsap from "gsap";
import * as dat from "lil";
import { kdTree } from "kd-tree-javascript";

class Sketch extends kokomi.Base {
  create() {
    this.camera.position.set(0, 0, 2);

    new kokomi.OrbitControls(this);

    const tex1 = new THREE.TextureLoader().load(
      "https://s2.loli.net/2022/09/08/gGY4VloDAeUwWxt.jpg"
    );

    const tex2 = new THREE.TextureLoader().load(
      "https://s2.loli.net/2022/09/08/wSYFN2izrMLulxh.jpg"
    );

    // tree
    const treeWidth = 1.92;
    const treeHeight = 1.08;
    const pointCount = 16;

    const points = [...Array(pointCount).keys()].map(() => {
      const point = {
        x: THREE.MathUtils.randFloat(0, treeWidth),
        y: THREE.MathUtils.randFloat(0, treeHeight),
      };
      return point;
    });

    const distance = (a, b) => {
      return Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2);
    };

    const tree = new kdTree([], distance, ["x", "y"]);
    points.forEach((point) => {
      tree.insert(point);
    });

    const getRects = (node, bounds) => {
      const rects = [];

      // ref: https://codepen.io/psychronautron/pen/wvRENa
      function drawRects(node, bounds) {
        let leftBounds = [];
        leftBounds[0] = bounds[0].slice(0);
        leftBounds[1] = bounds[1].slice(0);

        let rightBounds = [];
        rightBounds[0] = bounds[0].slice(0);
        rightBounds[1] = bounds[1].slice(0);

        if (node.dimension === 0) {
          // was split on x value
          leftBounds[0][1] = node.obj.x;
          rightBounds[0][0] = node.obj.x;
        } else {
          leftBounds[1][1] = node.obj.y;
          rightBounds[1][0] = node.obj.y;
        }

        if (node.left) {
          drawRects(node.left, leftBounds);
        } else {
          console.log(leftBounds);
          rects.push(leftBounds);
        }
        if (node.right) {
          drawRects(node.right, rightBounds);
        } else {
          console.log(rightBounds);
          rects.push(rightBounds);
        }
      }

      drawRects(node, bounds);

      return rects;
    };

    const rects = getRects(tree.root, [
      [0, treeWidth],
      [0, treeHeight],
    ]);

    // const axesHelper = new THREE.AxesHelper();
    // this.scene.add(axesHelper);

    console.log({ rects });

    const g = new THREE.Group();
    this.scene.add(g);

    const cms = rects.map((rect) => {
      const shape = new THREE.Shape();

      // shape.moveTo(1, 1).lineTo(1, 0).lineTo(0, 1);
      shape
        .moveTo(rect[0][0] - treeWidth / 2, rect[1][0] - treeHeight / 2)
        .lineTo(rect[0][1] - treeWidth / 2, rect[1][0] - treeHeight / 2)
        .lineTo(rect[0][1] - treeWidth / 2, rect[1][1] - treeHeight / 2)
        .lineTo(rect[0][0] - treeWidth / 2, rect[1][1] - treeHeight / 2);

      const center = new THREE.Vector3(
        (rect[0][0] + rect[0][1]) / 2 - treeWidth / 2,
        (rect[1][0] + rect[1][1]) / 2 - treeHeight / 2,
        0.05
      );

      const extrudeSettings = {
        depth: 0.1,
        bevelEnabled: false,
      };

      const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);

      const cm = new kokomi.CustomMesh(this, {
        baseMaterial: new THREE.ShaderMaterial(),
        geometry,
        vertexShader,
        fragmentShader,
        materialParams: {
          side: THREE.DoubleSide,
          // wireframe: true,
        },
        uniforms: {
          uFrontTexture: {
            value: tex1,
          },
          uBackTexture: {
            value: tex2,
          },
          uSize: {
            value: new THREE.Vector2(treeWidth, treeHeight),
          },
        },
      });
      // cm.addExisting();
      cm.mesh.userData.offset = Math.random();
      cm.mesh.userData.center = center;

      g.add(cm.mesh);

      return cm;
    });
    this.cms = cms;

    const params = {
      progress: 0,
    };
    this.params = params;

    this.update(() => {
      cms.forEach((cm, i) => {
        const offset = kokomi.saturate(
          (params.progress - 0.5 * cm.mesh.userData.offset) * 2
        );
        const angle = Math.PI * offset;

        cm.mesh.rotation.y = angle;
        cm.mesh.position.z = Math.sin(angle) * 0.3;
      });
    });

    this.container.addEventListener("mousemove", () => {
      const { x, y } = this.interactionManager.mouse;
      g.rotation.y = 0.45 * x;
      g.rotation.x = -0.3 * y;
    });

    const duration = 1.5;

    const doTransition = () => {
      gsap.to(params, {
        progress: 1,
        duration,
        ease: "power1.inOut",
      });
    };

    const undoTransition = () => {
      gsap.to(params, {
        progress: 0,
        duration,
        ease: "power1.inOut",
      });
    };

    this.interactionManager.add(g);
    g.addEventListener("click", () => {
      const progress = params.progress;
      if (progress < 0.5) {
        doTransition();
      } else {
        undoTransition();
      }
    });

    // this.createDebug();
  }
  createDebug() {
    const { params } = this;

    const gui = new dat.GUI();
    gui.add(params, "progress").min(0).max(1).step(0.01);
  }
}
