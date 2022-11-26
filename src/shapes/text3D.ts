import * as THREE from "three";
import * as STDLIB from "three-stdlib";

import type { Base } from "../base/base";
import { Component } from "../components/component";

import { CustomMesh, CustomMeshConfig } from "./customMesh";

const defaultFontUrl =
  "https://unpkg.com/three@0.77.0/examples/fonts/helvetiker_regular.typeface.json";

const loadFont = (url = defaultFontUrl): Promise<STDLIB.Font> => {
  return new Promise((resolve) => {
    new STDLIB.FontLoader().load(url, (font) => {
      resolve(font);
    });
  });
};

/**
 * A mesh using `TextGeometry` to render 3D text.
 *
 * Demo: https://kokomi-js.vercel.app/examples/#text3D
 */
class Text3D extends CustomMesh {
  constructor(
    base: Base,
    text: string,
    font: STDLIB.Font,
    textParams: STDLIB.TextGeometryParameters = {
      size: 0.5,
      height: 0.2,
      curveSegments: 12,
      bevelEnabled: true,
      bevelThickness: 0.03,
      bevelSize: 0.02,
      bevelOffset: 0,
      // @ts-ignore
      bevelSegments: 5,
    },
    config: Partial<CustomMeshConfig> = {}
  ) {
    super(base, {
      geometry: new STDLIB.TextGeometry(text, { ...textParams, font }),
      ...config,
    });
  }
}

export { loadFont, Text3D };
