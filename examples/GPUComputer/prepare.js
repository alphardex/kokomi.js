const prepare = async () => {
  const computeText = await fetchText(`./compute.glsl?v=${Math.random()}`);
  const computeShader = computeText;
  window.computeShader = computeShader;
};
