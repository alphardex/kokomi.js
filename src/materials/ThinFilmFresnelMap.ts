import * as THREE from "three";

/**
 * Credit: https://github.com/DerSchmale/threejs-thin-film-iridescence
 *
 * Demo: https://kokomi-playground.vercel.app/#liquidCrystal
 *
 * @classdesc
 * ThinFilmFresnelMap is a lookup texture containing the reflection colour. The texture index value
 * is dot(normal, view). The texture values are stored in approximated gamma space (power 2.0), so
 * the sampled value needs to be multiplied with itself before use. The sampled value should replace
 * the fresnel factor in a PBR material.
 *
 * @property filmThickness The thickness of the thin film layer in nanometers. Defaults to 380.
 * @property refractiveIndexFilm The refractive index of the thin film. Defaults to 2.
 * @property refractiveIndexBase The refractive index of the material under the film. Defaults to 3.
 *
 * @constructor
 * @param filmThickness The thickness of the thin film layer in nanometers. Defaults to 380.
 * @param refractiveIndexFilm The refractive index of the thin film. Defaults to 2.
 * @param refractiveIndexBase The refractive index of the material under the film. Defaults to 3.
 * @param size The width of the texture. Defaults to 64.
 *
 * @extends DataTexture
 *
 * @author David Lenaerts <http://www.derschmale.com>
 */
class ThinFilmFresnelMap extends THREE.DataTexture {
  _filmThickness: number;
  _refractiveIndexFilm: number;
  _refractiveIndexBase: number;
  _size: number;
  _data: Uint8Array;
  constructor(
    filmThickness = 380.0,
    refractiveIndexFilm = 2,
    refractiveIndexBase = 3,
    size = 64
  ) {
    const data = new Uint8Array(size * 4);
    super(
      data,
      size,
      1,
      THREE.RGBAFormat,
      THREE.UnsignedByteType,
      THREE.UVMapping,
      THREE.RepeatWrapping,
      THREE.RepeatWrapping,
      THREE.LinearFilter,
      THREE.LinearMipMapLinearFilter
    );

    this._filmThickness = filmThickness;
    this._refractiveIndexFilm = refractiveIndexFilm;
    this._refractiveIndexBase = refractiveIndexBase;
    this._size = size;
    this._data = data;

    this._updateData();

    this.generateMipmaps = true;
    this.needsUpdate = true;
  }

  get filmThickness() {
    return this._filmThickness;
  }
  set filmThickness(value) {
    this._filmThickness = value;
    this.updateSettings(
      this._filmThickness,
      this._refractiveIndexFilm,
      this._refractiveIndexBase
    );
  }

  get refractiveIndexFilm() {
    return this._refractiveIndexFilm;
  }
  set refractiveIndexFilm(value) {
    this._refractiveIndexFilm = value;
    this.updateSettings(
      this._filmThickness,
      this._refractiveIndexFilm,
      this._refractiveIndexBase
    );
  }

  get refractiveIndexBase() {
    return this._refractiveIndexBase;
  }
  set refractiveIndexBase(value) {
    this._refractiveIndexBase = value;
    this.updateSettings(
      this._filmThickness,
      this._refractiveIndexFilm,
      this._refractiveIndexBase
    );
  }

  /**
   * Regenerates the lookup texture given new data.
   * @param filmThickness The thickness of the thin film layer in nanometers. Defaults to 380.
   * @param refractiveIndexFilm The refractive index of the thin film. Defaults to 2.
   * @param refractiveIndexBase The refractive index of the material under the film. Defaults to 3.
   */
  updateSettings(
    filmThickness: number,
    refractiveIndexFilm: number,
    refractiveIndexBase: number
  ) {
    this._filmThickness = filmThickness || 380;
    this._refractiveIndexFilm = refractiveIndexFilm || 2;
    this._refractiveIndexBase = refractiveIndexBase || 3;
    this._updateData();
  }

  /**
   * @private
   */
  _fresnelRefl(
    refractiveIndex1: number,
    refractiveIndex2: number,
    cos1: number,
    cos2: number,
    R: THREE.Vector2,
    phi: THREE.Vector2
  ) {
    // r is amplitudinal, R is power
    var sin1Sqr = 1.0 - cos1 * cos1; // = sin^2(incident)
    var refrRatio = refractiveIndex1 / refractiveIndex2;

    if (refrRatio * refrRatio * sin1Sqr > 1.0) {
      // total internal reflection
      R.x = 1.0;
      R.y = 1.0;

      var sqrRefrRatio = refrRatio * refrRatio;
      // it looks like glsl's atan ranges are different from those in JS?
      phi.x =
        2.0 *
        Math.atan(
          (-sqrRefrRatio * Math.sqrt(sin1Sqr - 1.0 / sqrRefrRatio)) / cos1
        );
      phi.y = 2.0 * Math.atan(-Math.sqrt(sin1Sqr - 1.0 / sqrRefrRatio) / cos1);
    } else {
      var r_p =
        (refractiveIndex2 * cos1 - refractiveIndex1 * cos2) /
        (refractiveIndex2 * cos1 + refractiveIndex1 * cos2);
      var r_s =
        (refractiveIndex1 * cos1 - refractiveIndex2 * cos2) /
        (refractiveIndex1 * cos1 + refractiveIndex2 * cos2);

      phi.x = r_p < 0.0 ? Math.PI : 0.0;
      phi.y = r_s < 0.0 ? Math.PI : 0.0;

      R.x = r_p * r_p;
      R.y = r_s * r_s;
    }
  }

  /**
   * @private
   */
  _updateData() {
    var filmThickness = this._filmThickness;
    var refractiveIndexFilm = this._refractiveIndexFilm;
    var refractiveIndexBase = this._refractiveIndexBase;
    var size = this._size;

    // approximate CIE XYZ weighting functions from: http://jcgt.org/published/0002/02/01/paper.pdf
    function xFit_1931(lambda: number) {
      var t1 = (lambda - 442.0) * (lambda < 442.0 ? 0.0624 : 0.0374);
      var t2 = (lambda - 599.8) * (lambda < 599.8 ? 0.0264 : 0.0323);
      var t3 = (lambda - 501.1) * (lambda < 501.1 ? 0.049 : 0.0382);
      return (
        0.362 * Math.exp(-0.5 * t1 * t1) +
        1.056 * Math.exp(-0.5 * t2 * t2) -
        0.065 * Math.exp(-0.5 * t3 * t3)
      );
    }

    function yFit_1931(lambda: number) {
      var t1 = (lambda - 568.8) * (lambda < 568.8 ? 0.0213 : 0.0247);
      var t2 = (lambda - 530.9) * (lambda < 530.9 ? 0.0613 : 0.0322);
      return (
        0.821 * Math.exp(-0.5 * t1 * t1) + 0.286 * Math.exp(-0.5 * t2 * t2)
      );
    }

    function zFit_1931(lambda: number) {
      var t1 = (lambda - 437.0) * (lambda < 437.0 ? 0.0845 : 0.0278);
      var t2 = (lambda - 459.0) * (lambda < 459.0 ? 0.0385 : 0.0725);
      return (
        1.217 * Math.exp(-0.5 * t1 * t1) + 0.681 * Math.exp(-0.5 * t2 * t2)
      );
    }

    var data = this._data;
    var phi12 = new THREE.Vector2();
    var phi21 = new THREE.Vector2();
    var phi23 = new THREE.Vector2();
    var R12 = new THREE.Vector2();
    var T12 = new THREE.Vector2();
    var R23 = new THREE.Vector2();
    var R_bi = new THREE.Vector2();
    var T_tot = new THREE.Vector2();
    var R_star = new THREE.Vector2();
    var R_bi_sqr = new THREE.Vector2();
    var R_12_star = new THREE.Vector2();
    var R_star_t_tot = new THREE.Vector2();

    var refrRatioSqr = 1.0 / (refractiveIndexFilm * refractiveIndexFilm);
    var refrRatioSqrBase =
      (refractiveIndexFilm * refractiveIndexFilm) /
      (refractiveIndexBase * refractiveIndexBase);

    // RGB is too limiting, so we use the entire spectral domain, but using limited samples (64) to
    // create more pleasing bands
    var numBands = 64;
    var waveLenRange = 780 - 380; // the entire visible range

    for (var i = 0; i < size; ++i) {
      var cosThetaI = i / size;
      var cosThetaT = Math.sqrt(
        1 - refrRatioSqr * (1.0 - cosThetaI * cosThetaI)
      );
      var cosThetaT2 = Math.sqrt(
        1 - refrRatioSqrBase * (1.0 - cosThetaT * cosThetaT)
      );

      // this is essentially the extra distance traveled by a ray if it bounds through the film
      var pathDiff = 2.0 * refractiveIndexFilm * filmThickness * cosThetaT;
      var pathDiff2PI = 2.0 * Math.PI * pathDiff;

      this._fresnelRefl(
        1.0,
        refractiveIndexFilm,
        cosThetaI,
        cosThetaT,
        R12,
        phi12
      );
      T12.x = 1.0 - R12.x;
      T12.y = 1.0 - R12.y;
      phi21.x = Math.PI - phi12.x;
      phi21.y = Math.PI - phi12.y;

      // this concerns the base layer
      this._fresnelRefl(
        refractiveIndexFilm,
        refractiveIndexBase,
        cosThetaT,
        cosThetaT2,
        R23,
        phi23
      );
      R_bi.x = Math.sqrt(R23.x * R12.x);
      R_bi.y = Math.sqrt(R23.y * R12.y);
      T_tot.x = Math.sqrt(T12.x * T12.x);
      T_tot.y = Math.sqrt(T12.y * T12.y);
      R_star.x = (T12.x * T12.x * R23.x) / (1.0 - R23.x * R12.x);
      R_star.y = (T12.y * T12.y * R23.y) / (1.0 - R23.y * R12.y);
      R_bi_sqr.x = R_bi.x * R_bi.x;
      R_bi_sqr.y = R_bi.y * R_bi.y;
      R_12_star.x = R12.x + R_star.x;
      R_12_star.y = R12.y + R_star.y;
      R_star_t_tot.x = R_star.x - T_tot.x;
      R_star_t_tot.y = R_star.y - T_tot.y;
      var x = 0,
        y = 0,
        z = 0;
      var totX = 0,
        totY = 0,
        totZ = 0;

      // TODO: we could also put the thickness in the look-up table, make it a 2D table
      for (var j = 0; j < numBands; ++j) {
        var waveLen = 380 + (j / (numBands - 1)) * waveLenRange;
        var deltaPhase = pathDiff2PI / waveLen;

        var cosPhiX = Math.cos(deltaPhase + phi23.x + phi21.x);
        var cosPhiY = Math.cos(deltaPhase + phi23.y + phi21.y);
        var valX =
          R_12_star.x +
          ((2.0 * (R_bi.x * cosPhiX - R_bi_sqr.x)) /
            (1.0 - 2 * R_bi.x * cosPhiX + R_bi_sqr.x)) *
            R_star_t_tot.x;
        var valY =
          R_12_star.y +
          ((2.0 * (R_bi.y * cosPhiY - R_bi_sqr.y)) /
            (1.0 - 2 * R_bi.y * cosPhiY + R_bi_sqr.y)) *
            R_star_t_tot.y;
        var v = 0.5 * (valX + valY);

        var wx = xFit_1931(waveLen);
        var wy = yFit_1931(waveLen);
        var wz = zFit_1931(waveLen);

        totX += wx;
        totY += wy;
        totZ += wz;

        x += wx * v;
        y += wy * v;
        z += wz * v;
      }

      x /= totX;
      y /= totY;
      z /= totZ;

      var r = 3.2406 * x - 1.5372 * y - 0.4986 * z;
      var g = -0.9689 * x + 1.8758 * y + 0.0415 * z;
      var b = 0.0557 * x - 0.204 * y + 1.057 * z;

      r = THREE.MathUtils.clamp(r, 0.0, 1.0);
      g = THREE.MathUtils.clamp(g, 0.0, 1.0);
      b = THREE.MathUtils.clamp(b, 0.0, 1.0);

      // linear to gamma
      r = Math.sqrt(r);
      g = Math.sqrt(g);
      b = Math.sqrt(b);

      // CIE XYZ to linear rgb conversion matrix:
      // 3.2406 -1.5372 -0.4986
      // -0.9689  1.8758  0.0415
      // 0.0557 -0.2040  1.0570

      var k = i << 2;
      data[k] = Math.floor(r * 0xff);
      data[k + 1] = Math.floor(g * 0xff);
      data[k + 2] = Math.floor(b * 0xff);
      data[k + 3] = 0xff;
    }

    this.needsUpdate = true;
  }
}

export { ThinFilmFresnelMap };
