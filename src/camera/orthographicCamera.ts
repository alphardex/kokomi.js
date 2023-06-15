import * as THREE from "three";

export interface OrthographicCameraConfig {
  frustum: number;
  near: number;
  far: number;
  useAspect: boolean;
}

/**
 * A more friendly `THREE.OrthographicCamera`.
 */
class OrthographicCamera extends THREE.OrthographicCamera {
  frustum: number;
  useAspect: boolean;
  constructor(config: Partial<OrthographicCameraConfig> = {}) {
    const aspect = window.innerWidth / window.innerHeight;

    const { frustum = 5.7, near = 0.1, far = 2000, useAspect = true } = config;

    const actualAspect = useAspect ? aspect : 1;

    super(
      actualAspect * frustum * -0.5,
      actualAspect * frustum * 0.5,
      frustum * 0.5,
      frustum * -0.5,
      near,
      far
    );

    this.frustum = frustum;
    this.useAspect = useAspect;
  }
}

export { OrthographicCamera };
