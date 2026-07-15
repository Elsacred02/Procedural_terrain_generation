varying float vHeight;

void main() {

    vec3 grass = vec3(0.18, 0.65, 0.12); // verde acceso
    vec3 dirt  = vec3(0.45, 0.25, 0.08); // marrone caldo
    vec3 snow  = vec3(1.0, 1.0, 1.0);    // bianco

    vec3 color;

    // Base verde
    color = grass;

    // Passaggio verde -> marrone
    float dirtBlend = smoothstep(0.42, 0.48, vHeight);
    color = mix(color, dirt, dirtBlend);

    // Passaggio marrone -> bianco
    float snowBlend = smoothstep(0.65, 0.82, vHeight);
    color = mix(color, snow, snowBlend);

    csm_DiffuseColor = vec4(color, 1.0);
}