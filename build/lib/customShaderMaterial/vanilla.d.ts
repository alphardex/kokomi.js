import { IUniform, Material } from "three";
import { iCSMUpdateParams, iCSMParams } from "./types";
export * from "./types";
export default class CustomShaderMaterial extends Material {
    uniforms: {
        [key: string]: IUniform<any>;
    };
    private _customPatchMap;
    private _fs;
    private _vs;
    private _cacheKey;
    private _base;
    private _instanceID;
    private _type;
    constructor({ baseMaterial, fragmentShader, vertexShader, uniforms, patchMap, cacheKey, ...opts }: iCSMParams);
    update(opts?: Partial<iCSMUpdateParams>): void;
    clone(): this;
    private generateMaterial;
    private getMaterialDefine;
    private getPatchMapForMaterial;
    private patchShader;
    private parseShader;
    private getShaderFromIndex;
}
