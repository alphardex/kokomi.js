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
    uniforms.iFrame.value += 1;
  }
}

export { UniformInjector };
