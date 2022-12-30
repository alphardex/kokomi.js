uniform float iTime;
uniform vec2 iResolution;
uniform vec2 iMouse;

varying vec2 vUv;

uniform sampler2D uTexture;

varying vec3 vNormal;

// lighting
float saturate(float a){
    return clamp(a,0.,1.);
}

float diffuse(vec3 n,vec3 l){
    float diff=saturate(dot(n,l));
    return diff;
}

vec4 lighting(vec4 col,vec3 nor){
    vec3 lightPos=vec3(-1.,2.,1.);
    float diff=diffuse(nor,normalize(lightPos));
    col+=(diff-.4);
    return col;
}

void main(){
    vec2 p=vUv;
    
    vec4 tex=texture(uTexture,p);
    
    vec4 col=tex;
    // col=vec4(p,0.,1.);
    
    col=lighting(col,vNormal);
    
    csm_DiffuseColor=col;
}