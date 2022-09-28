import * as STDLIB from "three-stdlib";

const defaultFontUrl =
  "https://unpkg.com/three@0.77.0/examples/fonts/helvetiker_regular.typeface.json";

const loadFont = (url = defaultFontUrl): Promise<STDLIB.Font> => {
  return new Promise((resolve) => {
    new STDLIB.FontLoader().load(url, (font) => {
      resolve(font);
    });
  });
};

export { loadFont };
