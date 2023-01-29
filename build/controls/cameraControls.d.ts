import type { Base } from "../base/base";
import { Component } from "../components/component";
import CameraControlsImpl from "camera-controls";
/**
 * A wrapper for https://github.com/yomotsu/camera-controls
 */
declare class CameraControls extends Component {
    controls: CameraControlsImpl;
    constructor(base: Base);
    update(time: number): void;
}
export { CameraControls };
