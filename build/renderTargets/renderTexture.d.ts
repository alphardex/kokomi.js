import * as THREE from "three";
import type { Base } from "../base/base";
import { Component } from "../components/component";
import { FBO } from "./fbo";
export interface RenderTextureConfig {
    width: number;
    height: number;
    samples: number;
    rtScene: THREE.Scene;
    rtCamera: THREE.Camera;
}
/**
 * You can render a scene into this texture.
 *
 * Demo: https://kokomi-js.vercel.app/examples/#renderTexture
 */
declare class RenderTexture extends Component {
    fbo: FBO;
    texture: THREE.Texture;
    rtScene: THREE.Scene;
    rtCamera: THREE.Camera;
    constructor(base: Base, config?: Partial<RenderTextureConfig>);
    update(): void;
    add(obj: any): void;
}
export { RenderTexture };
