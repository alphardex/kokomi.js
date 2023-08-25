import * as THREE from "three";

import { Maku, MakuGroup, Scroller } from "maku.js";
import { HTMLIVCElement, MakuConfig } from "maku.js/types/types";

import type { Base } from "../base/base";
import { Component } from "../components/component";

import { preloadImages } from "../utils";

import { UniformInjector } from "../components/uniformInjector";
import { AllMaterialParams } from "../lib/THREE-CustomShaderMaterial";

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

const defaultVertexShader = /* glsl */ `
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

const defaultFragmentShader = /* glsl */ `
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
 * Demo: https://kokomi-playground.vercel.app/entries/#imageMouseWave
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
          uMeshSize: {
            value: new THREE.Vector2(0, 0),
          },
          uMeshPosition: {
            value: new THREE.Vector2(0, 0),
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
      (el) => new Maku(el, makuMaterial, this.container, this.makuConfig)
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

    // handle resize
    this.base.resizer.on("resize", () => {
      makuGroup.makus.forEach((maku) => {
        maku.rect = maku.el.getBoundingClientRect();
      });
    });
  }
  update(time: number): void {
    const { scroller, makuGroup } = this;

    scroller?.syncScroll();

    makuGroup?.makus.forEach((maku) => {
      const material = maku.mesh.material as THREE.ShaderMaterial;
      const uniforms = material.uniforms;
      this.uniformInjector.injectShadertoyUniforms(uniforms);

      uniforms.uMeshSize.value = new THREE.Vector2(
        maku.el.clientWidth,
        maku.el.clientHeight
      );
      uniforms.uMeshPosition.value = new THREE.Vector2(
        maku.mesh.position.x,
        maku.mesh.position.y
      );

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
  iterate(cb: (maku: Maku, i: number) => void) {
    this.makuGroup?.makus.forEach((maku, i) => {
      cb(maku, i);
    });
  }
}

export interface HorizontalGalleryConfig extends GalleryConfig {
  gap: number;
  appendCount: number;
}

/**
 * A horizontal infinite gallery.
 *
 * Demo: https://kokomi-playground.vercel.app/entries/#leanSpeedGallery
 */
class HorizontalGallery extends Gallery {
  gap: number;
  appendCount: number;
  constructor(base: Base, config: Partial<HorizontalGalleryConfig> = {}) {
    super(base, { ...config, isScrollPositionSync: false });

    const { gap = 64, appendCount = 3 } = config;
    this.gap = gap;
    this.appendCount = appendCount;
  }
  getItemWidth() {
    const { gap } = this;

    let targetWidth = 0;

    if (this.makuGroup) {
      const imgWidth = this.makuGroup.makus[0].el.clientWidth;
      const itemWidth = imgWidth + gap;
      targetWidth = itemWidth;
    }

    return targetWidth;
  }
  sync(current = 0) {
    const { appendCount } = this;

    if (this.makuGroup) {
      const itemWidth = this.getItemWidth();
      const totalWidth = itemWidth * this.makuGroup.makus.length;

      this.iterate((maku, i) => {
        maku.mesh.position.x =
          ((itemWidth * i - current - 114514 * totalWidth) % totalWidth) +
          itemWidth * appendCount;
      });
    }
  }
  getSnapIndex(target = 0) {
    let targetIndex = 0;

    if (this.makuGroup) {
      const itemWidth = this.getItemWidth();
      const itemIndex = Math.round(target / itemWidth);
      targetIndex = itemIndex;
    }

    return targetIndex;
  }
  snap(target = 0) {
    let targetResult = target;

    if (this.makuGroup) {
      const itemWidth = this.getItemWidth();
      const snapIndex = this.getSnapIndex(target);
      const snapTarget = itemWidth * snapIndex;
      targetResult = snapTarget;
    }

    return targetResult;
  }
}

export { Gallery, HorizontalGallery };
