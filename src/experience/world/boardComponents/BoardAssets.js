import * as THREE from 'three'
import Experience from '../../Experience'

export default class BoardAssets {
    constructor(boardPlane, assetMap, heightMap) {

        this.experience = new Experience()
        this.scene = this.experience.scene
        this.boardPlane = boardPlane
        this.assetMap = assetMap
        this.heightMap = heightMap
        this.resources = this.experience.resources

        this.stepX = this.boardPlane.width / (this.boardPlane.width * this.boardPlane.vertexRatio - 1)
        this.stepY = this.boardPlane.height / (this.boardPlane.height * this.boardPlane.vertexRatio - 1)

        this.setup()
    }

    setup() {

        const logGeometry = this.resources.items["oak_tree"]
            .scene.getObjectByName("oak_log").geometry

        const logMaterial = this.resources.items["oak_tree"]
            .scene.getObjectByName("oak_log").material


        const leavesGeometry = this.resources.items["oak_tree"]
            .scene.getObjectByName("oak_leaves").geometry

        const leavesMaterial = this.resources.items["oak_tree"]
            .scene.getObjectByName("oak_leaves").material


        const meshLog = new THREE.InstancedMesh(
            logGeometry,
            logMaterial,
            1000
        )

        const meshLeaves = new THREE.InstancedMesh(
            leavesGeometry,
            leavesMaterial,
            1000
        )


        meshLog.count = 0
        meshLeaves.count = 0


        this.scene.add(meshLog, meshLeaves)


        for(let y = 0; y < this.assetMap.height; y++) {

            for(let x = 0; x < this.assetMap.width; x++) {


                const index = y * this.assetMap.width + x


                if(this.assetMap.data[index] === 1) {


                    // posizione iniziale nella heightmap
                    const hx = x * 4
                    const hy = y * 4


                    const height = this.interpolateHeight(
                        hx,
                        hy
                    )


                    // coordinate mondo
                    const worldX =
                        -this.boardPlane.width / 2 +
                        x * (this.boardPlane.width / this.assetMap.width)


                    const worldZ =
                        -this.boardPlane.height / 2 +
                        y * (this.boardPlane.height / this.assetMap.height)


                    // trasformo altezza normalizzata in altezza reale
                    const worldY = height * 10


                    this.spawn(
                        worldX,
                        worldY,
                        worldZ,
                        meshLog,
                        meshLeaves
                    )
                }
            }
        }
    }

    interpolateHeight(startX, startY) {

        let total = 0
        let weightSum = 0


        const centerX = startX + 1.5
        const centerY = startY + 1.5


        for(let y = 0; y < 4; y++) {

            for(let x = 0; x < 4; x++) {


                const hx = startX + x
                const hy = startY + y


                const index =
                    hy * this.heightMap.width + hx


                let value =
                    this.heightMap.data[index]
                    
                // distanza dal centro della cella asset
                const dx = hx - centerX
                const dy = hy - centerY


                const distance =
                    Math.sqrt(dx * dx + dy * dy)


                // più vicino = più influenza
                const weight =
                    1 / (distance + 0.001)


                total += value * weight
                weightSum += weight
            }
        }


        return total / weightSum
    }

    spawn(x, y, z, log, leaves) {
        const dummy = new THREE.Object3D()
        dummy.position.set(x, y, z)
        dummy.rotation.set(0, 0, 0)
        dummy.scale.set(1 / this.boardPlane.vertexRatio, 1 / this.boardPlane.vertexRatio, 1 / this.boardPlane.vertexRatio)
        dummy.updateMatrix()
        log.setMatrixAt(
            log.count,
            dummy.matrix
        )
        leaves.setMatrixAt(
            leaves.count,
            dummy.matrix
        )
        log.count += 1;
        leaves.count +=1
        log.instanceMatrix.needsUpdate = true
        leaves.instanceMatrix.needsUpdate = true
    }
}