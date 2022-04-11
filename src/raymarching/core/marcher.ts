import type { Base } from "../../base/base";
import { Component } from "../../components/component";

import { ScreenQuad } from "../../shapes";

import type { SDFMapFunction } from "../utils/mapFunction";

const defaultShaderSDFUtils = `
// all sdfs
float sdBox(vec3 p,vec3 b)
{
    vec3 q=abs(p)-b;
    return length(max(q,0.))+min(max(q.x,max(q.y,q.z)),0.);
}

float sdSphere(vec3 p,float s)
{
    return length(p)-s;
}

// infinite
float sdCylinder(vec3 p,vec3 c)
{
    return length(p.xz-c.xy)-c.z;
}

// vertical
float sdCylinder(vec3 p,vec2 h)
{
    vec2 d=abs(vec2(length(p.xz),p.y))-h;
    return min(max(d.x,d.y),0.)+length(max(d,0.));
}

// arbitrary orientation
float sdCylinder(vec3 p,vec3 a,vec3 b,float r)
{
    vec3 pa=p-a;
    vec3 ba=b-a;
    float baba=dot(ba,ba);
    float paba=dot(pa,ba);
    
    float x=length(pa*baba-ba*paba)-r*baba;
    float y=abs(paba-baba*.5)-baba*.5;
    float x2=x*x;
    float y2=y*y*baba;
    float d=(max(x,y)<0.)?-min(x2,y2):(((x>0.)?x2:0.)+((y>0.)?y2:0.));
    return sign(d)*sqrt(abs(d))/baba;
}

float sdHexPrism(vec3 p,vec2 h)
{
    const vec3 k=vec3(-.8660254,.5,.57735);
    p=abs(p);
    p.xy-=2.*min(dot(k.xy,p.xy),0.)*k.xy;
    vec2 d=vec2(
        length(p.xy-vec2(clamp(p.x,-k.z*h.x,k.z*h.x),h.x))*sign(p.y-h.x),
    p.z-h.y);
    return min(max(d.x,d.y),0.)+length(max(d,0.));
}

float sdOctogonPrism(in vec3 p,in float r,float h)
{
    const vec3 k=vec3(-.9238795325,// sqrt(2+sqrt(2))/2
    .3826834323,// sqrt(2-sqrt(2))/2
.4142135623);// sqrt(2)-1
// reflections
p=abs(p);
p.xy-=2.*min(dot(vec2(k.x,k.y),p.xy),0.)*vec2(k.x,k.y);
p.xy-=2.*min(dot(vec2(-k.x,k.y),p.xy),0.)*vec2(-k.x,k.y);
// polygon side
p.xy-=vec2(clamp(p.x,-k.z*r,k.z*r),r);
vec2 d=vec2(length(p.xy)*sign(p.y),p.z-h);
return min(max(d.x,d.y),0.)+length(max(d,0.));
}

float sdTriPrism(vec3 p,vec2 h)
{
    vec3 q=abs(p);
    return max(q.z-h.y,max(q.x*.866025+p.y*.5,-p.y)-h.x*.5);
}

float sdCapsule(vec3 p,vec3 a,vec3 b,float r)
{
    vec3 pa=p-a,ba=b-a;
    float h=clamp(dot(pa,ba)/dot(ba,ba),0.,1.);
    return length(pa-ba*h)-r;
}

// sdf ops
float opRound(in float d,in float h)
{
    return d-h;
}

float opUnion(float d1,float d2)
{
    return min(d1,d2);
}

vec2 opUnion(vec2 d1,vec2 d2)
{
    return(d1.x<d2.x)?d1:d2;
}

float opIntersection(float d1,float d2)
{
    return max(d1,d2);
}

float opSubtraction(float d1,float d2)
{
    return max(-d1,d2);
}

float opSmoothUnion(float d1,float d2,float k)
{
    float h=max(k-abs(d1-d2),0.);
    return min(d1,d2)-h*h*.25/k;
}

float opSmoothIntersection(float d1,float d2,float k)
{
    float h=max(k-abs(d1-d2),0.);
    return max(d1,d2)+h*h*.25/k;
}

float opSmoothSubtraction(float d1,float d2,float k)
{
    float h=max(k-abs(-d1-d2),0.);
    return max(-d1,d2)+h*h*.25/k;
}

float opRepLim(in float p,in float s,in float lima,in float limb)
{
    return p-s*clamp(round(p/s),lima,limb);
}

vec2 opSymX(in vec2 p)
{
    p.x=abs(p.x);
    return p;
}

vec3 opSymX(in vec3 p)
{
    p.x=abs(p.x);
    return p;
}

vec2 opSymY(in vec2 p)
{
    p.y=abs(p.y);
    return p;
}

vec3 opSymY(in vec3 p)
{
    p.y=abs(p.y);
    return p;
}

vec3 opSymZ(in vec3 p)
{
    p.z=abs(p.z);
    return p;
}

// ray
vec2 normalizeScreenCoords(vec2 screenCoord,vec2 resolution)
{
    vec2 result=2.*(screenCoord/resolution.xy-.5);
    result.x*=resolution.x/resolution.y;// Correct for aspect ratio
    return result;
}

mat3 setCamera(in vec3 ro,in vec3 ta,float cr)
{
    vec3 cw=normalize(ta-ro);
    vec3 cp=vec3(sin(cr),cos(cr),0.);
    vec3 cu=normalize(cross(cw,cp));
    vec3 cv=(cross(cu,cw));
    return mat3(cu,cv,cw);
}

vec3 getRayDirection(vec2 p,vec3 ro,vec3 ta,float fl){
    mat3 ca=setCamera(ro,ta,0.);
    vec3 rd=ca*normalize(vec3(p,fl));
    return rd;
}

// lighting
// https://learnopengl.com/Lighting/Basic-Lighting

float saturate_1(float a){
    return clamp(a,0.,1.);
}

// https://learnopengl.com/Lighting/Basic-Lighting

float saturate_2(float a){
    return clamp(a,0.,1.);
}

float diffuse(vec3 n,vec3 l){
    float diff=saturate_2(dot(n,l));
    return diff;
}

// https://learnopengl.com/Lighting/Basic-Lighting

float saturate_0(float a){
    return clamp(a,0.,1.);
}

float specular(vec3 n,vec3 l,float shininess){
    float spec=pow(saturate_0(dot(n,l)),shininess);
    return spec;
}

// https://www.shadertoy.com/view/4scSW4
float fresnel(float bias,float scale,float power,vec3 I,vec3 N)
{
    return bias+scale*pow(1.+dot(I,N),power);
}

// rotate
mat2 rotation2d(float angle){
    float s=sin(angle);
    float c=cos(angle);
    
    return mat2(
        c,-s,
        s,c
    );
}

mat4 rotation3d(vec3 axis,float angle){
    axis=normalize(axis);
    float s=sin(angle);
    float c=cos(angle);
    float oc=1.-c;
    
    return mat4(
        oc*axis.x*axis.x+c,oc*axis.x*axis.y-axis.z*s,oc*axis.z*axis.x+axis.y*s,0.,
        oc*axis.x*axis.y+axis.z*s,oc*axis.y*axis.y+c,oc*axis.y*axis.z-axis.x*s,0.,
        oc*axis.z*axis.x-axis.y*s,oc*axis.y*axis.z+axis.x*s,oc*axis.z*axis.z+c,0.,
        0.,0.,0.,1.
    );
}

vec2 rotate(vec2 v,float angle){
    return rotation2d(angle)*v;
}

vec3 rotate(vec3 v,vec3 axis,float angle){
    return(rotation3d(axis,angle)*vec4(v,1.)).xyz;
}

// gamma
const float gamma=2.2;

float toGamma(float v){
    return pow(v,1./gamma);
}

vec2 toGamma(vec2 v){
    return pow(v,vec2(1./gamma));
}

vec3 toGamma(vec3 v){
    return pow(v,vec3(1./gamma));
}

vec4 toGamma(vec4 v){
    return vec4(toGamma(v.rgb),v.a);
}
`;

const defaultShaderMapFunction = `
vec2 map(in vec3 pos)
{
    vec2 res=vec2(1e10,0.);
    
    return res;
}
`;

const defaultShaderRaycast = `
vec2 raycast(in vec3 ro,in vec3 rd){
    vec2 res=vec2(-1.,-1.);
    float t=0.;
    for(int i=0;i<64;i++)
    {
        vec3 p=ro+t*rd;
        vec2 h=map(p);
        if(abs(h.x)<(.001*t))
        {
            res=vec2(t,h.y);
            break;
        };
        t+=h.x;
    }
    return res;
}
`;

const defaultShaderNormal = `
vec3 calcNormal(vec3 pos,float eps){
    const vec3 v1=vec3(1.,-1.,-1.);
    const vec3 v2=vec3(-1.,-1.,1.);
    const vec3 v3=vec3(-1.,1.,-1.);
    const vec3 v4=vec3(1.,1.,1.);
    
    return normalize(v1*map(pos+v1*eps).x+
    v2*map(pos+v2*eps).x+
    v3*map(pos+v3*eps).x+
    v4*map(pos+v4*eps).x);
}

vec3 calcNormal(vec3 pos){
    return calcNormal(pos,.002);
}

float softshadow(in vec3 ro,in vec3 rd,in float mint,in float tmax)
{
    float res=1.;
    float t=mint;
    for(int i=0;i<16;i++)
    {
        float h=map(ro+rd*t).x;
        res=min(res,8.*h/t);
        t+=clamp(h,.02,.10);
        if(h<.001||t>tmax)break;
    }
    return clamp(res,0.,1.);
}
`;

const defaultShaderMaterial = `
vec3 material(in vec3 col,in vec3 pos,in float m,in vec3 nor){
    // common material
    col=.2+.2*sin(m*2.+vec3(0.,1.,2.));
    
    // material
    if(m==26.9){
        col=vec3(153.,204.,255.)/255.;
    }
    
    return col;
}
`;

const defaultShaderLighting = `
vec3 lighting(in vec3 col,in vec3 pos,in vec3 rd,in vec3 nor){
    vec3 lin=col;
    
    // sun
    {
        vec3 lig=normalize(vec3(1.,1.,1.));
        float dif=diffuse(nor,lig);
        float spe=specular(nor,lig,3.);
        lin+=col*dif*spe;
    }
    
    // sky
    {
        lin*=col*.7;
    }
    
    return lin;
}
`;

const defaultShaderRender = `
vec3 render(in vec3 ro,in vec3 rd){
    // skybox
    vec3 col=vec3(10.,10.,10.)/255.;
    
    // raymarching
    vec2 res=raycast(ro,rd);
    float t=res.x;
    float m=res.y;
    
    if(m>-.5){
        // position
        vec3 pos=ro+t*rd;
        // normal
        vec3 nor=(m<1.5)?vec3(0.,1.,0.):calcNormal(pos);
        
        // material
        col=material(col,pos,m,nor);
        
        // lighting
        col=lighting(col,pos,rd,nor);
    }
    
    return col;
}
`;

const defaultShaderGetSceneColor = `
vec3 getSceneColor(vec2 fragCoord){
    vec2 p=normalizeScreenCoords(fragCoord,iResolution.xy);
    
    vec3 ro=vec3(0.,4.,8.);
    vec3 ta=vec3(0.,0.,0.);
    const float fl=2.5;
    vec3 rd=getRayDirection(p,ro,ta,fl);
    
    // render
    vec3 col=render(ro,rd);
    
    // gamma
    col=toGamma(col);
    
    return col;
}
`;

const defaultShaderMainImage = `
void mainImage(out vec4 fragColor,in vec2 fragCoord){
    vec3 tot=vec3(0.);
    
    float AA_size=1.;
    float count=0.;
    for(float aaY=0.;aaY<AA_size;aaY++)
    {
        for(float aaX=0.;aaX<AA_size;aaX++)
        {
            tot+=getSceneColor(fragCoord+vec2(aaX,aaY)/AA_size);
            count+=1.;
        }
    }
    tot/=count;
    
    fragColor=vec4(tot,1.);
}
`;

export interface MarcherConfig {
  debug: boolean;
}

class Marcher extends Component {
  screenQuad: ScreenQuad | null;
  mapFunction: SDFMapFunction | null;
  constructor(base: Base, config: Partial<MarcherConfig> = {}) {
    super(base);

    const { debug = false } = config;

    if (debug) {
      console.log(this.fragmentShader);
    }

    this.screenQuad = null;

    this.mapFunction = null;
  }
  get shaderSDFUtils() {
    return defaultShaderSDFUtils;
  }
  get shaderMapFunction() {
    return this.mapFunction?.shader || defaultShaderMapFunction;
  }
  get shaderRaycast() {
    return defaultShaderRaycast;
  }
  get shaderNormal() {
    return defaultShaderNormal;
  }
  get shaderMaterial() {
    return defaultShaderMaterial;
  }
  get shaderLighting() {
    return defaultShaderLighting;
  }
  get shaderRender() {
    return defaultShaderRender;
  }
  get shaderGetSceneColor() {
    return defaultShaderGetSceneColor;
  }
  get shaderMainImage() {
    return defaultShaderMainImage;
  }
  get fragmentShader() {
    return `
    ${this.shaderSDFUtils}

    ${this.shaderMapFunction}

    ${this.shaderRaycast}

    ${this.shaderNormal}

    ${this.shaderMaterial}

    ${this.shaderLighting}

    ${this.shaderRender}

    ${this.shaderGetSceneColor}

    ${this.shaderMainImage}
      `;
  }
  setMapFunction(mapFunction: SDFMapFunction) {
    this.mapFunction = mapFunction;
  }
  render(): void {
    if (this.screenQuad) {
      this.base.scene.remove(this.screenQuad.mesh);
    }
    const screenQuad = new ScreenQuad(this.base, {
      shadertoyMode: true,
      fragmentShader: this.fragmentShader,
      uniforms: {},
    });
    screenQuad.addExisting();
    this.screenQuad = screenQuad;
  }
}

export { Marcher };
