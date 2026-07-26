import * as THREE from "three";
import PerlinNoise from "../utils/PerlinNoise";


export default class HeightMap {

    constructor(width, height, octaves, scale, perlinSeed, heightScale, heightPower) {

        this.width = width;
        this.height = height;
        this.octaves = octaves;
        this.scale = scale;
        this.perlinNoise = new PerlinNoise(perlinSeed);
        this.heightScale = heightScale
        this.heightPower = heightPower
        this.data = new Float32Array(
            width * height
        );
        this.fill();
    }


    fill() {

        let min = Infinity;
        let max = -Infinity;

        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                const h = this.perlinNoise.computeNoiseWithOctaves(
                        x * this.scale,
                        y * this.scale,
                        this.octaves
                    );


                this.data[y * this.width + x] = h;

                min = Math.min(min, h);
                max = Math.max(max, h);
            }
        }

        const range = max - min;

        for (let i = 0; i < this.data.length; i++) {
            this.data[i] =(this.data[i] - min) / range;
        }
    }


    buildTexture() {

        const heightTexture =
            new THREE.DataTexture(
                this.data,
                this.width,
                this.height,
                THREE.RedFormat,
                THREE.FloatType
            );

        heightTexture.needsUpdate = true;

        heightTexture.wrapS = THREE.ClampToEdgeWrapping;
        heightTexture.wrapT = THREE.ClampToEdgeWrapping;

        heightTexture.minFilter = THREE.NearestFilter;
        heightTexture.magFilter = THREE.NearestFilter;

        return heightTexture;
    }

    interpolateHeight(startX, startY) {
        let sum = 0;
        for (let y = 0; y < 2; y++) {
            for (let x = 0; x < 2; x++) {
                const hx = startX + x;
                const hy = startY + y;
                const index = hy * this.width + hx;
                sum += this.data[index];
            }
        }
        return this.getWorldHeight(sum / 4);
    }
            
    getWorldHeight(value) {
        const h = THREE.MathUtils.smoothstep(value, 0.2, 0.9)
        return Math.pow(h, this.heightPower) * this.heightScale
    }
}