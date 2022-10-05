uniform float iTime;

uniform sampler2D tDiffuse;

varying vec2 vUv;

const float PI=3.14159265359;

// https://github.com/jamieowen/glsl-blend/blob/master/screen.glsl
float blendScreen(float base,float blend){
    return 1.-((1.-base)*(1.-blend));
}

vec4 blendScreen(vec4 base,vec4 blend){
    return 1.-((1.-base)*(1.-blend));
}

highp float random(vec2 co)
{
    highp float a=12.9898;
    highp float b=78.233;
    highp float c=43758.5453;
    highp float dt=dot(co.xy,vec2(a,b));
    highp float sn=mod(dt,3.14);
    return fract(sin(sn)*c);
}

void main(){
    vec2 p=vUv;
    
    vec4 tex=texture(tDiffuse,p);
    
    vec2 dirCenter=vec2(.5)-p;
    
    float count=40.;
    
    float strength=.5;
    
    vec4 col=vec4(0.);
    
    float totalWeight=0.;
    for(float i=0.;i<count;i++){
        float noise=random(gl_FragCoord.xy);
        
        float ratio=(i+noise)/count;
        
        vec4 layer=texture(tDiffuse,p+dirCenter*ratio*strength);
        
        float weight=sin(ratio*PI);
        
        col+=layer*weight;
        totalWeight+=weight;
    }
    col.rgb/=totalWeight;
    // col.rgb*=clamp(abs(sin(iTime*PI*.25)*2.),.75,2.);
    
    vec4 finalCol=blendScreen(col,tex);
    
    gl_FragColor=finalCol;
}