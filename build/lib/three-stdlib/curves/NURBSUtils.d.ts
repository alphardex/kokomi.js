import { Vector3, Vector4 } from "three";
/**
 * NURBS utils
 *
 * See NURBSCurve and NURBSSurface.
 **/
/**************************************************************
 *	NURBS Utils
 **************************************************************/
declare function findSpan(p: any, u: any, U: any): any;
declare function calcBasisFunctions(span: any, u: any, p: any, U: any): number[];
declare function calcBSplinePoint(p: any, U: any, P: any, u: any): Vector4;
declare function calcBasisFunctionDerivatives(span: any, u: any, p: any, n: any, U: any): number[][];
declare function calcBSplineDerivatives(p: any, U: any, P: any, u: any, nd: any): any[];
declare function calcKoverI(k: any, i: any): number;
declare function calcRationalCurveDerivatives(Pders: any): Vector3[];
declare function calcNURBSDerivatives(p: any, U: any, P: any, u: any, nd: any): Vector3[];
declare function calcSurfacePoint(p: any, q: any, U: any, V: any, P: any, u: any, v: any, target: any): void;
export { findSpan, calcBasisFunctions, calcBSplinePoint, calcBasisFunctionDerivatives, calcBSplineDerivatives, calcKoverI, calcRationalCurveDerivatives, calcNURBSDerivatives, calcSurfacePoint, };
