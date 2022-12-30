import * as THREE from "three";
import type { Base } from "../base/base";
import { CustomMesh, CustomMeshConfig } from "./customMesh";
/**
 * A render plane for RenderTexture.
 */
declare class RenderQuad extends CustomMesh {
    constructor(base: Base, map: THREE.Texture, config?: Partial<CustomMeshConfig>);
}
export { RenderQuad };
