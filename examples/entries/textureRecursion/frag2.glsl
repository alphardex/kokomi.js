uniform float iTime;
uniform vec2 iResolution;
uniform vec2 iMouse;

varying vec2 vUv;

uniform sampler2D uTexture;

uniform float uScrollDelta;

vec2 distort(vec2 p,float speed){
    vec2 dp=p;
    float force=pow(length(p.x+.5),abs(speed));
    dp*=cos(1.-force);
    return dp;
}

void main(){
    vec2 p=vUv;
    float speed=clamp(abs(uScrollDelta),0.,.8);
    vec2 dp=distort(p,speed);
    vec4 col=texture(uTexture,dp+vec2(0.,-.03))*.8;
    gl_FragColor=col;
}