import * as THREE from 'three'

export default class villageMap {
    constructor(heightMap, villageSize, heightScale, heightPower, boardAssetResolution) {
        this.heightMap = heightMap
        this.villageSize = villageSize
        this.heightScale = heightScale
        this.heightPower = heightPower
        this.boardAssetResolution = boardAssetResolution
        this.data = new Uint8Array(
            this.villageSize * this.villageSize
        )

        this.position = this.findIndexForVillageSpawn()
        this.fillDataRandom()
    }

    findIndexForVillageSpawn() {

        const assetWidth = Math.floor(this.heightMap.width / this.boardAssetResolution)
        const assetHeight = Math.floor(this.heightMap.height / this.boardAssetResolution)

        let bestVariance = Infinity
        let bestX = 0
        let bestY = 0

        for (let ay = 0; ay <= assetHeight - this.villageSize; ay++) {
            for (let ax = 0; ax <= assetWidth - this.villageSize; ax++) {
                const heights = []
                for (let vy = 0; vy < this.villageSize; vy++) {
                    for (let vx = 0; vx < this.villageSize; vx++) {
                        const hx = (ax + vx) * this.boardAssetResolution
                        const hy = (ay + vy) * this.boardAssetResolution
                        const interpolated = this.interpolateHeight(hx, hy)
                        const worldHeight = this.getWorldHeight(interpolated)
                        heights.push(worldHeight)
                    }
                }

                let mean = 0
                for (const h of heights)
                    mean += h

                mean /= heights.length

                let variance = 0
                for (const h of heights) {
                    const d = h - mean
                    variance += d * d
                }

                variance /= heights.length

                if (variance < bestVariance) {
                    bestVariance = variance
                    bestX = ax
                    bestY = ay
                }
            }
        }

        return {
            x: bestX,
            y: bestY,
            variance: bestVariance
        };
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
        const h = THREE.MathUtils.smoothstep(value, 0.2, 0.9)
        return Math.pow(h, this.heightPower) * this.heightScale
    }

    fillDataRandom() {
        for (let i = 0; i < this.data.length; i++) {
            this.data[i] = Math.floor(Math.random() * 4); // 0, 1, 2, 3
        }
    }
}