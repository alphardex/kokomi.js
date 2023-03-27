import { Curve, Vector3 } from "three";
/**
 * NURBS curve object
 *
 * Derives from Curve, overriding getPoint and getTangent.
 *
 * Implementation is based on (x, y [, z=0 [, w=1]]) control points with w=weight.
 *
 **/
declare class NURBSCurve extends Curve {
    constructor(degree: any, knots: any, controlPoints: any, startKnot: any, endKnot: any);
    getPoint(t: any, optionalTarget?: Vector3): Vector3;
    getTangent(t: any, optionalTarget?: Vector3): Vector3;
}
export { NURBSCurve };
