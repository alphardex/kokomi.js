import * as THREE from "three";

class GlassMaterial extends THREE.MeshPhysicalMaterial {
  constructor(parameters?: THREE.MeshPhysicalMaterialParameters) {
    super({
      roughness: 0.6,
      transmission: 1,
      // @ts-ignore
      thickness: 1.2, // refraction
      clearcoat: 1,
      clearcoatRoughness: 0.1,
      clearcoatNormalScale: new THREE.Vector2(0.3, 0.3),
      ...parameters,
    });
  }
}

export { GlassMaterial };
