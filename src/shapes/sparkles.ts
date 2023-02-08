import * as THREE from "three";

import type { Base } from "../base/base";
import { Component } from "../components/component";

import { UniformInjector } from "../components/uniformInjector";
import {
  isFloat32Array,
  normalizeVector,
  usePropAsIsOrAsAttribute,
} from "../utils/gl";

const sparklesVertexShader = /* glsl */ `
uniform float iTime;
uniform vec2 iResolution;
uniform vec2 iMouse;

varying vec2 vUv;

uniform float uPixelRatio;

attribute float size;
attribute float speed;
attribute float opacity;
attribute vec3 noise;
attribute vec3 color;

varying vec3 vColor;
varying float vOpacity;

vec3 distort(vec3 p){
    float t=iTime;
    p.y+=sin(t*speed+p.x*noise.x*100.)*.2;
    p.z+=cos(t*speed+p.x*noise.y*100.)*.2;
    p.x+=cos(t*speed+p.x*noise.z*100.)*.2;
    return p;
}

void main(){
    vec3 p=position;
    
    p=distort(p);
    
    vec4 mvPosition=modelViewMatrix*vec4(p,1.);
    
    gl_Position=projectionMatrix*mvPosition;
    
    vUv=uv;
    
    gl_PointSize=size*uPixelRatio*25.;
    gl_PointSize*=(1./-mvPosition.z);
    
    vColor=color;
    vOpacity=opacity;
}
`;

const sparklesFragmentShader = /* glsl */ `
uniform float iTime;
uniform vec2 iResolution;
uniform vec2 iMouse;

varying vec2 vUv;

varying vec3 vColor;
varying float vOpacity;

float spot(vec2 p,float r,float offset){
    float center=distance(p,vec2(.5));
    float strength=r/center-offset;
    return strength;
}

void main(){
    vec2 p=vUv;
    
    vec3 col=vColor;
    
    float alpha=spot(gl_PointCoord,.05,.1)*vOpacity;
    
    gl_FragColor=vec4(col,alpha);
}
`;

export interface SparklesConfig {
  count: number;
  speed: number | Float32Array;
  opacity: number | Float32Array;
  color: THREE.ColorRepresentation | Float32Array;
  size: number | Float32Array;
  scale: number | [number, number, number] | THREE.Vector3;
  noise: number | [number, number, number] | THREE.Vector3 | Float32Array;
  blending: THREE.Blending;
}

class Sparkles extends Component {
  uj: UniformInjector;
  sparkles: THREE.Points;
  constructor(base: Base, config: Partial<SparklesConfig> = {}) {
    super(base);

    const {
      count = 100,
      speed = 1,
      opacity = 1,
      color = undefined,
      size = undefined,
      scale = 1,
      noise = 1,
      blending = THREE.NormalBlending,
    } = config;

    const geo = new THREE.BufferGeometry();

    const positions = Float32Array.from(
      Array.from({ length: count }, () =>
        normalizeVector(scale).map(THREE.MathUtils.randFloatSpread)
      ).flat()
    );
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));

    // @ts-ignore
    const sizes = usePropAsIsOrAsAttribute<number>(count, size, Math.random);
    const opacities = usePropAsIsOrAsAttribute<number>(count, opacity);
    const speeds = usePropAsIsOrAsAttribute<number>(count, speed);
    const noises = usePropAsIsOrAsAttribute<typeof noise>(count * 3, noise);
    const colors = usePropAsIsOrAsAttribute<THREE.ColorRepresentation>(
      color === undefined ? count * 3 : count,
      !isFloat32Array(color) ? new THREE.Color(color) : color,
      () => 1
    );
    geo.setAttribute("size", new THREE.BufferAttribute(sizes, 1));
    geo.setAttribute("opacity", new THREE.BufferAttribute(opacities, 1));
    geo.setAttribute("speed", new THREE.BufferAttribute(speeds, 1));
    geo.setAttribute("noise", new THREE.BufferAttribute(noises, 3));
    geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    const uj = new UniformInjector(this.base);
    this.uj = uj;

    const sparklesMat = new THREE.ShaderMaterial({
      vertexShader: sparklesVertexShader,
      fragmentShader: sparklesFragmentShader,
      uniforms: {
        ...uj.shadertoyUniforms,
        ...{
          uPixelRatio: {
            value: Math.min(window.devicePixelRatio, 2),
          },
        },
      },
      transparent: true,
      blending,
      depthWrite: false,
    });

    const sparkles = new THREE.Points(geo, sparklesMat);
    this.sparkles = sparkles;

    this.base.resizer.on("resize", () => {
      sparkles.material.uniforms.uPixelRatio.value = Math.min(
        window.devicePixelRatio,
        2
      );
    });
  }
  addExisting(): void {
    this.container.add(this.sparkles);
  }
  update(time: number): void {
    if (this.sparkles) {
      const mat = this.sparkles.material as THREE.ShaderMaterial;
      this.uj.injectShadertoyUniforms(mat.uniforms);
    }
  }
}

export { Sparkles };
