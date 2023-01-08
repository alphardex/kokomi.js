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
declare class ThinFilmFresnelMap extends THREE.DataTexture {
    _filmThickness: number;
    _refractiveIndexFilm: number;
    _refractiveIndexBase: number;
    _size: number;
    _data: Uint8Array;
    constructor(filmThickness?: number, refractiveIndexFilm?: number, refractiveIndexBase?: number, size?: number);
    get filmThickness(): number;
    set filmThickness(value: number);
    get refractiveIndexFilm(): number;
    set refractiveIndexFilm(value: number);
    get refractiveIndexBase(): number;
    set refractiveIndexBase(value: number);
    /**
     * Regenerates the lookup texture given new data.
     * @param filmThickness The thickness of the thin film layer in nanometers. Defaults to 380.
     * @param refractiveIndexFilm The refractive index of the thin film. Defaults to 2.
     * @param refractiveIndexBase The refractive index of the material under the film. Defaults to 3.
     */
    updateSettings(filmThickness: number, refractiveIndexFilm: number, refractiveIndexBase: number): void;
    /**
     * @private
     */
    _fresnelRefl(refractiveIndex1: number, refractiveIndex2: number, cos1: number, cos2: number, R: THREE.Vector2, phi: THREE.Vector2): void;
    /**
     * @private
     */
    _updateData(): void;
}
export { ThinFilmFresnelMap };
