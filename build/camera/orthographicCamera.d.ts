import * as THREE from "three";
export interface OrthographicCameraConfig {
    frustum: number;
    near: number;
    far: number;
}
/**
 * A more friendly `THREE.OrthographicCamera`.
 */
declare class OrthographicCamera extends THREE.OrthographicCamera {
    frustum: number;
    constructor(config?: Partial<OrthographicCameraConfig>);
}
export { OrthographicCamera };
