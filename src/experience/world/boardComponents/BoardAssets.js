import * as THREE from 'three'
import Experience from '../../Experience'
import Tree from './assetsClass/Tree'
import Rock from './assetsClass/Rock'

export default class BoardAssets {
    constructor(boardPlane, assetMap, heightMap, assetResolution, numberOfAssets) {

        this.experience = new Experience()
        this.scene = this.experience.scene
        this.boardPlane = boardPlane
        this.assetMap = assetMap
        this.heightMap = heightMap
        this.resources = this.experience.resources
        this.heightScale = this.boardPlane.heightScale
        this.heightPower = this.boardPlane.heightPower
        this.assetResolution = assetResolution
        this.numberOfAssets = numberOfAssets
        this.treeProportions = {
            spruce: 80,
            oak:20,
        }

        this.setup()
    }

    setup() {

        this.spruceTree = new Tree(this.numberOfAssets, this.boardPlane, "spruce", 2)
        this.oakTree = new Tree(this.numberOfAssets, this.boardPlane, "oak", 1)
        this.rock = new Rock(this.numberOfAssets, this.boardPlane, 5)

        for(let y = 0; y < this.assetMap.height; y++) {

            for(let x = 0; x < this.assetMap.width; x++) {


                const index = y * this.assetMap.width + x


                if(this.assetMap.data[index] === 1) {


                    // posizione iniziale nella heightmap
                    const hx = x * this.assetResolution
                    const hy = y * this.assetResolution

                    const worldX =
                        -this.boardPlane.width / 2 +
                        x * (this.boardPlane.width / this.assetMap.width) + Math.random() * 0.4 - 0.2


                    const worldZ =
                        this.boardPlane.height / 2 -
                        y * (this.boardPlane.height / this.assetMap.height) + Math.random() * 0.4 - 0.2


                    const hNormal = this.interpolateHeight(hx,hy) 
                    const worldY =
                        this.getWorldHeight(
                            hNormal
                        )
                    
                    if (worldY < this.heightScale * 0.1)
                        this.oakTree.spawn(
                            worldX,
                            worldY,
                            worldZ
                        )
                    else if (worldY > this.heightScale * 0.1 && worldY < this.heightScale * 0.8)
                        this.spruceTree.spawn(
                            worldX,
                            worldY - 0.5,
                            worldZ
                        )
                    else if (worldY >= this.heightScale * 0.8)
                        this.rock.spawn(
                            worldX,
                            worldY -0.2,
                            worldZ
                        )
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

        const h = THREE.MathUtils.smoothstep(
            value,
            0.2,
            0.9
        )

        return Math.pow(h, this.heightPower) * this.heightScale
    }

    destroy() {

        const meshesToRemove = [];

        this.scene.traverse((child) => {

            if (
                child.isInstancedMesh &&
                child.userData.boardAsset
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