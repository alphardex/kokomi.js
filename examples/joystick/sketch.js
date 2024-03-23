import * as kokomi from "kokomi.js";
import * as THREE from "three";
import gsap from "gsap";
import * as dat from "lil";

class Sketch extends kokomi.Base {
  create() {
    this.camera.position.set(1, 1, 1);

    new kokomi.OrbitControls(this);

    const box = new kokomi.Box(this);
    box.addExisting();

    this.update((time) => {
      box.spin(time);
    });

    const js = new kokomi.Joystick(this, {
      zone: document.querySelector(".joystick-zone"),
    });
    js.listenForGesture();
    js.on("move-start", () => {
      console.log("move start");
    });
    js.on("move", (e) => {
      console.log(`move: (${e.vector.x}, ${e.vector.y})`);
    });
    js.on("move-end", () => {
      console.log("move end");
    });
  }
}
