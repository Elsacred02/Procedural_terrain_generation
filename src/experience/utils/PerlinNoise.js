class SimpleVector2 {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

const permutation = [ 
    151, 160, 137,  91,  90,  15, 131,  13, 201,  95,  96,  53, 194, 233,   7, 225,
    140,  36, 103,  30,  69, 142,   8,  99,  37, 240,  21,  10,  23, 190,   6, 148,
    247, 120, 234,  75,   0,  26, 197,  62,  94, 252, 219, 203, 117,  35,  11,  32,
    57, 177,  33,  88, 237, 149,  56,  87, 174,  20, 125, 136, 171, 168,  68, 175,
    74, 165,  71, 134, 139,  48,  27, 166,  77, 146, 158, 231,  83, 111, 229, 122,
    60, 211, 133, 230, 220, 105,  92,  41,  55,  46, 245,  40, 244, 102, 143,  54,
    65,  25,  63, 161,   1, 216,  80,  73, 209,  76, 132, 187, 208,  89,  18, 169,
    200, 196, 135, 130, 116, 188, 159,  86, 164, 100, 109, 198, 173, 186,   3,  64,
    52, 217, 226, 250, 124, 123,   5, 202,  38, 147, 118, 126, 255,  82,  85, 212,
    207, 206,  59, 227,  47,  16,  58,  17, 182, 189,  28,  42, 223, 183, 170, 213,
    119, 248, 152,   2,  44, 154, 163,  70, 221, 153, 101, 155, 167,  43, 172,   9,
    129,  22,  39, 253,  19,  98, 108, 110,  79, 113, 224, 232, 178, 185, 112, 104,
    218, 246,  97, 228, 251,  34, 242, 193, 238, 210, 144,  12, 191, 179, 162, 241,
    81,  51, 145, 235, 249,  14, 239, 107,  49, 192, 214,  31, 181, 199, 106, 157,
    184,  84, 204, 176, 115, 121,  50,  45, 127,   4, 150, 254, 138, 236, 205,  93,
    222, 114,  67,  29,  24,  72, 243, 141, 128, 195,  78,  66, 215,  61, 156, 180 ]

const SQRT2_INV = 1 / Math.sqrt(2);

const gradients = [
    new SimpleVector2(1, 0),
    new SimpleVector2(-1, 0),
    new SimpleVector2(0,  1),
    new SimpleVector2(0, -1),
    new SimpleVector2(SQRT2_INV, SQRT2_INV),
    new SimpleVector2(-SQRT2_INV, SQRT2_INV),
    new SimpleVector2( SQRT2_INV, -SQRT2_INV),
    new SimpleVector2(-SQRT2_INV, -SQRT2_INV)
];

export default class PerlinNoise{

    constructor() {

    }

    getGradient(gridVector) {
        const gridX = gridVector.x
        const gridY = gridVector.y
        const index = permutation[
            (permutation[gridX & 255] + gridY) & 255
        ]

        return gradients[index % gradients.length]
    }

    fade(t) {
        return t * t * t * (t * (t * 6 - 15) + 10);
    }

    lerp(a, b, t) {
        return a + t * (b - a);
    }

    dinstance(vectorA, vectorB) {
        return new SimpleVector2(
            vectorA.x - vectorB.x, 
            vectorA.y - vectorB.y
        )
    }

    dotProduct(vectorA, vectorB) {
        return vectorA.x * vectorB.x + vectorA.y * vectorB.y
    }

    computeNoise(x, y) {

        const point = new SimpleVector2(x, y)
        const relativePoint = new SimpleVector2(
            this.fade(point.x - Math.floor(point.x)), 
            this.fade(point.y - Math.floor(point.y))
        )

        const corner00 = new SimpleVector2(Math.floor(x), Math.floor(y))
        const corner01 = new SimpleVector2(Math.floor(x), Math.floor(y) + 1)
        const corner10 = new SimpleVector2(Math.floor(x) + 1, Math.floor(y))
        const corner11 = new SimpleVector2(Math.floor(x) + 1, Math.floor(y) + 1)

        const gradient00 = this.getGradient(corner00)
        const gradient01 = this.getGradient(corner01)
        const gradient10 = this.getGradient(corner10)
        const gradient11 = this.getGradient(corner11)

        const dinstance00 = this.dinstance(point, corner00)
        const dinstance01 = this.dinstance(point, corner01)
        const dinstance10 = this.dinstance(point, corner10)
        const dinstance11 = this.dinstance(point, corner11)

        const product00 = this.dotProduct(gradient00, dinstance00)
        const product01 = this.dotProduct(gradient01, dinstance01)
        const product10 = this.dotProduct(gradient10, dinstance10)
        const product11 = this.dotProduct(gradient11, dinstance11)

        const a = this.lerp(product00, product10, relativePoint.x)
        const b = this.lerp(product01, product11, relativePoint.x)
        return this.lerp(a, b, relativePoint.y)
    }

    computeNoiseWithOctaves(x, y, octaves) {

        let noise = 0
        let amplitude = 1
        let frequency = 1

        for (let i = 0; i < octaves; i++) {
            noise += this.computeNoise(x * frequency, y * frequency) * amplitude
            frequency *= 2
            amplitude *= 0.5
        }

        return noise
    }
}