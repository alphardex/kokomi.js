import type { Base } from "../base/base";
import { Component } from "../components/component";
import { Text } from "troika-three-text";
declare const preloadSDFFont: (url?: string) => Promise<unknown>;
/**
 * A mesh using SDF to render text.
 *
 * Credit: https://protectwise.github.io/troika/troika-three-text/
 *
 * Demo: https://kokomi-js.vercel.app/examples/#textMesh
 */
declare class TextMesh extends Component {
    mesh: Text;
    constructor(base: Base, text?: string);
    addExisting(): void;
}
export { preloadSDFFont, TextMesh };
