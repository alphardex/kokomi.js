uniform float iTime;
uniform vec2 iResolution;
uniform vec2 iMouse;

varying vec2 vUv;

uniform vec3 uColor1;
uniform vec3 uColor2;
uniform vec3 uColor3;
uniform float uGradInner;
uniform float uGradMaskTop;
uniform float uGradMaskBottom;

varying float vRandColor;
varying float vRandAlpha;

float circle(vec2 st,float r){
    vec2 dist=st-vec2(.5);
    return 1.-smoothstep(r-(r*1.15),r,dot(dist,dist)*4.);
}

void main(){
    // rand particle color
    vec3 color=uColor1;
    if(vRandColor>0.&&vRandColor<.33){
        color=uColor2;
    }else if(vRandColor>.33&&vRandColor<.66){
        color=uColor3;
    }
    color*=vRandAlpha;
    
    // circle alpha
    float alpha=circle(gl_PointCoord,1.);
    
    // vertical grad mask
    float gradMask=smoothstep(uGradMaskTop,uGradMaskBottom,vUv.y);
    alpha*=gradMask;
    
    vec4 finalColor=vec4(color,1.)*alpha;
    gl_FragColor=finalColor;
}