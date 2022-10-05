import * as kokomi from "kokomi.js";
import * as THREE from "three";
import gsap from "gsap";
import * as dat from "lil";
import { MeshLine, MeshLineMaterial } from "three.meshline";

class Sketch extends kokomi.Base {
  create() {
    this.camera.position.set(0, 0, 2);

    new kokomi.OrbitControls(this);

    const tex1 = new THREE.TextureLoader().load(
      "https://s2.loli.net/2022/09/22/EsdxmLnXPfOSgUA.png"
    );
    tex1.wrapS = THREE.RepeatWrapping;
    tex1.wrapT = THREE.RepeatWrapping;

    // sphere
    const sphereGeo = new THREE.SphereGeometry(1, 30, 30);
    const cm = new kokomi.CustomMesh(this, {
      baseMaterial: new THREE.MeshBasicMaterial(),
      vertexShader,
      fragmentShader,
      geometry: sphereGeo,
      materialParams: {
        side: THREE.DoubleSide,
        wireframe: true,
      },
    });
    cm.addExisting();
    cm.mesh.visible = false;

    // curve
    const count = 7;
    const curvePoints = [...Array(count).keys()].map((item, i) => {
      const theta = (i / count) * Math.PI * 2;
      const point = new THREE.Vector3(
        Math.cos(theta),
        Math.sin(theta),
        Math.sin(theta * 3)
      ).setFromSphericalCoords(
        1,
        Math.PI / 2 + (Math.random() - 0.5) * 0.9,
        theta
      );
      return point;
    });
    const curve = new THREE.CatmullRomCurve3(curvePoints);
    curve.tension = 0.7;
    curve.closed = true;
    const points = curve.getPoints(1000);

    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const material = new THREE.LineBasicMaterial({ color: 0xff0000 });
    const curveObject = new THREE.Line(geometry, material);
    this.scene.add(curveObject);
    curveObject.visible = false;

    // ribbon
    const line = new MeshLine();
    line.setGeometry(new THREE.BufferGeometry().setFromPoints(points));
    const ribbonGeometry = line.geometry;
    const ribbonMaterial = new MeshLineMaterial({
      useMap: true,
      map: tex1,
      lineWidth: 0.25,
      transparent: true,
      alphaTest: 0.5,
    });
    const ribbon = new THREE.Mesh(ribbonGeometry, ribbonMaterial);
    this.scene.add(ribbon);

    // anime
    this.update(() => {
      const t = this.clock.elapsedTime * 0.1;
      ribbon.material.uniforms.offset.value.x = t;
    });
  }
}
