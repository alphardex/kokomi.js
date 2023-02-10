import * as kokomi from "kokomi.js";
import * as THREE from "three";
import gsap from "gsap";
import * as dat from "lil";

class Sketch extends kokomi.Base {
  create() {
    // marcher
    const mar = new marcher.Marcher({
      antialias: false,
      showIsoline: false,
    });

    // material
    const mat = new marcher.SDFMaterial();
    mat.addIsolineMaterial(marcher.DEFAULT_MATERIAL_ID, 1, 1, 0);
    mar.setMaterial(mat);

    // define sdf map function
    const map = new marcher.SDFMapFunction();

    // layer start
    const layer = new marcher.SDFLayer();

    const box = new marcher.BoxSDF({
      sdfVarName: "d1",
    });
    layer.addPrimitive(box);
    box.round(0.1);

    map.addLayer(layer);
    // layer end

    // set sdf map function
    mar.setMapFunction(map);

    // orbit controls
    mar.enableOrbitControls();

    // render
    const rayMarchingQuad = new kokomi.RayMarchingQuad(this, mar);
    rayMarchingQuad.render();

    // frag shader
    console.log(mar.fragmentShader);
  }
}
