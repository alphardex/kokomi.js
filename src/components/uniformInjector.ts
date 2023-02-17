import * as THREE from "three";

import { Component } from "./component";
import { Base } from "../base/base";

/**
 * A class to inject shadertoy uniforms into the existing one.
 */
class UniformInjector extends Component {
  shadertoyUniforms: { [key: string]: THREE.IUniform<any> };
  constructor(base: Base) {
    super(base);

    this.shadertoyUniforms = {
      iGlobalTime: {
        value: 0,
      },
      iTime: {
        value: 0,
      },
      iTimeDelta: {
        value: 0,
      },
      iResolution: {
        value: new THREE.Vector3(window.innerWidth, window.innerHeight, 1),
      },
      iMouse: {
        value: new THREE.Vector4(0, 0, 0, 0),
      },
      iFrame: {
        value: 0,
      },
      iDate: {
        value: new THREE.Vector4(
          new Date().getFullYear(),
          new Date().getMonth() + 1,
          new Date().getDate(),
          new Date().getHours()
        ),
      },
      iSampleRate: {
        value: 44100,
      },
      iChannelTime: {
        value: [0, 0, 0, 0],
      },
    };
  }
  injectShadertoyUniforms(
    uniforms: { [key: string]: THREE.IUniform<any> } = this.shadertoyUniforms
  ) {
    const t = this.base.clock.elapsedTime;
    uniforms.iGlobalTime.value = t;
    uniforms.iTime.value = t;
    const delta = this.base.clock.deltaTime;
    uniforms.iTimeDelta.value = delta;
    uniforms.iResolution.value = new THREE.Vector3(
      window.innerWidth,
      window.innerHeight,
      1
    );
    const { x, y } = this.base.iMouse.mouse;
    uniforms.iMouse.value = new THREE.Vector4(x, y, 0, 0);
    uniforms.iDate.value = new THREE.Vector4(
      new Date().getFullYear(),
      new Date().getMonth() + 1,
      new Date().getDate(),
      new Date().getHours()
    );
    uniforms.iChannelTime.value = [t, t, t, t];
  }
}

/**
 * A class to inject Pixi Filter uniforms into the existing one.
 */
class PixiFilterUniformInjector extends Component {
  pixiFilterUniforms: { [key: string]: THREE.IUniform<any> };
  constructor(base: Base) {
    super(base);

    this.pixiFilterUniforms = {
      time: {
        value: 0,
      },
      dimensions: {
        value: new THREE.Vector2(window.innerWidth, window.innerHeight),
      },
      filterArea: {
        value: new THREE.Vector4(window.innerWidth, window.innerHeight, 0, 0),
      },
      filterClamp: {
        value: new THREE.Vector4(
          0,
          0,
          (window.innerWidth - 1) / window.innerWidth,
          (window.innerHeight - 1) / window.innerHeight
        ),
      },
    };
  }
  injectPixiFilterUniforms(
    uniforms: { [key: string]: THREE.IUniform<any> } = this.pixiFilterUniforms
  ) {
    const t = this.base.clock.elapsedTime;
    uniforms.time.value = t;
    uniforms.dimensions.value = new THREE.Vector2(
      window.innerWidth,
      window.innerHeight
    );
    uniforms.filterArea.value = new THREE.Vector4(
      window.innerWidth,
      window.innerHeight,
      0,
      0
    );
    uniforms.filterClamp.value = new THREE.Vector4(
      0,
      0,
      (window.innerWidth - 1) / window.innerWidth,
      (window.innerHeight - 1) / window.innerHeight
    );
  }
}

export { UniformInjector, PixiFilterUniformInjector };
