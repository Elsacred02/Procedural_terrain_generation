import * as THREE from 'three'
import WFC from '../../../utils/WFC'

const defaultGeneration = [
    3, 3, 2, 3, 0,
    0, 0, 2, 0, 0,
    0, 3, 1, 2, 2,
    3, 0, 3, 0, 2,
    3, 0, 0, 0, 2
]

export default class villageMap {
    constructor(heightMap, villageSize, boardAssetResolution) {
        this.heightMap = heightMap
        this.villageSize = villageSize
        this.boardAssetResolution = boardAssetResolution
        this.data = new Uint8Array(
            this.villageSize * this.villageSize
        )

        this.position = this.findIndexForVillageSpawn()
        this.fillDataWithWFC()
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
                        const worldHeight = this.heightMap.interpolateHeight(hx, hy)
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

    fillDataRandom() {
        for (let i = 0; i < this.data.length; i++) {
            this.data[i] = Math.floor(Math.random() * 3);
        }
    }

    fillDataWithWFC() {
        this.wfc = new WFC(this.villageSize, defaultGeneration)
        this.data = this.wfc.data
    }
}