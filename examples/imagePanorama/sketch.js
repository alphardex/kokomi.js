import * as kokomi from "kokomi.js";
import * as THREE from "three";
import gsap from "gsap";
import * as dat from "lil";

class Sketch extends kokomi.Base {
  create() {
    const viewer = new kokomi.Viewer(this);

    const am = new kokomi.AssetManager(this, [
      {
        name: "panoramaImage",
        type: "texture",
        path: "https://s2.loli.net/2023/02/10/yuOEkBgKmTvQi3b.jpg",
      },
    ]);
    am.on("ready", () => {
      document.querySelector(".loader-screen").classList.add("hollow");

      const panoramaImage = am.items["panoramaImage"];
      panoramaImage.colorSpace = THREE.SRGBColorSpace;
      const panorama = new kokomi.ImagePanorama(this, panoramaImage);
      viewer.add(panorama);
    });
  }
}
