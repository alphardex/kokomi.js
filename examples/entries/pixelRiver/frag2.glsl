uniform float iTime;
uniform vec2 iResolution;

uniform sampler2D tDiffuse;

uniform float uProgress;
uniform float uWaveScale;
uniform float uDistA;
uniform float uDistB;

varying vec2 vUv;

void main(){
    vec2 p=2.*vUv-1.;
    
    p+=.11*cos((1.3*uWaveScale)*p.yx+1.3*iTime+vec2(.4,1.7));
    p+=.12*cos((2.5*uWaveScale)*p.yx+1.5*iTime+vec2(2.7,3.9));
    p+=.13*cos((2.4*uWaveScale)*p.yx+1.9*iTime+vec2(2.3,4.6));
    p+=uDistA*cos((uDistB*uWaveScale)*p.yx+1.4*iTime+vec2(5.8,4.2));
    
    float ring=length(p);
    
    float dUvX=mix(vUv.x,ring,uProgress);
    float dUvY=mix(vUv.y,0.,uProgress);
    vec2 distortedUv=vec2(dUvX,dUvY);
    
    vec4 color=texture(tDiffuse,distortedUv);
    gl_FragColor=color;
}