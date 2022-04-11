import * as THREE from "three";

export interface SDFConfig {
  pointVarName: string;
  sdfVarName: string;
  materialId: string;
}

class PrimitiveSDF {
  pointVarName: string;
  sdfVarName: string;
  materialId: string;
  isVisible: boolean;
  operations: string[];
  translates: string[];
  rotates: string[];
  scaleValue: string;
  constructor(config: Partial<SDFConfig> = {}) {
    const {
      pointVarName = "q",
      sdfVarName = "dt",
      materialId = "26.9",
    } = config;
    this.pointVarName = pointVarName;
    this.sdfVarName = sdfVarName;
    this.materialId = materialId;
    this.isVisible = true;
    this.operations = [];
    this.translates = [];
    this.rotates = [];
    this.scaleValue = "1.00";
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
      this.rotates,
      this.shader,
      this.operationsShader,
      this.isVisible ? this.addExisting : "",
    ]
      .filter((item) => item)
      .join("\n");
  }
  show() {
    this.isVisible = true;
  }
  hide() {
    this.isVisible = false;
  }
  translate(x = 0, y = 0, z = 0) {
    this.translates.push(
      `${this.pointVarName}+=vec3(${Number(x).toFixed(2)},${Number(y).toFixed(
        2
      )},${Number(z).toFixed(2)});`
    );
  }
  rotate(deg = 0, axis = "x") {
    this.rotates.push(
      `${this.pointVarName}=rotate${axis.toUpperCase()}(${Number(
        THREE.MathUtils.degToRad(deg)
      ).toFixed(2)});`
    );
  }
  scale(value = 1) {
    this.scaleValue = Number(value).toFixed(2);
  }
  round(value = 0.1) {
    this.operations.push(
      `${this.sdfVarName}=opRound(${this.sdfVarName},${value});`
    );
  }
  union(sdf: PrimitiveSDF) {
    this.operations.push(
      `${this.sdfVarName}=opUnion(${this.sdfVarName},${sdf.sdfVarName});`
    );
  }
  intersect(sdf: PrimitiveSDF) {
    this.operations.push(
      `${this.sdfVarName}=opIntersection(${this.sdfVarName},${sdf.sdfVarName});`
    );
  }
  subtract(sdf: PrimitiveSDF) {
    this.operations.push(
      `${this.sdfVarName}=opSubtraction(${this.sdfVarName},${sdf.sdfVarName});`
    );
  }
  smoothUnion(sdf: PrimitiveSDF, value = 0.1) {
    this.operations.push(
      `${this.sdfVarName}=opSmoothUnion(${this.sdfVarName},${sdf.sdfVarName},${value});`
    );
  }
  smoothIntersect(sdf: PrimitiveSDF, value = 0.1) {
    this.operations.push(
      `${this.sdfVarName}=opSmoothIntersection(${this.sdfVarName},${sdf.sdfVarName},${value});`
    );
  }
  smoothSubtract(sdf: PrimitiveSDF, value = 0.1) {
    this.operations.push(
      `${this.sdfVarName}=opSmoothSubtraction(${this.sdfVarName},${sdf.sdfVarName},${value});`
    );
  }
}

export { PrimitiveSDF };
