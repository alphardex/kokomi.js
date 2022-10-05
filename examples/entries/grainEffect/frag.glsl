// #pragma glslify:snoise2=require(glsl-noise/simplex/2d)
//
// Description : Array and textureless GLSL 2D simplex noise function.
//      Author : Ian McEwan, Ashima Arts.
//  Maintainer : ijm
//     Lastmod : 20110822 (ijm)
//     License : Copyright (C) 2011 Ashima Arts. All rights reserved.
//               Distributed under the MIT License. See LICENSE file.
//               https://github.com/ashima/webgl-noise
//

vec3 mod289(vec3 x){
  return x-floor(x*(1./289.))*289.;
}

vec2 mod289(vec2 x){
  return x-floor(x*(1./289.))*289.;
}

vec3 permute(vec3 x){
  return mod289(((x*34.)+1.)*x);
}

float snoise2(vec2 v)
{
  const vec4 C=vec4(.211324865405187,// (3.0-sqrt(3.0))/6.0
  .366025403784439,// 0.5*(sqrt(3.0)-1.0)
  -.577350269189626,// -1.0 + 2.0 * C.x
.024390243902439);// 1.0 / 41.0
// First corner
vec2 i=floor(v+dot(v,C.yy));
vec2 x0=v-i+dot(i,C.xx);

// Other corners
vec2 i1;
//i1.x = step( x0.y, x0.x ); // x0.x > x0.y ? 1.0 : 0.0
//i1.y = 1.0 - i1.x;
i1=(x0.x>x0.y)?vec2(1.,0.):vec2(0.,1.);
// x0 = x0 - 0.0 + 0.0 * C.xx ;
// x1 = x0 - i1 + 1.0 * C.xx ;
// x2 = x0 - 1.0 + 2.0 * C.xx ;
vec4 x12=x0.xyxy+C.xxzz;
x12.xy-=i1;

// Permutations
i=mod289(i);// Avoid truncation effects in permutation
vec3 p=permute(permute(i.y+vec3(0.,i1.y,1.))
+i.x+vec3(0.,i1.x,1.));

vec3 m=max(.5-vec3(dot(x0,x0),dot(x12.xy,x12.xy),dot(x12.zw,x12.zw)),0.);
m=m*m;
m=m*m;

// Gradients: 41 points uniformly over a line, mapped onto a diamond.
// The ring size 17*17 = 289 is close to a multiple of 41 (41*7 = 287)

vec3 x=2.*fract(p*C.www)-1.;
vec3 h=abs(x)-.5;
vec3 ox=floor(x+.5);
vec3 a0=x-ox;

// Normalise gradients implicitly by scaling m
// Approximation of: m *= inversesqrt( a0*a0 + h*h );
m*=1.79284291400159-.85373472095314*(a0*a0+h*h);

// Compute final noise value at P
vec3 g;
g.x=a0.x*x0.x+h.x*x0.y;
g.yz=a0.yz*x12.xz+h.yz*x12.yw;
return 130.*dot(m,g);
}

uniform vec3 uColor;

uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;

#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <uv2_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
/* include <cube_uv_reflection_fragment> why is this in lambert and phong? */
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>

void main(){

	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( diffuse, opacity );
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	// accumulation
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	// modulation
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <output_fragment>
	#include <tonemapping_fragment>
	#include <encodings_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>

  vec2 uv=gl_FragCoord.xy;

  float noiseScale=.8;
  float noise=snoise2(uv/noiseScale)*.5+.5;
  noise*=pow(outgoingLight.r,3.5);

  vec3 col=vec3(0.);
  col.r=max(noise,uColor.r);
  col.g=max(noise,uColor.g);
  col.b=max(noise,uColor.b);
  float alpha=1.;

  // vec3 col=vec3(noise);
  // float alpha=1.-noise;

  gl_FragColor=vec4(col,alpha);
}