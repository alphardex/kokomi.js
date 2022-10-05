#define GLSLIFY 1
vec3 blackAndWhite(vec3 color){
    return vec3((color.r+color.g+color.b)/5.);
}

vec4 RGBShift(sampler2D t,vec2 rUv,vec2 gUv,vec2 bUv,float isBlackWhite){
    vec4 color1=texture(t,rUv);
    vec4 color2=texture(t,gUv);
    vec4 color3=texture(t,bUv);
    if(isBlackWhite==1.){
        color1.rgb=blackAndWhite(color1.rgb);
        color2.rgb=blackAndWhite(color2.rgb);
        color3.rgb=blackAndWhite(color3.rgb);
    }
    vec4 color=vec4(color1.r,color2.g,color3.b,color2.a);
    return color;
}

uniform float iTime;
uniform vec2 iResolution;
uniform vec2 iMouse;

uniform sampler2D uTexture;

varying vec2 vUv;

uniform float uScrollDelta;
uniform float uRGBShift;

void main(){
    vec2 p=vUv;
    
    float sd=uScrollDelta;
    float rs=uRGBShift;
    
    vec2 rUv=p+vec2(.02)*sd*rs/1.;
    vec2 gUv=p+vec2(.02)*sd*rs/2.;
    vec2 bUv=p+vec2(.02)*sd*rs/4.;
    vec4 tex=RGBShift(uTexture,rUv,gUv,bUv,0.);
    
    vec4 col=tex;
    
    gl_FragColor=col;
}