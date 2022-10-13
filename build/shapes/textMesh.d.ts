import type { Base } from "../base/base";
import { Component } from "../components/component";
import * as troika_three_text from "troika-three-text";
/**
 * A mesh using SDF to render text.
 *
 * Credit: https://protectwise.github.io/troika/troika-three-text/
 *
 * Demo: https://kokomi-js.vercel.app/examples/#textMesh
 */
declare class TextMesh extends Component {
    mesh: troika_three_text.Text;
    constructor(base: Base, text?: string);
    addExisting(): void;
}
export { TextMesh };
