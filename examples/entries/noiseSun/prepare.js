const prepare = async () => {
  const vertText2 = await fetchText(`./vert2.glsl?v=${Math.random()}`);
  const vertexShader2 = vertText2;
  window.vertexShader2 = vertexShader2;
  const fragText2 = await fetchText(`./frag2.glsl?v=${Math.random()}`);
  const fragmentShader2 = fragText2;
  window.fragmentShader2 = fragmentShader2;

  const vertText3 = await fetchText(`./vert3.glsl?v=${Math.random()}`);
  const vertexShader3 = vertText3;
  window.vertexShader3 = vertexShader3;
  const fragText3 = await fetchText(`./frag3.glsl?v=${Math.random()}`);
  const fragmentShader3 = fragText3;
  window.fragmentShader3 = fragmentShader3;
};
