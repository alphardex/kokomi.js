uniform float iTime;
uniform vec2 iResolution;
uniform vec2 iMouse;

varying vec2 vUv;

uniform float uMove;
uniform vec3 uHover;
uniform float uIsHover;
uniform float uProgress;
uniform float uArea;

varying vec3 vPosition;

highp float random(vec2 co)
{
    highp float a=12.9898;
    highp float b=78.233;
    highp float c=43758.5453;
    highp float dt=dot(co.xy,vec2(a,b));
    highp float sn=mod(dt,3.14);
    return fract(sin(sn)*c);
}

float randFloat(vec2 co,float minVal,float maxVal)
{
    return random(co)*(maxVal-minVal)+minVal;
}

vec3 distort(vec3 p){
    float offset=randFloat(uv,-1000.,1000.);
    float speed=randFloat(uv,.4,1.);
    float move=abs(uMove);
    p.x+=sin(move*speed)*30.;
    p.y+=sin(move*speed)*30.;
    p.z=mod(p.z+speed*move*200.+offset,2000.)-1000.;
    return p;
}

vec3 distort2(vec3 p){
    float dist=distance(p.xy,uHover.xy);
    float dir=random(uv)>.5?1.:-1.;
    float press=randFloat(uv,.4,1.);
    float area=1.-smoothstep(0.,uArea,dist);
    
    p.x+=50.*sin(iTime*press)*dir*area*uIsHover;
    p.y+=50.*sin(iTime*press)*dir*area*uIsHover;
    p.z+=200.*cos(iTime*press)*dir*area*uIsHover;
    return p;
}

void main(){
    vec3 p=position;
    
    vec3 dp=distort(p);
    
    vec3 dp2=distort2(p);
    
    p=mix(dp2,dp,uProgress);
    
    gl_Position=projectionMatrix*modelViewMatrix*vec4(p,1.);
    
    vec4 mvPosition=modelViewMatrix*vec4(p,1.);
    float pSize=3000./-mvPosition.z;
    gl_PointSize=pSize;
    
    vUv=uv;
    vPosition=p;
}