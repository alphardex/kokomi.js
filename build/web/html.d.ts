import * as THREE from "three";
import type { Base } from "../base/base";
import { Component } from "../components/component";
export interface HtmlConfig {
    visibleClassName: string;
    xPropertyName: string;
    yPropertyName: string;
    zIndexPropertyName: string;
    scalePropertyName: string;
    viewportWidthName: string;
    viewportHeightName: string;
    perspectiveName: string;
    transformOuterName: string;
    transformInnerName: string;
    occlude: THREE.Object3D[];
    transform: boolean;
    distanceFactor: number;
    group: THREE.Object3D | null;
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
    scalePropertyName: string;
    viewportWidthName: string;
    viewportHeightName: string;
    perspectiveName: string;
    transformOuterName: string;
    transformInnerName: string;
    raycaster: THREE.Raycaster;
    occlude: THREE.Object3D[];
    transform: boolean;
    distanceFactor: number;
    parentGroup: THREE.Object3D | null;
    group: THREE.Object3D;
    visibleToggle: boolean;
    constructor(base: Base, el: HTMLElement, position?: THREE.Vector3, config?: Partial<HtmlConfig>);
    get domPosition(): THREE.Vector2;
    get zIndex(): number | undefined;
    get scale(): number;
    get isBehindCamera(): boolean;
    get isVisible(): boolean;
    get visible(): boolean;
    get viewportSize(): {
        width: number;
        height: number;
    };
    get fov(): number;
    get perspective(): number | "";
    get transformOuter(): string;
    get transformInner(): string;
    addExisting(): void;
    show(): void;
    hide(): void;
    translate({ x, y }: {
        x?: number | undefined;
        y?: number | undefined;
    }): void;
    setZIndex(zIndex?: number): void;
    setScale(scale?: number): void;
    syncPosition(): void;
    makeVisible(): void;
    makeInvisible(): void;
    update(time: number): void;
    setTransformProperty(): void;
}
export { Html };
