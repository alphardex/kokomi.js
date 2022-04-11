import { PrimitiveSDF } from "./primitive";

export interface BoxSDFConfig {
  width: number;
  height: number;
  depth: number;
  pointVarName: string;
  sdfVarName: string;
  materialId: string;
}

class BoxSDF extends PrimitiveSDF {
  width: number;
  height: number;
  depth: number;
  constructor(config: Partial<BoxSDFConfig> = {}) {
    super(config);
    const { width = 0.5, height = 0.5, depth = 0.5 } = config;
    this.width = width;
    this.height = height;
    this.depth = depth;
  }
  get shader() {
    return `float ${this.sdfVarName}=sdBox(${this.pointVarName}/${this.scaleValue},vec3(${this.width},${this.height},${this.depth}))*${this.scaleValue};`;
  }
}

export { BoxSDF };
