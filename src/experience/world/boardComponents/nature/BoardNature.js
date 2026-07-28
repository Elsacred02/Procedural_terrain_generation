import * as THREE from 'three'
import Experience from '../../../Experience'
import Tree from './Tree'
import Rock from './Rock'
import AssetsConfiguration from './AssetsConfiguration'

export default class BoardNature {
    constructor(boardPlane, assetMap, heightMap, assetResolution, numberOfAssets) {

        this.experience = new Experience()
        this.scene = this.experience.scene
        this.boardPlane = boardPlane
        this.assetMap = assetMap
        this.heightMap = heightMap
        this.resources = this.experience.resources
        this.heightScale = this.heightMap.heightScale
        this.heightPower = this.heightMap.heightPower
        this.assetResolution = assetResolution
        this.numberOfAssets = numberOfAssets
        this.assetConfig = AssetsConfiguration
        this.setupAssets()
        this.setup()
    }

    setupAssets(){
        this.assets = {}
        this.assetConfig.forEach(config => {
            config.assets.forEach(assetConfig => {
                if (!this.assets[assetConfig.name]) {
                    if (assetConfig.class === Tree) {
                        this.assets[assetConfig.name] = new assetConfig.class(
                            this.numberOfAssets,
                            this.boardPlane,
                            assetConfig.species,
                            assetConfig.scale
                        )
                    } else {
                        this.assets[assetConfig.name] = new assetConfig.class(
                            this.numberOfAssets,
                            this.boardPlane,
                            assetConfig.scale
                        )
                    }
                }
            })
        })
    }

    setup() {
        for(let y = 0; y < this.assetMap.height; y++) {
            for(let x = 0; x < this.assetMap.width; x++) {
                const index = y * this.assetMap.width + x

                if(this.assetMap.data[index] === 1) {
                    const hx = x * this.assetResolution
                    const hy = y * this.assetResolution

                    const worldX = -this.boardPlane.width / 2 +
                        x * (this.boardPlane.width / this.assetMap.width) + 
                        Math.random() * 0.4 - 0.2

                    const worldZ = this.boardPlane.height / 2 -
                        y * (this.boardPlane.height / this.assetMap.height) + 
                        Math.random() * 0.4 - 0.2

                    const worldY = this.heightMap.interpolateHeight(hx, hy)
                    
                    const selectedAsset = this.selectAssetForHeight(worldY)
                    if (selectedAsset) {
                        this.assets[selectedAsset.name].spawn(
                            worldX,
                            worldY + selectedAsset.positionOffset,
                            worldZ
                        )
                    }
                }
            }
        }
    }

    selectAssetForHeight(height) {

        const heightConfig = this.assetConfig.find(config =>
            height >= config.heightRange.min * this.heightScale && 
            height < config.heightRange.max * this.heightScale
        )

        if (!heightConfig || heightConfig.assets.length === 0) return null

        if (heightConfig.assets.length === 1) {
            return heightConfig.assets[0]
        }

        return this.selectByProbability(heightConfig.assets)
    }

    selectByProbability(assets) {

        const totalProbability = assets.reduce((sum, a) => sum + a.probability, 0)
        const normalizedAssets = assets.map(a => ({
            ...a,
            normalizedProb: a.probability / totalProbability
        }))

        let random = Math.random()
        for (const asset of normalizedAssets) {
            if (random < asset.normalizedProb) {
                return asset
            }
            random -= asset.normalizedProb
        }

        return assets[0] 
    }


    destroy() {

        const meshesToRemove = [];

        this.scene.traverse((child) => {

            if (
                child.isInstancedMesh &&
                child.userData.boardNature
            ) {
                meshesToRemove.push(child);
            }

        });

        for (const mesh of meshesToRemove) {

            this.scene.remove(mesh);

            mesh.geometry.dispose();

            if (Array.isArray(mesh.material)) {
                mesh.material.forEach(material => material.dispose());
            } else {
                mesh.material.dispose();
            }
        }
    }
}