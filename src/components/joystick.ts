import * as THREE from "three";

import { Component } from "./component";
import { Base } from "../base/base";

import nipplejs from "nipplejs";

import { preventDefaultAndStopBubble } from "../utils";

export interface JoystickConfig extends nipplejs.JoystickManagerOptions {}

/**
 * An encapsuled class by [nipplejs](https://github.com/yoannmoinet/nipplejs).
 */
class Joystick extends Component {
  manager: nipplejs.JoystickManager;
  data: Partial<nipplejs.JoystickOutputData>;
  constructor(base: Base, config: Partial<JoystickConfig> = {}) {
    super(base);

    if (config.zone) {
      config.zone.onmousedown = preventDefaultAndStopBubble;
      config.zone.onpointerdown = preventDefaultAndStopBubble;
      config.zone.ontouchstart = preventDefaultAndStopBubble;
    }

    const manager = nipplejs.create({
      mode: "static",
      position: {
        left: "75px",
        bottom: "75px",
      },
      ...config,
    });
    this.manager = manager;

    this.data = {};
  }
  listenForGesture() {
    this.manager.on("start", () => {
      this.emit("move-start", this.data);
    });
    this.manager.on("move", (_, data) => {
      this.emit("move", data);
      this.data = data;
    });
    this.manager.on("end", () => {
      this.emit("move-end", this.data);
    });
  }
}

export { Joystick };
