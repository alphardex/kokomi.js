uniform float iTime;
uniform vec2 iResolution;
uniform vec2 iMouse;

uniform sampler2D uTexture;

varying vec2 vUv;

uniform float uProgress;

float saturate(float a){
    return clamp(a,0.,1.);
}

void main(){
    vec2 p=vUv;
    vec4 tex=texture(uTexture,p);
    vec3 color=tex.rgb;
    float alpha=saturate(uProgress*5.);
    gl_FragColor=vec4(color,alpha);
}