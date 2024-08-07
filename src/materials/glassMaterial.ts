import * as THREE from "three";

/**
 * A material that produces a glass-like effect.
 *
 * Demo: https://kokomi-js.vercel.app/examples/#glassMaterial
 */
class GlassMaterial extends THREE.MeshPhysicalMaterial {
  constructor(parameters?: THREE.MeshPhysicalMaterialParameters) {
    super({
      roughness: 0.6,
      transmission: 1,
      thickness: 1.2, // refraction
      clearcoat: 1,
      clearcoatRoughness: 0.1,
      clearcoatNormalScale: new THREE.Vector2(0.3, 0.3),
      ...parameters,
    });
  }
}

export { GlassMaterial };
