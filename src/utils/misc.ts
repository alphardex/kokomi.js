import * as THREE from "three";

// 优化模型渲染
const optimizeModelRender = (renderer: THREE.WebGLRenderer) => {
  renderer.physicallyCorrectLights = true;
  renderer.outputEncoding = THREE.sRGBEncoding;
};

// 开启真实渲染
const enableRealisticRender = (renderer: THREE.WebGLRenderer) => {
  renderer.physicallyCorrectLights = true;
  renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.toneMapping = THREE.ReinhardToneMapping;
  renderer.toneMappingExposure = 3;
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

export { optimizeModelRender, enableRealisticRender, getEnvmapFromHDRTexture };
