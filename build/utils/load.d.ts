import * as STDLIB from "three-stdlib";
declare const loadFont: (url?: string) => Promise<STDLIB.Font>;
declare const preloadSDFFont: (url?: string) => Promise<unknown>;
export { loadFont, preloadSDFFont };
