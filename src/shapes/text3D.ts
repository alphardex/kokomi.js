import {
  Font,
  FontLoader,
  TextGeometry,
  TextGeometryParameters,
} from "three-stdlib";

import type { Base } from "../base/base";

import { CustomMesh, CustomMeshConfig } from "./customMesh";

const defaultFontUrl =
  "https://unpkg.com/three@0.77.0/examples/fonts/helvetiker_regular.typeface.json";

const loadFont = (url = defaultFontUrl): Promise<Font> => {
  return new Promise((resolve) => {
    new FontLoader().load(url, (font) => {
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
    font: Font,
    textParams: TextGeometryParameters = {
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
      geometry: new TextGeometry(text, { ...textParams, font }),
      ...config,
    });
  }
}

export { loadFont, Text3D };
