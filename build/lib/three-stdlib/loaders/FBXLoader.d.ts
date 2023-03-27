import { Loader } from "three";
/**
 * Improved version of STDLIB.FBXLoader.
 * 1. fix undefined value error.
 */
declare class FBXLoader extends Loader {
    constructor(manager: any);
    load(url: any, onLoad: any, onProgress: any, onError: any): void;
    parse(FBXBuffer: any, path: any): any;
}
export { FBXLoader };
