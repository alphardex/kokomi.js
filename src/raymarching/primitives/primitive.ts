export interface SDFConfig {
  pointVarName: string;
  sdfVarName: string;
  materialId: string;
}

class PrimitiveSDF {
  pointVarName: string;
  sdfVarName: string;
  materialId: string;
  operations: string[];
  translates: string[];
  isVisible: boolean;
  constructor(config: Partial<SDFConfig> = {}) {
    const {
      pointVarName = "q",
      sdfVarName = "dt",
      materialId = "26.9",
    } = config;
    this.pointVarName = pointVarName;
    this.sdfVarName = sdfVarName;
    this.materialId = materialId;
    this.operations = [];
    this.translates = [];
    this.isVisible = true;
  }
  get shader() {
    return ``;
  }
  get addExisting() {
    return `res=opUnion(res,vec2(${this.sdfVarName},${this.materialId}));`;
  }
  get operationsShader() {
    return this.operations.join("\n");
  }
  get totalShader() {
    return [
      this.translates,
      this.shader,
      this.operationsShader,
      this.isVisible ? this.addExisting : "",
    ]
      .filter((item) => item)
      .join("\n");
  }
  round(value = 0.1) {
    this.operations.push(
      `${this.sdfVarName}=opRound(${this.sdfVarName},${value});`
    );
  }
  translate(x = 0, y = 0, z = 0) {
    this.translates.push(`${this.pointVarName}+=vec3(${x},${y},${z});`);
  }
  union(sdf: PrimitiveSDF) {
    this.operations.push(
      `${this.sdfVarName}=opUnion(${this.sdfVarName},${sdf.sdfVarName});`
    );
  }
  smoothUnion(sdf: PrimitiveSDF, value = 0.1) {
    this.operations.push(
      `${this.sdfVarName}=opSmoothUnion(${this.sdfVarName},${sdf.sdfVarName},${value});`
    );
  }
  show() {
    this.isVisible = true;
  }
  hide() {
    this.isVisible = false;
  }
}

export { PrimitiveSDF };
