import * as kokomi from "kokomi.js";
import * as THREE from "three";
import gsap from "gsap";
import * as dat from "lil-gui";

class Sketch extends kokomi.Base {
  create() {
    this.camera.position.set(0, 0, 2);

    new kokomi.OrbitControls(this);

    const params = {
      width: 128,
      pointSize: 4,
      amplitude: 0.002,
      frequency: 1,
    };

    const { width, pointSize, amplitude, frequency } = params;

    // gpgpu
    const gpgpu = new kokomi.GPUComputer(this, {
      width,
    });

    // pos DataTexture
    const posDt = gpgpu.createTexture();

    const geo = new THREE.SphereGeometry(1, 128, 128);
    const posBuffer = geo.attributes.position.array;
    const vertCount = posBuffer.length / 3;

    const posDtData = posDt.image.data;
    kokomi.iterateBuffer(
      posDtData,
      posDtData.length,
      (arr, axis) => {
        const rand = Math.floor(Math.random() * vertCount);
        arr[axis.x] = posBuffer[rand * 3];
        arr[axis.y] = posBuffer[rand * 3 + 1];
        arr[axis.z] = posBuffer[rand * 3 + 2];
        arr[axis.w] = 1;
      },
      4
    );

    // pos Variable
    const posVar = gpgpu.createVariable(
      "texturePosition",
      computeShader,
      posDt,
      {
        uAmplitude: {
          value: amplitude,
        },
        uFrequency: {
          value: frequency,
        },
      }
    );

    // init gpgpu
    gpgpu.init();

    // geometry
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(width * width * 3);
    const reference = new Float32Array(width * width * 2);
    for (let i = 0; i < width * width; i++) {
      const x = Math.random();
      const y = Math.random();
      const z = Math.random();
      positions.set([x, y, z], i * 3);
      const xx = (i % width) / width;
      const yy = Math.floor(i / width) / width;
      reference.set([xx, yy], i * 2);
    }
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("reference", new THREE.BufferAttribute(reference, 2));

    // custom points
    const cp = new kokomi.CustomPoints(this, {
      baseMaterial: new THREE.ShaderMaterial(),
      geometry,
      vertexShader,
      fragmentShader,
      materialParams: {
        side: THREE.DoubleSide,
      },
      uniforms: {
        uPositionTexture: {
          value: null,
        },
        uPointSize: {
          value: pointSize,
        },
      },
    });
    cp.addExisting();

    this.update(() => {
      const mat = cp.points.material;
      mat.uniforms.uPositionTexture.value = gpgpu.getVariableRt(posVar);
    });
  }
}
