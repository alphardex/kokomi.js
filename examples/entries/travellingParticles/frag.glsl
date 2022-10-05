uniform float iTime;
uniform vec2 iResolution;
uniform vec2 iMouse;

varying vec2 vUv;

varying float vOpacity;

uniform vec3 uColor;

void main(){
    vec2 uv=vec2(gl_PointCoord.x,1.-gl_PointCoord.y);
    
    vec2 cUv=2.*uv-1.;
    
    vec4 color=vec4(1./length(cUv));
    color*=vOpacity;
    color.rgb*=uColor;
    
    gl_FragColor=color;
}