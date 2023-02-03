import { Vector2 } from "three";
export declare function clone(shader: any): any;
export declare const MipGenerationShader: {
    defines: {
        X_IS_EVEN: number;
        Y_IS_EVEN: number;
    };
    uniforms: {
        map: {
            value: null;
        };
        originalMapSize: {
            value: Vector2;
        };
        parentMapSize: {
            value: Vector2;
        };
        parentLevel: {
            value: number;
        };
    };
    vertexShader: string;
    fragmentShader: string;
};
