import type { Base } from "../base/base";
import { Component } from "../components/component";
import * as troika_three_text from "troika-three-text";
declare class TextMesh extends Component {
    mesh: troika_three_text.Text;
    constructor(base: Base, text?: string);
    addExisting(): void;
}
export { TextMesh };
