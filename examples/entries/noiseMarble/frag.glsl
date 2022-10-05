uniform float iTime;
uniform vec2 iResolution;
uniform vec2 iMouse;

varying vec2 vUv;

varying vec3 vPosition;
varying vec3 vDirection;

uniform sampler2D uHeightMap;
uniform vec3 uColor1;
uniform vec3 uColor2;
uniform float uDepth;
uniform float uSmooth;
uniform float uTime;
uniform float uSpeed;
uniform sampler2D uDisplacementMap;
uniform float uStrength;
uniform float uSlice;

float rayMarch(vec3 eye,vec3 ray){
    float iter=64.;
    float ratio=1./iter;
    vec3 p=eye;
    float depth=0.;
    
    for(float i=0.;i<iter;i++){
        p+=ray*ratio*uDepth;
        vec2 uv=equirectUv(normalize(p));
        
        // displacement point
        vec2 xOffset=vec2(iTime*uSpeed,0.);
        vec3 displacement1=texture(uDisplacementMap,uv+xOffset).rgb;
        vec2 flipY=vec2(1.,-1.);
        vec3 displacement2=texture(uDisplacementMap,uv*flipY-xOffset).rgb;
        displacement1-=.5;
        displacement2-=.5;
        vec3 displacement=displacement1+displacement2;
        vec3 displaced=p+displacement*uStrength;
        uv=equirectUv(normalize(displaced));
        
        float h=texture(uHeightMap,uv).r;
        float cutoff=1.-i*ratio;
        float slice=smoothstep(cutoff,cutoff+uSmooth,h);
        float dist=slice*ratio*uSlice;
        depth+=dist;
    }
    
    return depth;
}

void main(){
    vec2 p=vUv;
    
    vec3 ro=vPosition;
    vec3 rd=normalize(vDirection);
    float depth=rayMarch(ro,rd);
    vec3 col=mix(uColor1,uColor2,depth);
    
    csm_DiffuseColor=vec4(col,1.);
}