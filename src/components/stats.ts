import { Component } from "./component";

import type { Base } from "../base/base";

import StatsImpl from "stats.js";

/**
 * A drop-in fps meter powered by [stats.js](https://github.com/mrdoob/stats.js)
 */
class Stats extends Component {
  stats: StatsImpl;
  constructor(base: Base) {
    super(base);

    const stats = new StatsImpl();
    this.stats = stats;

    this.base.container.appendChild(this.stats.dom);
  }
  update(time: number): void {
    this.stats.update();
  }
}

export { Stats };
