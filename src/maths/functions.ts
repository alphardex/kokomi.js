const mapNumberRange = (
  val: number,
  inMin: number,
  inMax: number,
  outMin: number,
  outMax: number
) => {
  return ((val - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
};

export { mapNumberRange };
