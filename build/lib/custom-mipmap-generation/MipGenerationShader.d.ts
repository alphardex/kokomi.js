import { ShaderMaterialParameters, Vector2 } from "three";
export declare function clone(shader: ShaderMaterialParameters): {
    uniforms?: {
        [uniform: string]: import("three").IUniform<any>;
    } | undefined;
    vertexShader?: string | undefined;
    fragmentShader?: string | undefined;
    linewidth?: number | undefined;
    wireframe?: boolean | undefined;
    wireframeLinewidth?: number | undefined;
    lights?: boolean | undefined;
    clipping?: boolean | undefined;
    fog?: boolean | undefined;
    extensions?: {
        derivatives?: boolean | undefined;
        fragDepth?: boolean | undefined;
        drawBuffers?: boolean | undefined;
        shaderTextureLOD?: boolean | undefined;
    } | undefined;
    glslVersion?: import("three").GLSLVersion | undefined;
    alphaTest?: number | undefined;
    alphaToCoverage?: boolean | undefined;
    blendDst?: import("three").BlendingDstFactor | undefined;
    blendDstAlpha?: number | undefined;
    blendEquation?: import("three").BlendingEquation | undefined;
    blendEquationAlpha?: number | undefined;
    blending?: import("three").Blending | undefined;
    blendSrc?: import("three").BlendingDstFactor | import("three").BlendingSrcFactor | undefined;
    blendSrcAlpha?: number | undefined;
    clipIntersection?: boolean | undefined;
    clippingPlanes?: import("three").Plane[] | undefined;
    clipShadows?: boolean | undefined;
    colorWrite?: boolean | undefined;
    defines?: any;
    depthFunc?: import("three").DepthModes | undefined;
    depthTest?: boolean | undefined;
    depthWrite?: boolean | undefined;
    name?: string | undefined;
    opacity?: number | undefined;
    polygonOffset?: boolean | undefined;
    polygonOffsetFactor?: number | undefined;
    polygonOffsetUnits?: number | undefined;
    precision?: "highp" | "mediump" | "lowp" | null | undefined;
    premultipliedAlpha?: boolean | undefined;
    forceSinglePass?: boolean | undefined;
    dithering?: boolean | undefined;
    side?: import("three").Side | undefined;
    shadowSide?: import("three").Side | undefined;
    toneMapped?: boolean | undefined;
    transparent?: boolean | undefined;
    vertexColors?: boolean | undefined;
    visible?: boolean | undefined;
    format?: import("three").PixelFormat | undefined;
    stencilWrite?: boolean | undefined;
    stencilFunc?: import("three").StencilFunc | undefined;
    stencilRef?: number | undefined;
    stencilWriteMask?: number | undefined;
    stencilFuncMask?: number | undefined;
    stencilFail?: import("three").StencilOp | undefined;
    stencilZFail?: import("three").StencilOp | undefined;
    stencilZPass?: import("three").StencilOp | undefined;
    userData?: any;
};
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
