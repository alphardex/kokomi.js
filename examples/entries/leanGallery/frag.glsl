uniform float iTime;
uniform vec2 iResolution;
uniform vec2 iMouse;

uniform sampler2D uTexture;

varying vec2 vUv;

uniform float uDistanceCenter;

vec3 blackAndWhite(vec3 color){
    return vec3((color.r+color.g+color.b)/5.);
}

void main(){
    vec2 p=vUv;
    
    vec4 tex=texture(uTexture,p);
    
    float alpha=clamp(uDistanceCenter,.4,1.);
    
    vec4 col=vec4(tex.rgb,alpha);
    
    vec4 bwCol=vec4(blackAndWhite(tex.rgb),alpha);
    
    vec4 finalCol=mix(col,bwCol,1.-uDistanceCenter);
    
    gl_FragColor=finalCol;
}