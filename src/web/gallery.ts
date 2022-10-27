import * as THREE from "three";

import { Maku, MakuGroup, Scroller } from "maku.js";
import { HTMLIVCElement, MakuConfig } from "maku.js/types/types";

import type { Base } from "../base/base";
import { Component } from "../components/component";

import { preloadImages } from "../utils";

import { UniformInjector } from "../components/uniformInjector";
import { AllMaterialParams } from "../lib/customShaderMaterial/vanilla";

export interface GalleryConfig {
  elList: HTMLIVCElement[];
  vertexShader: string;
  fragmentShader: string;
  uniforms: { [uniform: string]: THREE.IUniform<any> };
  makuConfig: MakuConfig;
  isScrollPositionSync: boolean;
  scroller: Scroller;
  materialParams: AllMaterialParams;
}

const defaultVertexShader = `
uniform float iTime;
uniform vec2 iResolution;
uniform vec2 iMouse;

varying vec2 vUv;

void main(){
    vec3 p=position;
    gl_Position=projectionMatrix*modelViewMatrix*vec4(p,1.);
    
    vUv=uv;
}
`;

const defaultFragmentShader = `
uniform float iTime;
uniform vec2 iResolution;
uniform vec2 iMouse;

uniform sampler2D uTexture;

varying vec2 vUv;

void main(){
    vec4 tex=texture(uTexture,vUv);
    vec3 color=tex.rgb;
    gl_FragColor=vec4(color,1.);
}
`;

/**
 * It's just an encapsuled class for [maku.js](https://github.com/alphardex/maku.js), which is a powerful bridge between HTML and WebGL.
 *
 * Demo: https://kokomi-playground.vercel.app/#imageMouseWave
 */
class Gallery extends Component {
  elList: HTMLIVCElement[];
  vertexShader: string;
  fragmentShader: string;
  uniforms: { [uniform: string]: THREE.IUniform<any> };
  makuConfig: MakuConfig;
  isScrollPositionSync: boolean;
  makuMaterial: THREE.ShaderMaterial | null;
  makuGroup: MakuGroup | null;
  scroller: Scroller | null;
  uniformInjector: UniformInjector;
  materialParams: AllMaterialParams;
  useSelfScroller: boolean;
  constructor(base: Base, config: Partial<GalleryConfig> = {}) {
    super(base);

    const {
      elList = [...document.querySelectorAll("img")],
      vertexShader = defaultVertexShader,
      fragmentShader = defaultFragmentShader,
      uniforms = {},
      makuConfig = {},
      isScrollPositionSync = true,
      scroller = null,
      materialParams = {},
    } = config;

    this.elList = elList;
    this.vertexShader = vertexShader;
    this.fragmentShader = fragmentShader;
    this.uniforms = uniforms;
    this.makuConfig = makuConfig;
    this.isScrollPositionSync = isScrollPositionSync;

    this.makuMaterial = null;
    this.makuGroup = null;
    this.scroller = scroller;
    this.materialParams = materialParams;

    const uniformInjector = new UniformInjector(base);
    this.uniformInjector = uniformInjector;

    this.useSelfScroller = false;
    if (!scroller) {
      this.useSelfScroller = true;
    }
  }
  async addExisting(): Promise<void> {
    // Load all the images
    await preloadImages();

    const { uniformInjector } = this;

    // Create a ShaderMaterial
    const makuMaterial = new THREE.ShaderMaterial({
      vertexShader: this.vertexShader,
      fragmentShader: this.fragmentShader,
      side: THREE.DoubleSide,
      uniforms: {
        ...{
          uTexture: {
            value: null,
          },
        },
        ...uniformInjector.shadertoyUniforms,
        ...this.uniforms,
      },
      ...this.materialParams,
    });
    this.makuMaterial = makuMaterial;

    // Make a MakuGroup that contains all the makus!
    const makuGroup = new MakuGroup();
    this.makuGroup = makuGroup;
    const makus = this.elList.map(
      (el) => new Maku(el, makuMaterial, this.base.scene, this.makuConfig)
    );
    makuGroup.addMultiple(makus);

    // Sync images positions
    makuGroup.setPositions();

    // scroller listen for scroll
    if (this.useSelfScroller) {
      const scroller = new Scroller();
      this.scroller = scroller;
      this.scroller.listenForScroll();
    }
  }
  update(time: number): void {
    const { scroller, makuGroup } = this;

    scroller?.syncScroll();

    makuGroup?.makus.forEach((maku) => {
      const material = maku.mesh.material as THREE.ShaderMaterial;
      const uniforms = material.uniforms;
      this.uniformInjector.injectShadertoyUniforms(uniforms);

      if (this.isScrollPositionSync) {
        if (maku.el.classList.contains("webgl-fixed")) {
          // fixed element
          maku.setPosition(0);
        } else {
          // scroll element
          maku.setPosition(scroller?.scroll.current);
        }
      }
    });
  }
  checkImagesLoaded() {
    return new Promise((resolve) => {
      this.base.update(() => {
        if (this.makuGroup) {
          if (
            this.makuGroup.makus
              .map((maku) => {
                return (maku.mesh.material as THREE.ShaderMaterial).uniforms
                  .uTexture.value.image?.complete;
              })
              .every((item) => item)
          ) {
            resolve(true);
          }
        }
      });
    });
  }
}

export { Gallery };
