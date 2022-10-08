void mainImage(out vec4 fragColor,in vec2 fragCoord){
    vec2 p=fragCoord/iResolution.xy;
    
    vec3 col=vec3(p,0.);
    
    fragColor=vec4(col,1.);
}
