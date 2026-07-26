import Experience from '../../../Experience'
import AssetsConfiguration from './AssetsConfiguration'
import * as THREE from 'three'

export default class BoardVillage{
    constructor(boardPlane, villageMap, heightMap, boardAssetResolution) {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.boardPlane = boardPlane
        this.heightMap = heightMap
        this.villageMap = villageMap
        this.boardAssetResolution = boardAssetResolution
        this.assetConfig = AssetsConfiguration
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

                if(this.villageMap.data[index] > 0 && this.villageMap.data[index] != 255) {
                    const ax = (x + startX)
                    const ay = (y + startY)

                    const hx = ax * this.boardAssetResolution
                    const hy = ay * this.boardAssetResolution

                    const worldX = -this.boardPlane.width / 2 +
                        ax * (this.boardPlane.width / (this.heightMap.width / this.boardAssetResolution)) + 
                        Math.random() * 0.4

                    const worldZ = this.boardPlane.height / 2 -
                        ay * (this.boardPlane.height / (this.heightMap.height / this.boardAssetResolution)) + 
                        Math.random() * 0.4

                    const worldY = this.heightMap.interpolateHeight(hx, hy)
                    
                    const selectedAsset = this.assetConfig.find(
                        asset => asset.id === this.villageMap.data[index]
                    )
                    if (selectedAsset) {
                        this.assets[selectedAsset.name].spawn(
                            worldX,
                            worldY + selectedAsset.positionOffset,
                            worldZ, 

                            0, selectedAsset.rotation, 0
                        )
                    }
                }
            }
        }
    }

    destroy() {

        const objectsToRemove = []

        this.scene.traverse((child) => {

            if (child.userData.boardVillage) {
                objectsToRemove.push(child)
            }

        })


        for (const object of objectsToRemove) {

            object.removeFromParent()

            object.traverse((child) => {

                if (child.isMesh) {

                    child.geometry.dispose()

                    if (Array.isArray(child.material)) {
                        child.material.forEach(material => material.dispose())
                    } else {
                        child.material.dispose()
                    }

                }

            })
        }
    }
}