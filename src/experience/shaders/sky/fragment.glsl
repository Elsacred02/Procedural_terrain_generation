uniform vec3 topColor;
uniform vec3 bottomColor;

varying vec3 vWorldPosition;

void main() {
    float h = normalize(vWorldPosition).y;

    float mixFactor = smoothstep(-1.5, 0.7, h);

    gl_FragColor = vec4(mix(bottomColor, topColor, mixFactor), 1.0);
}