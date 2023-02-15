import * as THREE from "three";

interface OrthographicCameraConfig {
  frustum: number;
  near: number;
  far: number;
}

/**
 * A more friendly `THREE.OrthographicCamera`.
 */
class OrthographicCamera extends THREE.OrthographicCamera {
  frustum: number;
  constructor(config: Partial<OrthographicCameraConfig> = {}) {
    const aspect = window.innerWidth / window.innerHeight;

    const { frustum = 5.7, near = 0.1, far = 2000 } = config;

    super(
      aspect * frustum * -0.5,
      aspect * frustum * 0.5,
      frustum * 0.5,
      frustum * -0.5,
      near,
      far
    );

    this.frustum = frustum;
  }
}

export { OrthographicCamera };
