import { ShaderMaterial, WebGLRenderTarget, Texture, WebGLRenderer } from "three";
import { FullScreenQuad } from "three-stdlib";
export declare class PackedMipMapGenerator {
    _swapTarget: WebGLRenderTarget;
    _copyQuad: FullScreenQuad;
    _mipQuad: FullScreenQuad;
    _mipMaterials: ShaderMaterial[];
    constructor(mipmapLogic?: string);
    update(texture: Texture, target: WebGLRenderTarget, renderer: WebGLRenderer, forcePowerOfTwo?: boolean): number;
    dispose(): void;
}
