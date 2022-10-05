uniform float iTime;
uniform vec2 iResolution;
uniform vec2 iMouse;

uniform sampler2D uTexture;

varying vec2 vUv;

uniform sampler2D uTexture1;
uniform sampler2D uTexture2;
uniform float uMove;

varying vec3 vPosition;

float saturate(float a){
    return clamp(a,0.,1.);
}

void main(){
    vec2 p=vUv;
    
    vec4 tex1=texture(uTexture1,p);
    vec4 tex2=texture(uTexture2,p);
    
    // vec4 col=tex;
    vec4 col=mix(tex1,tex2,smoothstep(0.,1.,fract(uMove)));
    
    float alpha=1.-saturate(abs(vPosition.z/440.));
    col.a*=alpha;
    
    gl_FragColor=col;
    // gl_FragColor=vec4(vPosition,1.);
    // gl_FragColor=vec4(alpha);
}