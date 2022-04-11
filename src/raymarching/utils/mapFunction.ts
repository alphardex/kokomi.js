import { SDFLayer } from "./layer";

class SDFMapFunction {
  layers: SDFLayer[];
  constructor() {
    this.layers = [];
  }
  addLayer(layer: SDFLayer) {
    this.layers.push(layer);
  }
  get shader() {
    return `
      vec2 map(in vec3 pos)
      {
          vec2 res=vec2(1e10,0.);
          
          ${this.layers.map((item) => item.shader).join("\n")}
          
          return res;
      }
      `;
  }
}

export { SDFMapFunction };
