// ref: https://github.com/mrdoob/three.js/blob/master/examples/webgl_geometry_shapes.html
import * as THREE from "three";

const roundedRect = (
  ctx: THREE.Shape,
  x = 0,
  y = 0,
  width = 1,
  height = 1,
  radius = 0.05
) => {
  ctx.moveTo(x, y + radius);
  ctx.lineTo(x, y + height - radius);
  ctx.quadraticCurveTo(x, y + height, x + radius, y + height);
  ctx.lineTo(x + width - radius, y + height);
  ctx.quadraticCurveTo(x + width, y + height, x + width, y + height - radius);
  ctx.lineTo(x + width, y + radius);
  ctx.quadraticCurveTo(x + width, y, x + width - radius, y);
  ctx.lineTo(x + radius, y);
  ctx.quadraticCurveTo(x, y, x, y + radius);
  return ctx;
};

export { roundedRect };
