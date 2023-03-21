import { Font, TextGeometryParameters } from "three-stdlib";
import type { Base } from "../base/base";
import { CustomMesh, CustomMeshConfig } from "./customMesh";
declare const loadFont: (url?: string) => Promise<Font>;
/**
 * A mesh using `TextGeometry` to render 3D text.
 *
 * Demo: https://kokomi-js.vercel.app/examples/#text3D
 */
declare class Text3D extends CustomMesh {
    constructor(base: Base, text: string, font: Font, textParams?: TextGeometryParameters, config?: Partial<CustomMeshConfig>);
}
export { loadFont, Text3D };
