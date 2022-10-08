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

With just several lines, you can make a most basic 3D scene :d

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

Demo (Also can be used as a template): https://codesandbox.io/s/kokomi-js-starter-tjh29w?file=/src/app.ts

See more examples: https://kokomi-playground.vercel.app

## [Documentation](https://kokomi-js.vercel.app/docs/)

## Features

- You can simply extend `kokomi.Base` class to kickstart a simple scene without writing any boilerplate codes.
- Either you can write all your three.js code in a single file, or encapsulate your code into individual classes in a large project. By extending `kokomi.Component`, you can make your components keep their own state and animation.
- `kokomi.AssetManager` can handle the preloads of assets (gltfModel, texture, cubeTexture, font, etc). You can just write a simple json file to config your assets without caring about various loaders.
- Integrated with [three.interactive](https://github.com/markuslerner/THREE.Interactive), which can handle mouse and touch interactions easily.

## Previews

### Basic Scene

![1](./assets/previews/1.gif)

### Asset Manage

![2](./assets/previews/2.gif)

### Util Geometry

![3](./assets/previews/3.gif)

### Shadertoy Integration

![4](./assets/previews/4.gif)

Credit: https://www.shadertoy.com/view/XtyXzW

### Persistence Effect

![4](./assets/previews/5.gif)

## Author

👤 **alphardex**

- Website: https://alphardex.netlify.app
- Twitter: [@alphardex007](https://twitter.com/alphardex007)
- Github: [@alphardex](https://github.com/alphardex)

## Show your support

Give a ⭐️ if this project helped you!

---

_This README was generated with ❤️ by [readme-md-generator](https://github.com/kefranabg/readme-md-generator)_
