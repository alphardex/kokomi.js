import * as kokomi from "kokomi.js";
import * as THREE from "three";
import gsap from "gsap";
import * as dat from "lil";

class Sketch extends kokomi.Base {
  create() {
    document.querySelector("#sketch").remove();

    document.querySelector("[type=frag]").textContent = fragmentShader;
    kokomi.ShaderToyElement.register();
  }
}
