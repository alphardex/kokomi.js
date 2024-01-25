import * as kokomi from "kokomi.js";
import * as THREE from "three";
import gsap from "gsap";
import * as dat from "lil-gui";

class Sketch extends kokomi.Base {
  create() {
    this.camera.position.set(0, 20, 20);
    this.camera.fov = 65;
    this.camera.updateProjectionMatrix();

    new kokomi.OrbitControls(this);

    const am = new kokomi.AssetManager(this, [
      {
        name: "hdr",
        type: "hdrTexture",
        path: "https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/syferfontein_0d_clear_puresky_1k.hdr",
      },
    ]);

    am.on("ready", () => {
      document.querySelector(".loader-screen").classList.add("hollow");

      const envMap = kokomi.getEnvmapFromHDRTexture(
        this.renderer,
        am.items["hdr"]
      );
      this.scene.environment = envMap;
      this.scene.background = envMap;

      const uj = new kokomi.UniformInjector(this);

      const geometry = new THREE.SphereGeometry(3, 512, 512);
      const material = new kokomi.CustomShaderMaterial({
        baseMaterial: new kokomi.GlassMaterial({
          roughness: 0,
          transmission: 0.9,
          thickness: 0.3,
          clearcoat: 0.4,
          anisotropy: 0.2,
          ior: 1.25,
        }),
        vertexShader,
        fragmentShader,
        uniforms: {
          ...uj.shadertoyUniforms,
        },
      });
      const mesh = new THREE.Mesh(geometry, material);
      this.scene.add(mesh);
      mesh.scale.setScalar(2);
      mesh.position.set(0, 6.5, 0);

      const normalMaterial = new kokomi.CustomShaderMaterial({
        baseMaterial: new THREE.MeshNormalMaterial(),
        vertexShader,
        uniforms: {
          ...uj.shadertoyUniforms,
        },
      });

      const caustics = new kokomi.Caustics(this, {
        normalMaterial,
      });
      caustics.addExisting();
      caustics.add(mesh);

      this.update(() => {
        uj.injectShadertoyUniforms(material.uniforms);
        uj.injectShadertoyUniforms(normalMaterial.uniforms);
      });
    });
  }
}
