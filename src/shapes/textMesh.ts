import * as THREE from "three";

import type { Base } from "../base/base";
import { Component } from "../components/component";

// @ts-ignore
import { preloadFont, Text } from "troika-three-text";

const defaultSDFFontUrl =
  "https://fonts.gstatic.com/s/roboto/v18/KFOmCnqEu92Fr1Mu4mxM.woff";

const preloadSDFFont = (url = defaultSDFFontUrl) => {
  return new Promise((resolve) => {
    preloadFont(
      {
        font: url,
      },
      () => {
        resolve(true);
      }
    );
  });
};

/**
 * A mesh using SDF to render text.
 *
 * Credit: https://protectwise.github.io/troika/troika-three-text/
 *
 * Demo: https://kokomi-js.vercel.app/examples/#textMesh
 */
class TextMesh extends Component {
  mesh: Text;
  constructor(base: Base, text = "") {
    super(base);

    this.mesh = new Text();
    this.mesh.text = text;
    this.mesh.anchorX = "center";
    this.mesh.anchorY = "middle";
  }
  addExisting(): void {
    this.container.add(this.mesh);
  }
}

export { preloadSDFFont, TextMesh };
