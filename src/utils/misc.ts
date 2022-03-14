import * as THREE from "three";

// 开启真实渲染
const enableRealisticRender = (renderer: THREE.WebGLRenderer) => {
  renderer.physicallyCorrectLights = true;
  renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.toneMapping = THREE.ReinhardToneMapping;
  renderer.toneMappingExposure = 3;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
};

export { enableRealisticRender };
