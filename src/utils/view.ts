import * as THREE from "three";

import type { Base } from "../base/base";

type CanvasSize = {
  top: number;
  left: number;
  height: number;
  width: number;
};

const computeContainerPosition = (
  canvasSize: CanvasSize,
  trackRect: DOMRect
): {
  position: CanvasSize & { bottom: number; right: number };
  isOffscreen: boolean;
} => {
  const {
    right,
    top,
    left: trackLeft,
    bottom: trackBottom,
    width,
    height,
  } = trackRect;
  const isOffscreen =
    trackRect.bottom < 0 ||
    top > canvasSize.height ||
    right < 0 ||
    trackRect.left > canvasSize.width;

  const canvasBottom = canvasSize.top + canvasSize.height;
  const bottom = canvasBottom - trackBottom;
  const left = trackLeft - canvasSize.left;

  return {
    position: { width, height, left, top, bottom, right },
    isOffscreen,
  };
};

const applyViewScissor = (base: Base, viewEl: HTMLElement) => {
  const canvasSize = base.renderer.domElement.getBoundingClientRect();
  const rect = viewEl.getBoundingClientRect();
  if (rect) {
    const {
      position: { left, bottom, width, height },
    } = computeContainerPosition(canvasSize, rect);

    const aspect = width / height;
    (base.camera as THREE.PerspectiveCamera).aspect = aspect;
    (base.camera as THREE.PerspectiveCamera).updateProjectionMatrix();

    base.renderer.setViewport(left, bottom, width, height);
    base.renderer.setScissor(left, bottom, width, height);
    base.renderer.setScissorTest(true);
  }
};

export { applyViewScissor };
