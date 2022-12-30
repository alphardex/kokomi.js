struct waveData{
    float progress;
    vec2 center;
    float frequency;
    float amplitude;
    float speed;
};

uniform float iTime;
uniform vec2 iResolution;
uniform vec2 iMouse;

varying vec2 vUv;

uniform float uAspect;
uniform waveData[WAVE_AMOUNT] uWaves;

varying vec3 vNormal;

const float PI=3.1415926535;

float wave(vec3 p,waveData data){
    // wave
    vec2 p1=p.xy*vec2(uAspect,1.);
    float dist=distance(p1,data.center);
    float wave=sin(dist*PI*2.*data.frequency-iTime*data.speed)*data.amplitude;
    
    // decay
    float radius=.1+data.amplitude;
    float spread=1.+data.amplitude*2.;
    float decay=1.-smoothstep(data.progress*spread,data.progress*spread+radius,dist);
    float decayFromCenter=smoothstep(-.3+data.progress,data.progress*2.,dist);
    wave*=decay;
    wave*=decayFromCenter;
    wave*=smoothstep(0.,.5,1.-data.progress);
    
    // edge
    float edge=step(.001,data.progress);
    wave*=edge;
    
    return wave;
}

vec3 distort(vec3 p){
    vec3 result=p;
    
    for(int i=0;i<WAVE_AMOUNT;i++){
        float wave=wave(p,uWaves[i]);
        result.z+=normal.z*wave;
    }
    
    return result;
}

vec3 orthogonal(vec3 v){
    return normalize(abs(v.x)>abs(v.z)?vec3(-v.y,v.x,0.)
    :vec3(0.,-v.z,v.y));
}

// https://codepen.io/marco_fugaro/pen/xxZWPWJ?editors=0010
vec3 fixNormal(vec3 position,vec3 distortedPosition,vec3 normal){
    vec3 tangent=orthogonal(normal);
    vec3 bitangent=normalize(cross(normal,tangent));
    float offset=.1;
    vec3 neighbour1=position+tangent*offset;
    vec3 neighbour2=position+bitangent*offset;
    vec3 displacedNeighbour1=distort(neighbour1);
    vec3 displacedNeighbour2=distort(neighbour2);
    vec3 displacedTangent=displacedNeighbour1-distortedPosition;
    vec3 displacedBitangent=displacedNeighbour2-distortedPosition;
    vec3 displacedNormal=normalize(cross(displacedTangent,displacedBitangent));
    return displacedNormal;
}

void main(){
    vec3 p=position;
    
    vec3 dp=distort(p);
    
    csm_Position=dp;
    
    vUv=uv;
    vNormal=normalize(normalMatrix*fixNormal(p,dp,normal));
}