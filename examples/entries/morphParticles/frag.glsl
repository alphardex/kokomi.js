uniform float iTime;
uniform vec2 iResolution;
uniform vec2 iMouse;

varying vec2 vUv;

uniform vec3 uColor;

float spot(vec2 st,float r,float expo){
    return pow(r/distance(st,vec2(.5)),expo);
}

void main(){
    vec2 p=vec2(gl_PointCoord.x,1.-gl_PointCoord.y);
    p=p*2.-1.;
    
    float shape=spot(p,.2,2.5);
    
    vec3 col=vec3(uColor);
    
    csm_DiffuseColor=vec4(col,shape);
}