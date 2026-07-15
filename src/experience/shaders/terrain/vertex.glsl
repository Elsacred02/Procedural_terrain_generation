uniform sampler2D heightMap;
uniform float heightScale;

varying vec2 vUv;

void main() {

    vUv = uv;

    vec3 transformed = position;

    // leggi altezza dalla texture
    float height = texture2D(heightMap, uv).r;

    // sposta il vertice
    transformed.y += height * heightScale;


    // codice standard Three.js
    vec4 mvPosition = modelViewMatrix * vec4(transformed, 1.0);

    gl_Position = projectionMatrix * mvPosition;
}