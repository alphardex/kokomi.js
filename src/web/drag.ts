import type { Base } from "../base/base";
import { Component } from "../components/component";

import { detectDeviceType } from "../utils";

export interface DragDetecterConfig {
  isCursorChanged: boolean;
}

/**
 * A detecter to detect `drag` event.
 */
class DragDetecter extends Component {
  isDragging: boolean;
  isCursorChanged: boolean;
  enabled: boolean;
  constructor(base: Base, config: Partial<DragDetecterConfig> = {}) {
    super(base);

    const { isCursorChanged = true } = config;
    this.isCursorChanged = isCursorChanged;

    this.isDragging = false;

    this.enabled = true;
  }
  detectDrag() {
    const deviceType = detectDeviceType();

    const downEventName = {
      Mobile: "touchstart",
      Desktop: "mousedown",
    }[deviceType];

    const upEventName = {
      Mobile: "touchend",
      Desktop: "mouseup",
    }[deviceType];

    const moveEventName = {
      Mobile: "touchmove",
      Desktop: "mousemove",
    }[deviceType];

    this.changeCursorGrab();

    window.addEventListener(downEventName, () => {
      if (!this.enabled) {
        this.endDrag();
        return;
      }

      this.isDragging = true;
      this.changeCursorGrabbing();
      this.emit("dragstart");
    });

    window.addEventListener(upEventName, () => {
      if (!this.enabled) {
        this.endDrag();
        return;
      }

      this.isDragging = false;
      this.changeCursorGrab();
      this.emit("dragend");
    });

    window.addEventListener(moveEventName, () => {
      if (!this.enabled) {
        this.endDrag();
        return;
      }

      this.emit("drag", this.base.iMouse.mouseDOMDelta);
    });
  }
  enable() {
    this.enabled = true;
  }
  disable() {
    this.enabled = false;
  }
  changeCursorGrab() {
    const canvasEl = this.base.renderer.domElement;
    if (this.isCursorChanged) {
      canvasEl.style.cursor = "grab";
    }
  }
  changeCursorGrabbing() {
    const canvasEl = this.base.renderer.domElement;
    if (this.isCursorChanged) {
      canvasEl.style.cursor = "grabbing";
    }
  }
  resetCursor() {
    const canvasEl = this.base.renderer.domElement;
    canvasEl.style.cursor = "auto";
  }
  endDrag() {
    this.isDragging = false;
    this.resetCursor();
  }
}

export { DragDetecter };
