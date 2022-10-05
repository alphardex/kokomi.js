const float PI=3.14159265359;

uniform float iTime;
uniform vec2 iResolution;
uniform vec2 iMouse;

uniform sampler2D uDisplacement;

uniform sampler2D tDiffuse;

varying vec2 vUv;

vec2 distort(vec2 p,sampler2D tex){
    vec4 displacement=texture(tex,p);
    float theta=displacement.x*2.*PI;
    vec2 dir=vec2(sin(theta),cos(theta));
    vec2 dp=p+dir*displacement.x*.1;
    return dp;
}

void main(){
    vec2 p=vUv;
    vec2 dp=distort(p,uDisplacement);
    vec4 color=texture(tDiffuse,dp);
    gl_FragColor=color;
    // gl_FragColor=texture(uDisplacement,p);
}