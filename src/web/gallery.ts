import * as THREE from "three";

import { Maku, MakuGroup, Scroller } from "maku.js";
import { HTMLIVCElement, MakuConfig } from "maku.js/types/types";

import type { Base } from "../base/base";
import { Component } from "../components/component";

import { preloadImages } from "../utils";

export interface GalleryConfig {
  elList: HTMLIVCElement[];
  vertexShader: string;
  fragmentShader: string;
  uniforms: { [uniform: string]: THREE.IUniform<any> };
  makuConfig: MakuConfig;
  isScrollPositionSync: boolean;
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
  constructor(base: Base, config: Partial<GalleryConfig> = {}) {
    super(base);

    const {
      elList = [...document.querySelectorAll("img")],
      vertexShader = defaultVertexShader,
      fragmentShader = defaultFragmentShader,
      uniforms = {},
      makuConfig = {},
      isScrollPositionSync = true,
    } = config;

    this.elList = elList;
    this.vertexShader = vertexShader;
    this.fragmentShader = fragmentShader;
    this.uniforms = uniforms;
    this.makuConfig = makuConfig;
    this.isScrollPositionSync = isScrollPositionSync;

    this.makuMaterial = null;
    this.makuGroup = null;
    this.scroller = null;
  }
  async addExisting(): Promise<void> {
    // Load all the images
    await preloadImages();

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
          iTime: {
            value: 0,
          },
          iResolution: {
            value: new THREE.Vector2(window.innerWidth, window.innerHeight),
          },
          iMouse: {
            value: new THREE.Vector2(0, 0),
          },
        },
        ...this.uniforms,
      },
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

    // Make a scroller
    const scroller = new Scroller();
    this.scroller = scroller;
    scroller.listenForScroll();
  }
  update(time: number): void {
    const makuGroup = this.makuGroup;
    const scroller = this.scroller;

    scroller?.syncScroll();

    if (this.isScrollPositionSync) {
      makuGroup?.setPositions(scroller?.scroll.current);
    }

    makuGroup?.makus.forEach((maku) => {
      const material = maku.mesh.material as THREE.ShaderMaterial;
      const uniforms = material.uniforms;
      uniforms.iTime.value = time / 1000;
      uniforms.iResolution.value = new THREE.Vector2(
        window.innerWidth,
        window.innerHeight
      );
      uniforms.iMouse.value = this.base.interactionManager.mouse;
    });
  }
}

export { Gallery };
