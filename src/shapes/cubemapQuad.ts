import * as THREE from "three";

import type { Base } from "../base/base";

import { PlaneConfig, ScreenQuad } from "./screenQuad";

const cubemapShaderUniforms = `
uniform vec2 unViewport;
uniform vec3 unCorners[5];
`;

const cubemapShaderMain = `
void main()
{
    vec4 color=vec4(0.,0.,0.,1.);
    vec3 ro=vec3(0.);
    vec2 uv=gl_FragCoord.xy/unViewport.xy;
    vec3 rd=normalize(mix(mix(unCorners[0],unCorners[1],uv.x),mix(unCorners[3],unCorners[2],uv.x),uv.y)-ro);
    mainCubemap(color,gl_FragCoord.xy,ro,rd);
    gl_FragColor=color;
}
`;

/**
 * TODO
 */
class CubemapQuad extends ScreenQuad {
  constructor(base: Base, config: Partial<PlaneConfig> = {}) {
    super(base, {
      ...config,
      fragmentShader: `
      ${cubemapShaderUniforms}

      ${config.fragmentShader}

      ${cubemapShaderMain}
      `,
      uniforms: {
        unViewport: {
          value: new THREE.Vector2(window.innerHeight, window.innerHeight),
        },
        unCorners: {
          value: [1, 1, 1, 1, 1, -1, 1, -1, -1, 1, -1, 1, 0, 0, 0], // X
        },
      },
    });
  }
}

export { CubemapQuad };
