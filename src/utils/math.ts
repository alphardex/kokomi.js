import * as THREE from "three";

const saturate = (value: number) => THREE.MathUtils.clamp(value, 0, 1);

// https://stackoverflow.com/a/59293807
const polySort = (pointObjs: THREE.Vector2[]) => {
  const squaredPolar = (point: number[], centre: number[]) => {
    return [
      Math.atan2(point[1] - centre[1], point[0] - centre[0]),
      (point[0] - centre[0]) ** 2 + (point[1] - centre[1]) ** 2, // Square of distance
    ];
  };

  const points = pointObjs.map((item) => [item.x, item.y]);

  // Get "centre of mass"
  let centre = [
    points.reduce((sum, p) => sum + p[0], 0) / points.length,
    points.reduce((sum, p) => sum + p[1], 0) / points.length,
  ];

  // Sort by polar angle and distance, centered at this centre of mass.
  for (let point of points) point.push(...squaredPolar(point, centre));
  points.sort((a, b) => a[2] - b[2] || a[3] - b[3]);
  // Throw away the temporary polar coordinates
  for (let point of points) point.length -= 2;

  const pointsResult = points.map((item) => ({
    x: item[0],
    y: item[1],
  }));

  return pointsResult;
};

const sample = (arr: any[]) => arr[Math.floor(Math.random() * arr.length)];

const sampleSize = ([...arr], n = 1) => {
  let m = arr.length;
  while (m) {
    const i = Math.floor(Math.random() * m--);
    [arr[m], arr[i]] = [arr[i], arr[m]];
  }
  return arr.slice(0, n);
};

const range = function* (start: number, end: number, step = 1) {
  let i = start;
  while (i < end) {
    yield i;
    i += step;
  }
};

export { saturate, polySort, sample, sampleSize, range };
