import * as STDLIB from "three-stdlib";

// @ts-ignore
import * as troika_three_text from "troika-three-text";

const defaultFontUrl =
  "https://unpkg.com/three@0.77.0/examples/fonts/helvetiker_regular.typeface.json";

const loadFont = (url = defaultFontUrl): Promise<STDLIB.Font> => {
  return new Promise((resolve) => {
    new STDLIB.FontLoader().load(url, (font) => {
      resolve(font);
    });
  });
};

const defaultSDFFontUrl =
  "https://fonts.gstatic.com/s/roboto/v18/KFOmCnqEu92Fr1Mu4mxM.woff";

const preloadSDFFont = (url = defaultSDFFontUrl) => {
  return new Promise((resolve) => {
    troika_three_text.preloadFont(
      {
        font: url,
      },
      () => {
        resolve(true);
      }
    );
  });
};

export { loadFont, preloadSDFFont };
