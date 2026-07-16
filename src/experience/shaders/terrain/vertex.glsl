uniform sampler2D uHeightMap;
uniform float uHeightScale;
uniform vec2 uHeightMapSize;

varying float vHeight;
varying vec2 vUv;

void main() {

    vec3 pos = position;

    float h = smoothstep(
        0.2,
        0.8,
        texture2D(uHeightMap, uv).r
    );

    pos.z += h * uHeightScale;

    csm_Position = pos;

    vec2 texel = 1.0 / uHeightMapSize;

    float hL = smoothstep(
        0.2,
        0.8,
        texture2D(uHeightMap, uv - vec2(texel.x, 0.0)).r
    );

    float hR = smoothstep(
        0.2,
        0.8,
        texture2D(uHeightMap, uv + vec2(texel.x, 0.0)).r
    );

    float hD = smoothstep(
        0.2,
        0.8,
        texture2D(uHeightMap, uv - vec2(0.0, texel.y)).r
    );

    float hU = smoothstep(
        0.2,
        0.8,
        texture2D(uHeightMap, uv + vec2(0.0, texel.y)).r
    );

    vec3 tangent = normalize(vec3(1.0, 0.0, (hR - hL) * uHeightScale));
    vec3 bitangent = normalize(vec3(0.0, 1.0, (hU - hD) * uHeightScale));

    csm_Normal = normalize(cross(tangent, bitangent));

    vHeight = h;
    vUv = uv;
}