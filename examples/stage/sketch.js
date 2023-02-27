import * as kokomi from "kokomi.js";
import * as THREE from "three";
import gsap from "gsap";
import * as dat from "lil";

class Sketch extends kokomi.Base {
  create() {
    new kokomi.OrbitControls(this);

    this.camera.position.set(0, 0, 3);

    kokomi.beautifyRender(this.renderer);

    this.scene.background = new THREE.Color("white");

    const am = new kokomi.AssetManager(this, [
      {
        name: "hdr",
        type: "hdrTexture",
        path: "https://market-assets.fra1.cdn.digitaloceanspaces.com/market-assets/hdris/venice/venice_sunset_1k.hdr",
      },
    ]);
    this.am = am;
    this.am.on("ready", () => {
      document.querySelector(".loader-screen").classList.add("hollow");

      const envMap = kokomi.getEnvmapFromHDRTexture(
        this.renderer,
        am.items["hdr"]
      );

      this.scene.environment = envMap;

      const sphere = new THREE.Mesh(
        new THREE.SphereGeometry(1, 64, 64),
        new THREE.MeshStandardMaterial({
          roughness: 0,
          color: "royalblue",
        })
      );
      this.scene.add(sphere);

      const stage = new kokomi.Stage(this);
      stage.addExisting();
      stage.add(sphere);
    });
  }
}
