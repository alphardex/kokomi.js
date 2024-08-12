import * as THREE from "three";

import { mergeVertices, MeshSurfaceSampler, GLTFExporter } from "three-stdlib";

import { makeBuffer } from "./gl";

// 开启sRGB颜色空间
const enableSRGBColorSpace = (renderer: THREE.WebGLRenderer) => {
  if (renderer.outputColorSpace) {
    renderer.outputColorSpace = THREE.SRGBColorSpace;
  } else {
    // @ts-ignore
    renderer.outputEncoding = THREE.sRGBEncoding;
  }
};

// 优化模型渲染
const optimizeModelRender = (renderer: THREE.WebGLRenderer) => {
  enableSRGBColorSpace(renderer);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
};

// 开启真实渲染
const enableRealisticRender = (renderer: THREE.WebGLRenderer) => {
  enableSRGBColorSpace(renderer);
  renderer.toneMapping = THREE.ReinhardToneMapping;
  renderer.toneMappingExposure = 3;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  // @ts-ignore
  if (renderer.physicallyCorrectLights) {
    // @ts-ignore
    renderer.physicallyCorrectLights = true;
  }
};

// 美化渲染
const beautifyRender = (renderer: THREE.WebGLRenderer) => {
  optimizeModelRender(renderer);
};

// 开启阴影
const enableShadow = (renderer: THREE.WebGLRenderer) => {
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
};

// 从hdr贴图中提取envmap
const getEnvmapFromHDRTexture = (
  renderer: THREE.WebGLRenderer,
  texture: THREE.Texture
) => {
  const pmremGenerator = new THREE.PMREMGenerator(renderer);
  pmremGenerator.compileEquirectangularShader();
  const envmap = pmremGenerator.fromEquirectangular(texture).texture;
  pmremGenerator.dispose();
  return envmap;
};

// 从场景中提取envmap
const getEnvmapFromScene = (
  renderer: THREE.WebGLRenderer,
  scene: THREE.Scene
) => {
  const pmremGenerator = new THREE.PMREMGenerator(renderer);
  const envmap = pmremGenerator.fromScene(scene).texture;
  return envmap;
};

// 获取重心坐标系
const getBaryCoord = (bufferGeometry: THREE.BufferGeometry) => {
  // https://gist.github.com/mattdesl/e399418558b2b52b58f5edeafea3c16c
  const length = bufferGeometry.attributes.position.array.length;
  const count = length / 3;
  const bary = [];
  for (let i = 0; i < count; i++) {
    bary.push(0, 0, 1, 0, 1, 0, 1, 0, 0);
  }
  const aCenter = new Float32Array(bary);
  bufferGeometry.setAttribute("aCenter", new THREE.BufferAttribute(aCenter, 3));
};

// 从mesh上取样微粒位置信息
const sampleParticlesPositionFromMesh = (
  geometry: THREE.BufferGeometry,
  count = 10000
) => {
  const material = new THREE.MeshBasicMaterial();
  const mesh = new THREE.Mesh(geometry, material);
  const sampler = new MeshSurfaceSampler(mesh).build();
  const particlesPosition = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const position = new THREE.Vector3();
    sampler.sample(position);
    particlesPosition.set([position.x, position.y, position.z], i * 3);
  }
  return particlesPosition;
};

// 遍历模型，使其扁平化
const flatModel = (model: THREE.Object3D): THREE.Object3D[] => {
  const modelPartsArray: THREE.Object3D[] = [];
  model.traverse((obj) => {
    modelPartsArray.push(obj);
  });
  return modelPartsArray;
};

// 打印扁平模型的所有部分
const printModel = (modelParts: THREE.Object3D[], modelName = "modelParts") => {
  const strArray = modelParts.map((obj, i) => {
    const row = `const ${obj.name} = ${modelName}[${i}];`;
    return row;
  });
  const str = strArray.join("\n");
  console.log(str);
  return str;
};

// 获取viewport
const getViewport = (camera: THREE.Camera) => {
  const position = new THREE.Vector3();
  const target = new THREE.Vector3();
  const distance = camera.getWorldPosition(position).distanceTo(target);
  const fov = ((camera as any).fov * Math.PI) / 180; // convert vertical fov to radians
  const h = 2 * Math.tan(fov / 2) * distance; // visible height
  const w = h * (window.innerWidth / window.innerHeight);
  const viewport = { width: w, height: h };
  return viewport;
};

// 获取position中每个三角形的中心
const getPositionCentroids = (
  geometry: THREE.BufferGeometry,
  attrName = "position",
  centroidName = "aCenter"
) => {
  const position = geometry.attributes[attrName];
  const posCount = position.count;
  const posBuffer = position.array;

  const centroidBuffer = makeBuffer(posCount, (val: number) => val);

  for (let i = 0; i < posCount; i += 3) {
    // three vertices of triangle
    let x = posBuffer[i * 3];
    let y = posBuffer[i * 3 + 1];
    let z = posBuffer[i * 3 + 2];

    let x1 = posBuffer[i * 3 + 3];
    let y1 = posBuffer[i * 3 + 4];
    let z1 = posBuffer[i * 3 + 5];

    let x2 = posBuffer[i * 3 + 6];
    let y2 = posBuffer[i * 3 + 7];
    let z2 = posBuffer[i * 3 + 8];

    const centroid = new THREE.Vector3()
      .add(new THREE.Vector3(x, y, z))
      .add(new THREE.Vector3(x1, y1, z1))
      .add(new THREE.Vector3(x2, y2, z2))
      .divideScalar(3);

    centroidBuffer.set([centroid.x, centroid.y, centroid.z], i * 3);
    centroidBuffer.set([centroid.x, centroid.y, centroid.z], (i + 1) * 3);
    centroidBuffer.set([centroid.x, centroid.y, centroid.z], (i + 2) * 3);
  }

  geometry.setAttribute(
    centroidName,
    new THREE.BufferAttribute(centroidBuffer, 3)
  );

  return centroidBuffer;
};

export interface CreatePolygonShapeConfig {
  scale: number;
}

// 创建多边形形状
const createPolygonShape = (
  points: THREE.Vector2[],
  config: Partial<CreatePolygonShapeConfig> = {}
) => {
  const shape = new THREE.Shape();

  const { scale = 1 } = config;

  const firstPoint = points[0];
  for (let i = 0; i < points.length; i++) {
    const point = points[i];
    const x = (point.x - firstPoint.x) * scale;
    const y = (point.y - firstPoint.y) * -1 * scale;
    if (i === 0) {
      shape.moveTo(x, y);
    } else {
      shape.lineTo(x, y);
    }
  }
  return shape;
};

// 计算透视相机全屏大小
const calcPerspectiveScreenSize = (
  targetZ = 0,
  camera: THREE.PerspectiveCamera,
  aspect: number
) => {
  let screenWidth = 1;
  let screenHeight = 1;
  const fovRadian = THREE.MathUtils.degToRad(camera.fov / 2);
  screenHeight = (camera.position.z - targetZ) * Math.tan(fovRadian) * 2;
  screenWidth = screenHeight * aspect;
  return { width: screenWidth, height: screenHeight };
};

// 下载文件
const downloadBlob = (blob: Blob, name: string) => {
  const a = document.createElement("a");
  document.body.appendChild(a);
  a.style.display = "none";
  const url = window.URL.createObjectURL(blob);
  a.href = url;
  a.download = name;
  a.click();
};

// 获取边界
const getBound = (object: THREE.Object3D, precise = true) => {
  const box3 = new THREE.Box3().setFromObject(object, precise);

  const center = new THREE.Vector3();
  const sphere = new THREE.Sphere();
  box3.getCenter(center);
  box3.getBoundingSphere(sphere);

  const width = box3.max.x - box3.min.x;
  const height = box3.max.y - box3.min.y;
  const depth = box3.max.z - box3.min.z;

  return {
    boundingBox: box3,
    center,
    boundingSphere: sphere,
    width,
    height,
    depth,
  };
};

// 获取边界顶点
const getBoundsVertices = (bounds: THREE.Box3) => {
  let boundsVertices = [];
  boundsVertices.push(
    new THREE.Vector3(bounds.min.x, bounds.min.y, bounds.min.z)
  );
  boundsVertices.push(
    new THREE.Vector3(bounds.min.x, bounds.min.y, bounds.max.z)
  );
  boundsVertices.push(
    new THREE.Vector3(bounds.min.x, bounds.max.y, bounds.min.z)
  );
  boundsVertices.push(
    new THREE.Vector3(bounds.min.x, bounds.max.y, bounds.max.z)
  );
  boundsVertices.push(
    new THREE.Vector3(bounds.max.x, bounds.min.y, bounds.min.z)
  );
  boundsVertices.push(
    new THREE.Vector3(bounds.max.x, bounds.min.y, bounds.max.z)
  );
  boundsVertices.push(
    new THREE.Vector3(bounds.max.x, bounds.max.y, bounds.min.z)
  );
  boundsVertices.push(
    new THREE.Vector3(bounds.max.x, bounds.max.y, bounds.max.z)
  );
  return boundsVertices;
};

// 平滑法线
const smoothNormal = (mesh: THREE.Mesh) => {
  mesh.geometry = mergeVertices(mesh.geometry);
  mesh.geometry.computeVertexNormals();
};

// 修复ShapeGeometry的UV
// https://discourse.threejs.org/t/how-to-use-uvs-in-shapebuffergeometry/20711/4
const fixShapeGeometryUV = (mesh: THREE.Mesh) => {
  const box = new THREE.Box3().setFromObject(mesh);
  const size = new THREE.Vector3();
  box.getSize(size);
  const vec3 = new THREE.Vector3();
  const attPos = mesh.geometry.attributes.position;
  const attUv = mesh.geometry.attributes.uv;
  for (let i = 0; i < attPos.count; i++) {
    vec3.fromBufferAttribute(attPos, i);
    attUv.setXY(
      i,
      (vec3.x - box.min.x) / size.x,
      (vec3.y - box.min.y) / size.y
    );
  }
};

const saveString = (text: string, filename: string) => {
  downloadBlob(new Blob([text], { type: "text/plain" }), filename);
};

const saveArrayBuffer = (buffer: ArrayBuffer, filename: string) => {
  downloadBlob(
    new Blob([buffer], { type: "application/octet-stream" }),
    filename
  );
};

// ref: https://github.com/mrdoob/three.js/blob/master/examples/misc_exporter_gltf.html
const exportGLTF = (
  input: THREE.Object3D | THREE.Object3D[],
  {
    filename = "scene",
    trs = false,
    onlyVisible = true,
    binary = false,
    maxTextureSize = 4096,
  } = {}
) => {
  const gltfExporter = new GLTFExporter();

  gltfExporter.parse(
    input,
    (result) => {
      if (result instanceof ArrayBuffer) {
        saveArrayBuffer(result, `${filename}.glb`);
      } else {
        const output = JSON.stringify(result, null, 2);
        console.log(output);
        saveString(output, `${filename}.gltf`);
      }
    },
    (error) => {
      console.log("An error happened during parsing", error);
    },
    {
      trs,
      onlyVisible,
      binary,
      maxTextureSize,
    }
  );
};

// 延迟
const sleep = (time: number) =>
  new Promise((resolve) => setTimeout(resolve, time));

// 打乱数组
const shuffle = ([...arr]) => {
  let m = arr.length;
  while (m) {
    const i = Math.floor(Math.random() * m--);
    [arr[m], arr[i]] = [arr[i], arr[m]];
  }
  return arr;
};

export {
  enableSRGBColorSpace,
  optimizeModelRender,
  enableRealisticRender,
  beautifyRender,
  enableShadow,
  getEnvmapFromHDRTexture,
  getEnvmapFromScene,
  getBaryCoord,
  sampleParticlesPositionFromMesh,
  flatModel,
  printModel,
  getViewport,
  getPositionCentroids,
  createPolygonShape,
  calcPerspectiveScreenSize,
  downloadBlob,
  getBound,
  getBoundsVertices,
  smoothNormal,
  fixShapeGeometryUV,
  saveString,
  saveArrayBuffer,
  exportGLTF,
  sleep,
  shuffle,
};
