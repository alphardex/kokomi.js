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

Demo: https://kokomi-js.vercel.app/#base

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

This class can handle the preloads of assets (gltfModel, texture, cubeTexture, font, etc). You can just write a simple js file to config your assets without caring about various loaders.

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

### Clock

TODO

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

### IMouse

TODO


### Physics

kokomi.js uses [cannon.js](https://github.com/pmndrs/cannon-es) for physics. Just create mesh and body, and add it to base's physics!

```ts
import * as THREE from "three";
import * as kokomi from "kokomi.js";
import * as CANNON from "cannon-es";

class Box extends kokomi.Component {
  mesh: THREE.Mesh;
  body: CANNON.Body;
  constructor(base: kokomi.Base) {
    super(base);

    const geometry = new THREE.BoxGeometry(2, 2, 0.5);
    const material = new THREE.MeshStandardMaterial({
      metalness: 0.3,
      roughness: 0.4,
    });
    const mesh = new THREE.Mesh(geometry, material);
    this.mesh = mesh;

    const shape = new CANNON.Box(new CANNON.Vec3(1, 1, 0.25));
    const body = new CANNON.Body({
      mass: 1,
      shape,
      position: new CANNON.Vec3(0, 1, 0),
    });
    this.body = body;
  }
  addExisting(): void {
    const { base, mesh, body } = this;
    const { scene, physics } = base;

    scene.add(mesh);
    physics.add({ mesh, body });
  }
}
```

### RaycastSelector

TODO


### Stats

A drop-in fps meter powered by [stats.js](https://github.com/mrdoob/stats.js)

```ts
class Sketch extends kokomi.Base {
  create() {
    new kokomi.Stats(this);
  }
}
```

### UniformInjector

TODO


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

## Effects

### PersistenceEffect

A drop-in Persistence Effect

```ts
class Sketch extends kokomi.Base {
  create() {
    const persistenceEffect = new kokomi.PersistenceEffect(this);
    persistenceEffect.addExisting();
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

## Materials

### GlassMaterial

A material that produces a glass-like effect.

```ts
class Sketch extends kokomi.Base {
  create() {
    new kokomi.OrbitControls(this);

    const material = new kokomi.GlassMaterial({});
    const box = new kokomi.Box(this, {
      material,
    });
    box.addExisting();
  }
}
```

### ThinFilmFresnelMap

TODO

## Panorama

### ImagePanorama

First you should add `kokomi.Viewer`, which automatically adds proper camera and orbitControls to your scene.

Then load your image asset with `kokomi.AssetManager`. After this, you can use `kokomi.ImagePanorama` to get the panorama scene and add it to the viewer.

```ts
import panoramaImage from "./assets/textures/field.jpg?url";

const resourceList: kokomi.ResourceItem[] = [
  {
    name: "panoramaImage",
    type: "texture",
    path: panoramaImage,
  },
];

class Sketch extends kokomi.Base {
  create() {
    const viewer = new kokomi.Viewer(this);

    const assetManager = new kokomi.AssetManager(this, resourceList);
    assetManager.emitter.on("ready", () => {
      const panoramaImage = assetManager.items.panoramaImage;
      const panorama = new kokomi.ImagePanorama(this, panoramaImage);
      viewer.add(panorama);
    });
  }
}
```

### PanoramaGenerator

TODO

### Viewer

TODO


## Postprocessing

### CustomEffect

With this, you can just provide your vertex and fragment shader to make a customized postprocessing effect.

```ts
import postprocessingVertexShader from "./shaders/postprocessing/vertex.glsl";
import postprocessingFragmentShader from "./shaders/postprocessing/fragment.glsl";

class Sketch extends kokomi.Base {
  create() {
    const customEffect = new kokomi.CustomEffect(this, {
      vertexShader: postprocessingVertexShader,
      fragmentShader: postprocessingFragmentShader,
    });
    customEffect.addExisting();
  }
}
```

## RenderTargets

### RenderTexture

TODO


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

### CustomMesh

TODO

### CustomPoints

TODO


### ScreenQuad

A fullsceen plane with which you can create fullscreen effects such as raymarching.

By default, it has almost all the uniforms that [shadertoy](https://www.shadertoy.com/) has: `iTime`, `iResolution`, `iMouse`, etc

If you just want to run your shadertoy shader locally, you can turn on `shadertoyMode`, which will inject all the shadertoy uniforms into the fragment shader as well as `main()` function for three.js. Thus, you can just copy & paste your shadertoy shader and run!

```ts
class Sketch extends kokomi.Base {
  create() {
    const screenQuad = new kokomi.ScreenQuad(this, {
      shadertoyMode: true,
      fragmentShader: `your fragment shader here`,
      uniforms: {},
    });
    screenQuad.addExisting();
  }
}
```

#### shader-toy tag

Also, you can use `<shader-toy></shader-toy>` tag to setup a shadertoy environment in html with just few lines of code!

```html
<shader-toy>
  <script type="frag">
    your awesome shader here
  </script>
</shader-toy>
```

```ts
import * as kokomi from "kokomi.js";

kokomi.ShaderToyElement.register();
```

### RayMarchingQuad

Also a screenQuad, but for Raymarching.

It's used with [marcher.js](https://github.com/alphardex/marcher.js)——a Raymarching code generator library.

```ts
class Sketch extends kokomi.Base {
  create() {
    new kokomi.OrbitControls(this);

    const mar = new marcher.Marcher({
      antialias: false,
    });

    const map = new marcher.SDFMapFunction();

    {
      const layer = new marcher.SDFLayer();

      const box = new marcher.BoxSDF({
        sdfVarName: "d1",
      });
      box.round(0.1);
      layer.addPrimitive(box);

      map.addLayer(layer);
    }

    mar.setMapFunction(map);

    const rayMarchingQuad = new kokomi.RayMarchingQuad(this, mar);
    rayMarchingQuad.render();
  }
}
```

### CubemapQuad

TODO

### Text3D

TODO

### TextMesh

TODO

## Utils

TODO

## Web

### Gallery

It's just an encapsuled class for [maku.js](https://github.com/alphardex/maku.js), which is a powerful bridge between HTML and WebGL.

```ts
import mainVertexShader from "./shaders/main/vertex.glsl";
import mainFragmentShader from "./shaders/main/fragment.glsl";

class Sketch extends kokomi.Base {
  async create() {
    const screenCamera = new kokomi.ScreenCamera(this);
    screenCamera.addExisting();

    const gallary = new kokomi.Gallery(this, {
      vertexShader: mainVertexShader,
      fragmentShader: mainFragmentShader,
    });
    await gallary.addExisting();
  }
}
```

### Html

It can help you merge HTML elements into the WebGL world by converting 3D positions to 2D positions. If element is visible, it will have a `visible` CSS class (can be customized), and for 2D position it will have 3 CSS variables `--x`, `--y` and `--z-index` (can be customized too)

```html
<div id="sketch" class="bg-black w-screen h-screen overflow-hidden"></div>
<div class="absolute cover overflow-hidden pointer-events-none">
  <div class="point point-1">
    <div class="label">This is a box.</div>
  </div>
</div>
```

```css
.point {
  position: absolute;
  top: 0;
  left: 0;
  pointer-events: auto;
  transform: translate(var(--x), var(--y));
  z-index: var(--z-index);
}

.point .label {
  position: absolute;
  color: white;
  transform: translate(-50%, -50%);
  user-select: none;
  white-space: nowrap;
}
```

```ts
class Sketch extends kokomi.Base {
  create() {
    new kokomi.OrbitControls(this);

    const box = new kokomi.Box(this);
    box.addExisting();

    const html = new kokomi.Html(
      this,
      document.querySelector(".point-1") as HTMLElement,
      box.mesh.position.clone().add(new THREE.Vector3(0, 0.2, 0))
    );
  }
}
```

### Scroller

TODO

### ShaderToyElement

See [this](#shader-toy-tag)
