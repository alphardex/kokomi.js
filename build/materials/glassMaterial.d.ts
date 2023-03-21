import * as THREE from "three";
/**
 * A material that produces a glass-like effect.
 *
 * Demo: https://kokomi-js.vercel.app/examples/#glassMaterial
 */
declare class GlassMaterial extends THREE.MeshPhysicalMaterial {
    constructor(parameters?: THREE.MeshPhysicalMaterialParameters);
}
export { GlassMaterial };
