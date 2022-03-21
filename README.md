<p align="center">
  <img src="./assets/logo.jpg" width="200">
</p>
<p>
  <img alt="Version" src="https://img.shields.io/npm/v/kokomi.js.svg" />
  <a href="#" target="_blank">
    <img alt="License: MIT" src="https://img.shields.io/badge/License-MIT-yellow.svg" />
  </a>
  <a href="https://twitter.com/alphardex007" target="_blank">
    <img alt="Twitter: alphardex007" src="https://img.shields.io/twitter/follow/alphardex007.svg?style=social" />
  </a>
</p>

# kokomi.js

> A growing three.js helper library.

## Install

```sh
npm i kokomi.js
```

## Hello world

index.html

```html
<div id="sketch" class="bg-black w-screen h-screen overflow-hidden"></div>
```

script.ts

```ts
import * as kokomi from "kokomi.js";

class Sketch extends kokomi.Base {
  create() {
    new kokomi.OrbitControls(this);

    const box = new kokomi.Box(this);
    box.addExisting();

    this.update((time: number) => {
      box.spin(time);
    });
  }
}

const createSketch = () => {
  const sketch = new Sketch();
  sketch.create();
  return sketch;
};

createSketch();
```

## Features

- You can simply extend `kokomi.Base` class to kickstart a simple scene without writing any boilerplate codes.
- Either you can write all your three.js code in a single file, or encapsulate your code into individual classes in a large project. By extending `kokomi.Component`, you can make your components keep their own state and animation.
- `kokomi.AssetManager` can handle the preloads of assets (gltfModel, texture, cubeTexture, font, etc). You can just write a simple json file to config your assets without caring about various loaders.
- Integrated with [three.interactive](https://github.com/markuslerner/THREE.Interactive), which can handle mouse and touch interactions easily.

## Index

<table>
    <tr>
        <td valign="top">
            <ul>
                <li>
                    <a href="#base">Base</a>
                </li>
                <ul>
                    <li>
                        <a href="#base">Base</a>
                    </li>
                </ul>
            </ul>
            <ul>
                <li>
                    <a href="#camera">Camera</a>
                </li>
                <ul>
                    <li>
                        <a href="#screencamera">ScreenCamera</a>
                    </li>
                </ul>
            </ul>
            <ul>
                <li>
                    <a href="#components">Components</a>
                </li>
                <ul>
                    <li>
                        <a href="#assetmanager">AssetManager</a>
                    </li>
                    <li>
                        <a href="#component">Component</a>
                    </li>
                    <li>
                        <a href="#stats">Stats</a>
                    </li>
                </ul>
            </ul>
            <ul>
                <li>
                    <a href="#controls">Controls</a>
                </li>
                <ul>
                    <li>
                        <a href="#orbitcontrols">OrbitControls</a>
                    </li>
                </ul>
            </ul>
            <ul>
                <li>
                    <a href="#geometries">Geometries</a>
                </li>
                <ul>
                    <li>
                        <a href="#hyperbolichelicoid">HyperbolicHelicoid</a>
                    </li>
                    <li>
                        <a href="#sphube">Sphube</a>
                    </li>
                </ul>
            </ul>
            <ul>
                <li>
                    <a href="#shapes">Shapes</a>
                </li>
                <ul>
                    <li>
                        <a href="#box">Box</a>
                    </li>
                    <li>
                        <a href="#screenquad">ScreenQuad</a>
                    </li>
                </ul>
            </ul>
            <ul>
                <li>
                    <a href="#utils">Utils</a>
                </li>
                <ul>
                    <li>
                        <a href="#dom">DOM</a>
                    </li>
                    <li>
                        <a href="#gl">GL</a>
                    </li>
                    <li>
                        <a href="#misc">Misc</a>
                    </li>
                </ul>
            </ul>
        </td>
    </tr>
</table>

# API

## Base

### Base

By extending this class, you can kickstart a basic three.js scene easily.

```ts
class Sketch extends kokomi.Base {
  create() {
    // Write your own awesome code here...
  }
}
```

## Camera

### ScreenCamera

This camera can make the pixel unit of a WebGL element equals with one of a HTML Element. If combined with [maku.js](https://github.com/alphardex/maku.js), you can easily merge HTML with WebGL!

```ts
class Sketch extends kokomi.Base {
  create() {
    const screenCamera = new kokomi.ScreenCamera(this);
    screenCamera.addExisting();
  }
}
```

## Components

### AssetManager

This class can handle the preloads of assets (gltfModel, texture, cubeTexture, font, etc). You can just write a simple json file to config your assets without caring about various loaders.

```ts
import foxModel from "/models/Fox/glTF/Fox.gltf";

const resourceList: kokomi.ResourceItem[] = [
  {
    name: "foxModel",
    type: "gltfModel",
    path: foxModel,
  },
];

class Sketch extends kokomi.Base {
  assetManager: kokomi.AssetManager;
  constructor(sel = "#sketch") {
    super(sel);

    const assetManager = new kokomi.AssetManager(this, resourceList);
    this.assetManager = assetManager;
  }
  create() {
    this.assetManager.emitter.on("ready", () => {
      const fox = new Fox(this, this.assetManager.items.foxModel);
      fox.addExisting();
      fox.playAction("idle");
    });
  }
}
```

### Component

By extending this class, you can make your components keep their own state and animation.

```ts
class MyBox extends kokomi.Component {
  box: kokomi.Box;
  // component's own state
  constructor(base: kokomi.Base) {
    super(base);

    const box = new kokomi.Box(base);
    box.addExisting();
    this.box = box;
  }
  // component's own animation
  update(time: number): void {
    this.box.mesh.rotation.y = time / 1000;
  }
}
```

### Stats

A drop-in fps meter powered by [stats.js](https://github.com/mrdoob/stats.js)

```ts
class Sketch extends kokomi.Base {
  create() {
    new kokomi.Stats(this);
  }
}
```

## Controls

### OrbitControls

A drop-in orbitControls

```ts
class Sketch extends kokomi.Base {
  create() {
    new kokomi.OrbitControls(this);
  }
}
```

## Geometries

### HyperbolicHelicoid

A [HyperbolicHelicoid](https://mathworld.wolfram.com/HyperbolicHelicoid.html) geometry

```ts
class Sketch extends kokomi.Base {
  create() {
    const geometry = new kokomi.HyperbolicHelicoidGeometry(64, 64);
    const material = new THREE.MeshBasicMaterial();
    const mesh = new THREE.Mesh(geometry, material);
    this.scene.add(mesh);
  }
}
```

### Sphube

A [Sphube](https://arxiv.org/pdf/1604.02174.pdf) geometry

```ts
class Sketch extends kokomi.Base {
  create() {
    const geometry = new kokomi.SphubeGeometry(64, 64);
    const material = new THREE.MeshBasicMaterial();
    const mesh = new THREE.Mesh(geometry, material);
    this.scene.add(mesh);
  }
}
```

## Shapes

### Box

A cute box mesh that we can see everywhere

```ts
class Sketch extends kokomi.Base {
  create() {
    const box = new kokomi.Box(this);
    box.addExisting();
  }
}
```

### ScreenQuad

A fullsceen plane with which you can create fullscreen effects such as raymarching. By default, it has 3 uniforms: `iTime`, `iResolution`, `iMouse`

```ts
class Sketch extends kokomi.Base {
  create() {
    const screenQuad = new kokomi.ScreenQuad(this, {
      vertexShader: `your vertex shader here`,
      fragmentShader: `your fragment shader here`,
      uniforms: {},
    });
    screenQuad.addExisting();
  }
}
```

## Utils

### DOM

#### preloadImages

preload all the img element, powered by [imagesloaded](https://github.com/desandro/imagesloaded)

```ts
class Sketch extends kokomi.Base {
  async create() {
    await kokomi.preloadImages();
  }
}
```

### GL

#### makeBuffer

A shortcut function to make a Float32Array buffer

```ts
class Sketch extends kokomi.Base {
  create() {
    const geometry = new THREE.BufferGeometry();
    const buffer = kokomi.makeBuffer(
      50,
      () => THREE.MathUtils.randFloat(-0.5, 0.5) * 4
    );
    geometry.setAttribute("position", new THREE.BufferAttribute(buffer, 3));
    // produced 50 random position triangles
  }
}
```

#### iterateBuffer

A shortcut function to iterate through a Float32Array buffer

```ts
class Sketch extends kokomi.Base {
  create() {
    const count = 20000;
    const positions = kokomi.makeBuffer(
      count,
      () => THREE.MathUtils.randFloat(-0.5, 0.5) * 10
    );

    kokomi.iterateBuffer(
      positions,
      count,
      (arr: number[], axis: THREE.Vector3) => {
        arr[axis.y] = Math.sin(arr[axis.x]);
      }
    );
  }
}
```

### Misc

#### enableRealisticRender

Give the three.js renderer some default parameters so that it can produce a realistic effect

```ts
class Sketch extends kokomi.Base {
  create() {
    kokomi.enableRealisticRender(this.renderer);
  }
}
```

# End

## Author

👤 **alphardex**

- Website: https://alphardex.netlify.app
- Twitter: [@alphardex007](https://twitter.com/alphardex007)
- Github: [@alphardex](https://github.com/alphardex)

## Show your support

Give a ⭐️ if this project helped you!

---

_This README was generated with ❤️ by [readme-md-generator](https://github.com/kefranabg/readme-md-generator)_
