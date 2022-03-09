import { Component } from "./component";

import type { Base } from "../base/base";

import StatsImpl from "stats.js";

class Stats extends Component {
  stats: StatsImpl;
  constructor(base: Base) {
    super(base);

    const stats = new StatsImpl();
    this.stats = stats;

    this.base.container.appendChild(this.stats.dom);
  }
  animate(time: number): void {
    this.stats.update();
  }
}

export { Stats };
