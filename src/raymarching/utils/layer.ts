import type { PrimitiveSDF } from "../primitives/primitive";

class SDFLayer {
  primitives: PrimitiveSDF[];
  constructor() {
    this.primitives = [];
  }
  addPrimitive(primitive: PrimitiveSDF) {
    this.primitives.push(primitive);
  }
  get shader() {
    return `
      {
        vec3 q=pos;
        ${this.primitives.map((item) => item.totalShader).join("\n")}
      }
      `;
  }
}

export { SDFLayer };
