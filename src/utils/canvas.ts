const getImageData2DArrayFromCanvas = (
  ctx: CanvasRenderingContext2D,
  image: CanvasImageSource,
  width = 0,
  height = 0
) => {
  const w = width || ctx.canvas.width;
  const h = height || ctx.canvas.height;
  ctx.drawImage(image, 0, 0, w, h);
  const data = ctx.getImageData(0, 0, w, h).data;
  const array = new Array(h).fill(0).map(() => new Array(w).fill(0));
  for (let j = 0; j < h; j++) {
    for (let i = 0; i < w; i++) {
      const idx = (i + j * w) * 4;
      const color = data[idx] / 255;
      array[j][i] = color;
    }
  }
  return array;
};

export { getImageData2DArrayFromCanvas };
