import * as THREE from "three";
import type { Base } from "../base/base";
import { Component } from "../components/component";
export interface HtmlConfig {
    visibleClassName: string;
    xPropertyName: string;
    yPropertyName: string;
    zIndexPropertyName: string;
    occlude: THREE.Object3D[];
}
/**
 * It can help you merge HTML elements into the WebGL world by converting 3D positions to 2D positions.
 * If element is visible, it will have a `visible` CSS class (can be customized), and for 2D position it will have 3 CSS variables `--x`, `--y` and `--z-index` (can be customized too)
 *
 * Demo: https://codesandbox.io/s/kokomi-js-html-w0qfmr?file=/src/components/sphereWordCloud.ts
 */
declare class Html extends Component {
    el: HTMLElement;
    position: THREE.Vector3;
    visibleClassName: string;
    xPropertyName: string;
    yPropertyName: string;
    zIndexPropertyName: string;
    raycaster: THREE.Raycaster;
    occlude: THREE.Object3D[];
    visibleToggle: boolean;
    constructor(base: Base, el: HTMLElement, position?: THREE.Vector3, config?: Partial<HtmlConfig>);
    get domPosition(): THREE.Vector2;
    get zIndex(): number | undefined;
    get isBehindCamera(): boolean;
    get isVisible(): boolean;
    get visible(): boolean;
    show(): void;
    hide(): void;
    translate({ x, y }: {
        x?: number | undefined;
        y?: number | undefined;
    }): void;
    setZIndex(zIndex?: number): void;
    syncPosition(): void;
    makeVisible(): void;
    makeInvisible(): void;
    update(time: number): void;
}
export { Html };
