import * as THREE from 'three'

export default class AssetMap {
    constructor(heightMap, assetResolution, heightScale, heightPower) {
        this.heightMap = heightMap
        this.width = heightMap.width / assetResolution
        this.height = heightMap.height / assetResolution
        this.heightScale = heightScale
        this.heightPower = heightPower
        this.data = new Float32Array(
            this.width * this.height
        )
        this.init()
    }

    init() {
        for(let i = 0; i < this.data.length; i++) {
            this.data[i] = 0
        }
    }

    randomAssetMap(numberOfAssets) {
        if(numberOfAssets > this.data.length) {
            throw new Error("Numero di asset superiore alle posizioni disponibili")
        }

        let placedAssets = 0

        while(placedAssets < numberOfAssets) {

            const index = Math.floor(Math.random() * this.data.length)

            if(this.data[index] === 0) {
                this.data[index] = 1
                placedAssets++
            }
        }
    }

    forestCluster(numberOfAssets, numberOfForests, treesPerForest) {
        this.poissonDiskSampling(numberOfForests)
    }

    poissonDiskSampling(numberOfForests) {

    }

    interpolateHeight(startX, startY) {
    
        let sum = 0;
    
        for (let y = 0; y < 2; y++) {
    
            for (let x = 0; x < 2; x++) {
    
                const hx = startX + x;
                const hy = startY + y;
    
                const index = hy * this.heightMap.width + hx;
    
                sum += this.heightMap.data[index];
            }
        }
    
        return sum / 4;
    }
    
    getWorldHeight(value) {
    
        const h = THREE.MathUtils.smoothstep(
            value,
            0.2,
            0.9
        )
    
        return Math.pow(h, this.heightPower) * this.heightScale
    }
}