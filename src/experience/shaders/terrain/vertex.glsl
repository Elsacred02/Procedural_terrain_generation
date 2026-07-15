uniform sampler2D uHeightMap;
uniform float uHeightScale;

varying float vHeight;
varying vec2 vUv;

void main() {

    vec3 pos = position;

    float h = texture2D(uHeightMap, uv).r;

    vHeight = h;

    pos.z += smoothstep(0.2, 0.8, h) * uHeightScale;

    csm_Position = pos;

    vUv = uv;
}