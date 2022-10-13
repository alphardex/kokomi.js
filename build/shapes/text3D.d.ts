import * as STDLIB from "three-stdlib";
import type { Base } from "../base/base";
import { CustomMesh, CustomMeshConfig } from "./customMesh";
/**
 * A mesh using `TextGeometry` to render 3D text.
 *
 * Demo: https://kokomi-js.vercel.app/examples/#text3D
 */
declare class Text3D extends CustomMesh {
    constructor(base: Base, text: string, font: STDLIB.Font, textParams?: STDLIB.TextGeometryParameters, config?: Partial<CustomMeshConfig>);
}
export { Text3D };
