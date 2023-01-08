import * as THREE from "three";
import { Base } from "../base/base";
declare class Sketch extends Base {
    constructor(sel?: string);
    create(fragmentShader: string, uniforms?: {}): void;
}
/**
 * You can use `<shader-toy></shader-toy>` tag to setup a shadertoy environment in html.
 *
 * Demos: https://github.com/alphardex/shadertoy-playground
 */
declare class ShaderToyElement extends HTMLElement {
    container: HTMLElement | null;
    sketch: Sketch | null;
    constructor();
    static register(): void;
    connectedCallback(): void;
    get elId(): string;
    get containerId(): string;
    get fragShader(): string;
    getTextureUniform(name: string): {
        [x: string]: {
            value: THREE.Texture | THREE.CubeTexture;
        };
    };
    get uniforms(): {
        [x: string]: {
            value: THREE.Texture | THREE.CubeTexture;
        };
    };
    createContainer(): void;
    create(): void;
}
export { ShaderToyElement };
