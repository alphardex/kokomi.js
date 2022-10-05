#define GLSLIFY 1
float circle(vec2 st,float r){
    vec2 dist=st-vec2(.5);
    return 1.-smoothstep(r-(r*1.15),r,dot(dist,dist)*4.);
}

uniform vec3 iColor1;
uniform vec3 iColor2;

varying float vRandColor;

void main(){
    vec2 p=gl_PointCoord-.5+.5;
    
    vec3 color=iColor1;
    if(vRandColor>0.&&vRandColor<.5){
        color=iColor2;
    }
    
    float shape=circle(p,1.);
    
    vec3 col=color*shape;
    
    csm_DiffuseColor=vec4(col,1.);
}
