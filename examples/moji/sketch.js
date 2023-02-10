import * as kokomi from "kokomi.js";
import * as THREE from "three";
import gsap from "gsap";
import * as dat from "lil";

class Sketch extends kokomi.Base {
  async create() {
    const screenCamera = new kokomi.ScreenCamera(this);
    screenCamera.addExisting();

    new kokomi.OrbitControls(this);

    await kokomi.preloadSDFFont();

    const mg = new kokomi.MojiGroup(this);
    mg.addExisting();

    document.querySelector(".loader-screen").classList.add("hollow");
  }
}
