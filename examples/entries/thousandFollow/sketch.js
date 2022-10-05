import * as kokomi from "kokomi.js";
import * as THREE from "three";
import gsap from "gsap";
import * as dat from "lil";

class Sketch extends kokomi.Base {
  async create() {
    this.camera.position.set(0, 0, 1.2);

    new kokomi.OrbitControls(this);

    const params = {
      scatterDivider: 150,
      scatterPow: 0.6,
      planeScatterDivider: 50,
      textScatterDivider: 5,
      useFresnel: 1,
    };

    // palette: https://colorhunt.co/palette/167893
    const colorParams = {
      planeColor: "#1b262c",
      spotLightColor: "#3282b8",
      textColor: "#3282b8",
    };

    // text3d
    const font = await kokomi.loadFont();

    const t3d = new kokomi.Text3D(
      this,
      "1000",
      font,
      {
        size: 0.5,
        height: 0.2,
        curveSegments: 120,
        bevelEnabled: true,
        bevelThickness: 0.03,
        bevelSize: 0.02,
        bevelOffset: 0,
        bevelSegments: 5,
      },
      {
        baseMaterial: new THREE.ShaderMaterial(),
        vertexShader,
        fragmentShader,
        materialParams: {
          side: THREE.DoubleSide,
        },
        uniforms: {
          uSpotLight: {
            value: new THREE.Vector3(0, 0, 0),
          },
          uScatterDivider: {
            value: params.textScatterDivider,
          },
          uScatterPow: {
            value: params.scatterPow,
          },
          uIsPlane: {
            value: 0,
          },
          uPlaneColor: {
            value: new THREE.Color(colorParams.planeColor),
          },
          uSpotColor: {
            value: new THREE.Color(colorParams.spotLightColor),
          },
          uIsText: {
            value: 1,
          },
          uTextColor: {
            value: new THREE.Color(colorParams.textColor),
          },
          uUseFresnel: {
            value: params.useFresnel,
          },
        },
      }
    );
    t3d.mesh.geometry.center();
    t3d.addExisting();

    // plane
    const cm = new kokomi.CustomMesh(this, {
      geometry: new THREE.PlaneGeometry(100, 100),
      baseMaterial: new THREE.ShaderMaterial(),
      vertexShader,
      fragmentShader,
      materialParams: {
        side: THREE.DoubleSide,
      },
      uniforms: {
        uSpotLight: {
          value: new THREE.Vector3(0, 0, 0),
        },
        uScatterDivider: {
          value: params.planeScatterDivider,
        },
        uScatterPow: {
          value: params.scatterPow,
        },
        uIsPlane: {
          value: 1,
        },
        uPlaneColor: {
          value: new THREE.Color(colorParams.planeColor),
        },
        uSpotColor: {
          value: new THREE.Color(colorParams.spotLightColor),
        },
        uIsText: {
          value: 0,
        },
        uTextColor: {
          value: new THREE.Color(colorParams.textColor),
        },
        uUseFresnel: {
          value: params.useFresnel,
        },
      },
    });
    cm.addExisting();

    // hover
    const rs = new kokomi.RaycastSelector(this);

    let mp = new THREE.Vector3(0, 0, 0);

    this.container.addEventListener("mousemove", () => {
      const target = rs.onChooseInclude(cm.mesh);
      if (target) {
        const p = target.point;
        mp = p;
      }
    });

    // anime
    this.update(() => {
      t3d.mesh.material.uniforms.uSpotLight.value = mp;
      cm.mesh.material.uniforms.uSpotLight.value = mp;

      if (mp) {
        this.scene.rotation.x = mp.y / 16;
        this.scene.rotation.y = mp.x / 16;
      }
    });
  }
}
