import * as kokomi from "kokomi.js";
import * as THREE from "three";
import gsap from "gsap";
import * as dat from "lil";

// https://en.wikipedia.org/wiki/Spherical_coordinate_system#h5o-9
const calcPosFromLatLngRad = (lat, lng) => {
  let phi = lat * (Math.PI / 180);
  let theta = (lng + 180) * (Math.PI / 180);
  let x = -(Math.cos(phi) * Math.cos(theta));
  let z = Math.cos(phi) * Math.sin(theta);
  let y = Math.sin(phi);
  return { x, y, z };
};

class GlobePoint extends kokomi.Component {
  constructor(base, coord) {
    super(base);

    this.coord = coord;

    const cm = new kokomi.CustomMesh(base, {
      baseMaterial: new THREE.MeshBasicMaterial(),
      geometry: new THREE.SphereGeometry(0.01),
      vertexShader: "",
      fragmentShader: "",
      materialParams: {
        color: new THREE.Color("#ff0000"),
      },
    });
    this.cm = cm;

    const pos = calcPosFromLatLngRad(this.coord.lat, this.coord.lng);
    this.pos = pos;

    cm.mesh.position.copy(this.posVec);
  }
  addExisting() {
    this.cm.addExisting();
  }
  get posVec() {
    return new THREE.Vector3(this.pos.x, this.pos.y, this.pos.z);
  }
}

class Sketch extends kokomi.Base {
  create() {
    this.camera.position.set(0, 0, 2);

    const controls = new kokomi.OrbitControls(this);
    // controls.controls.autoRotate = true;

    // http://planetpixelemporium.com/earth8081.html
    const tex = new THREE.TextureLoader().load(
      "https://s2.loli.net/2022/09/26/wNnLXt7DJCpZhUR.jpg"
    );

    const bumpTex = new THREE.TextureLoader().load(
      "https://s2.loli.net/2022/09/26/wOxLFp8eCouSWRH.jpg"
    );

    // planet
    const g = new THREE.Group();
    this.scene.add(g);

    const cm = new kokomi.CustomMesh(this, {
      baseMaterial: new THREE.MeshStandardMaterial(),
      geometry: new THREE.SphereGeometry(1, 64, 64),
      vertexShader: "",
      fragmentShader: "",
      materialParams: {
        side: THREE.DoubleSide,
        map: tex,
        bumpMap: bumpTex,
      },
    });
    cm.addExisting();
    g.add(cm.mesh);

    const ambiLight = new THREE.AmbientLight(0xffffff, 1);
    this.scene.add(ambiLight);
    const dirLight = new THREE.DirectionalLight(0xffffff, 0.2);
    dirLight.position.set(1, 2, 3);
    this.scene.add(dirLight);

    // points
    const coords = [
      {
        lat: 31.299999,
        lng: 120.599998,
        name: "Suzhou",
      },
      {
        lat: 35.652832,
        lng: 139.839478,
        name: "Tokyo",
      },
      {
        lat: 25.105497,
        lng: 121.597366,
        name: "Taipei",
      },
    ];

    const points = coords.map((coord) => {
      const point = new GlobePoint(this, coord);
      point.addExisting();
      g.add(point.cm.mesh);
      return point;
    });

    this.scene.rotation.y = THREE.MathUtils.degToRad(150);
    this.scene.rotation.x = THREE.MathUtils.degToRad(30);

    // routes
    const getCurve = (p1, p2) => {
      const count = 20;
      const points = [...Array(count).keys()].map((item, i) => {
        const ratio = i / count;
        const p = new THREE.Vector3().lerpVectors(p1, p2, ratio);
        p.normalize();
        p.multiplyScalar(1 + Math.sin(Math.PI * ratio) * 0.04);
        return p;
      });
      const path = new THREE.CatmullRomCurve3(points);

      const geometry = new THREE.TubeGeometry(path, 20, 0.005, 8, false);

      const cm = new kokomi.CustomMesh(this, {
        baseMaterial: new THREE.ShaderMaterial(),
        geometry,
        vertexShader,
        fragmentShader,
        materialParams: {
          transparent: true,
        },
      });
      cm.addExisting();
    };

    for (let i = 0; i < points.length; i++) {
      const currentPoint = points[i];
      if (i < points.length - 1) {
        const nextPoint = points[i + 1];
        getCurve(currentPoint.posVec, nextPoint.posVec);
      }
    }
  }
}
