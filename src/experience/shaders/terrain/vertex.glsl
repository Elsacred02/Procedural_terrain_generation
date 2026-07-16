uniform sampler2D uHeightMap;
uniform float uHeightScale;
uniform vec2 uHeightMapSize;
uniform vec2 uTerrainSize;

varying float vHeight;
varying vec2 vUv;

void main() {

    vec3 pos = position;

    float h = smoothstep(
        0.2,
        0.9,
        texture2D(uHeightMap, uv).r
    );

    pos.z += pow(h, 3.0) * uHeightScale;

    csm_Position = pos;

    vec2 texel = 1.0 / uHeightMapSize;

    float hL = smoothstep(
        0.2,
        0.9,
        texture2D(uHeightMap, uv - vec2(texel.x, 0.0)).r
    );

    float hR = smoothstep(
        0.2,
        0.9,
        texture2D(uHeightMap, uv + vec2(texel.x, 0.0)).r
    );

    float hD = smoothstep(
        0.2,
        0.9,
        texture2D(uHeightMap, uv - vec2(0.0, texel.y)).r
    );

    float hU = smoothstep(
        0.2,
        0.9,
        texture2D(uHeightMap, uv + vec2(0.0, texel.y)).r
    );

    vec3 tangent = normalize(vec3(uTerrainSize.x, 0.0, (hR - hL) * uHeightScale));
    vec3 bitangent = normalize(vec3(0.0, uTerrainSize.y, (hU - hD) * uHeightScale));

    csm_Normal = normalize(cross(tangent, bitangent));

    vHeight = pow(h, 3.0);
    vUv = uv;
}