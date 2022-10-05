uniform float iTime;
uniform vec2 iResolution;
uniform vec2 iMouse;

varying vec2 vUv;

uniform sampler2D uTexture;

vec2 matcap(vec3 eye,vec3 normal){
    vec3 reflected=reflect(eye,normal);
    float m=2.8284271247461903*sqrt(reflected.z+1.);
    return reflected.xy/m+.5;
}

void main(){
    vec2 p=vUv;
    
    float diff=dot(vec3(1.),vNormal);
    vec2 matcapUv=matcap(vec3(diff),vNormal);
    vec3 col=texture(uTexture,matcapUv).rgb;
    
    csm_DiffuseColor=vec4(col,1.);
}