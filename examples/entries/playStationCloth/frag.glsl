uniform float iTime;
uniform vec2 iResolution;
uniform vec2 iMouse;

varying vec2 vUv;

varying vec3 vPosition;

// https://community.khronos.org/t/getting-the-normal-with-dfdx-and-dfdy/70177
vec3 computeNormal(vec3 normal){
    vec3 X=dFdx(normal);
    vec3 Y=dFdy(normal);
    vec3 cNormal=normalize(cross(X,Y));
    return cNormal;
}

// https://www.shadertoy.com/view/4scSW4
float fresnel(float bias,float scale,float power,vec3 I,vec3 N)
{
    return bias+scale*pow(1.+dot(I,N),power);
}

void main(){
    vec2 p=vUv;
    
    // color
    vec3 col=vec3(1.);
    
    // alpha
    vec3 cNormal=computeNormal(vPosition);
    vec3 eyeVector=vec3(0.,0.,-1.);
    float F=fresnel(0.,.5,4.,eyeVector,cNormal);
    float alpha=F*.5;
    
    csm_DiffuseColor=vec4(col,alpha);
}