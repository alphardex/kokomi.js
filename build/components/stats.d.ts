import { Component } from "./component";
import type { Base } from "../base/base";
import StatsImpl from "stats.js";
/**
 * A drop-in fps meter powered by [stats.js](https://github.com/mrdoob/stats.js)
 */
declare class Stats extends Component {
    stats: StatsImpl;
    constructor(base: Base);
    update(time: number): void;
}
export { Stats };
