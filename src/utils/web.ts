// 根据点数获取路径上的所有点
const getPointsInPath = (path: SVGPathElement, pointNum = 4) => {
  const points = [];
  const pathLength = path.getTotalLength();
  const pointCount = Math.floor(pathLength / pointNum);
  for (let i = 0; i < pointCount; i++) {
    const distance = (pathLength * i) / pointCount;
    const point = path.getPointAtLength(distance);
    points.push(point);
  }
  return points;
};

export { getPointsInPath };
