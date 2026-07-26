import AssetsConfiguration from './AssetsConfiguration'
import * as THREE from 'three'

export default class BoardVillage{
    constructor(boardPlane, villageMap, heightMap, boardAssetResolution, heightPower, heightScale) {
        this.boardPlane = boardPlane
        this.heightMap = heightMap
        this.villageMap = villageMap
        this.boardAssetResolution = boardAssetResolution
        this.assetConfig = AssetsConfiguration
        this.heightPower = heightPower
        this.heightScale = heightScale
        this.villageSize = Math.sqrt(this.villageMap.data.length)

        this.setupAssets()
        this.setup()
    }

    setupAssets(){
        this.assets = {}
        this.assetConfig.forEach(config => {
            this.assets[config.name] = new config.class(
                config.id,
                this.boardPlane,
                config.scale,
                config.type
            )
        })
    }

    setup() {

        const startY = this.villageMap.position.y
        const startX = this.villageMap.position.x

        for(let y = 0; y < this.villageSize; y++) {
            for(let x = 0; x < this.villageSize; x++) {
                const index = y * this.villageSize + x

                if(this.villageMap.data[index] > 0) {
                    const ax = (x + startX)
                    const ay = (y + startY)

                    const hx = ax * this.boardAssetResolution
                    const hy = ax * this.boardAssetResolution

                    const worldX = -this.boardPlane.width / 2 +
                        ax * (this.boardPlane.width / (this.heightMap.width / this.boardAssetResolution)) + 
                        Math.random() * 0.4 - 0.2

                    const worldZ = this.boardPlane.height / 2 -
                        ay * (this.boardPlane.height / (this.heightMap.height / this.boardAssetResolution)) + 
                        Math.random() * 0.4 - 0.2

                    const hNormal = this.interpolateHeight(hx, hy)
                    const worldY = this.getWorldHeight(hNormal)
                    
                    const selectedAsset = this.assetConfig.find(
                        asset => asset.id === this.villageMap.data[index]
                    )
                    if (selectedAsset) {
                        this.assets[selectedAsset.name].spawn(
                            worldX,
                            worldY + selectedAsset.positionOffset,
                            worldZ, 

                            0, 0, 0
                        )
                    }
                }
            }
        }
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
}