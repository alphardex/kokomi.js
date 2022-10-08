import * as THREE from "three";

import type { Base } from "../base/base";
import { Component } from "../components/component";

// @ts-ignore
import * as troika_three_text from "troika-three-text";

/**
 * A mesh using SDF to render text.
 *
 * Credit: https://protectwise.github.io/troika/troika-three-text/
 *
 * Demo: https://kokomi-js.vercel.app/examples/#textMesh
 */
class TextMesh extends Component {
  mesh: troika_three_text.Text;
  constructor(base: Base, text = "") {
    super(base);

    this.mesh = new troika_three_text.Text();
    this.mesh.text = text;
    this.mesh.anchorX = "center";
    this.mesh.anchorY = "middle";
  }
  addExisting(): void {
    this.base.scene.add(this.mesh);
  }
}

export { TextMesh };
