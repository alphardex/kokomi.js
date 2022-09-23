import * as THREE from "three";
import type { Base } from "../base/base";
import { Component } from "../components/component";
import { type Emitter } from "mitt";
import { Html } from "../web";
export interface BasicPanoramaConfig {
    id: string;
    radius: number;
}
declare class BasicPanorama extends Component {
    id: string;
    material: THREE.MeshBasicMaterial;
    mesh: THREE.Mesh;
    emitter: Emitter<any>;
    infospots: Html[];
    isInfospotVisible: boolean;
    active: boolean;
    constructor(base: Base, config?: Partial<BasicPanoramaConfig>);
    addExisting(): void;
    outputPosition(): void;
    show(): void;
    hide(): void;
    fadeIn(duration?: number): Promise<unknown>;
    fadeOut(duration?: number): Promise<unknown>;
    add(infospot: Html): void;
    addGroup(infospots: Html[]): void;
    update(time: number): void;
    toggleInfospotVisibility(isVisible?: boolean | undefined): void;
    onEnter(duration?: number): void;
    onLeave(duration?: number): void;
}
export { BasicPanorama };
