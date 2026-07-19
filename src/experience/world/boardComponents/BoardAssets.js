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
        this.heightScale = this.boardPlane.heightScale
        this.heightPower = this.boardPlane.heightPower

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

                    const worldX =
                        -this.boardPlane.width / 2 +
                        x * (this.boardPlane.width / this.assetMap.width)


                    const worldZ =
                        this.boardPlane.height / 2 -
                        y * (this.boardPlane.height / this.assetMap.height);


                    const worldY =
                        this.getWorldHeight(
                            this.interpolateHeight(hx,hy)
                        ) -0.5


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

        let sum = 0;

        for (let y = 0; y < 4; y++) {

            for (let x = 0; x < 4; x++) {

                const hx = startX + x;
                const hy = startY + y;

                const index = hy * this.heightMap.width + hx;

                sum += this.heightMap.data[index];
            }
        }

        return sum / 16;
    }

    getWorldHeight(value) {

        const h = THREE.MathUtils.smoothstep(
            value,
            0.2,
            0.9
        )

        return Math.pow(h, this.heightPower) * this.heightScale
    }

    spawn(x, y, z, log, leaves) {
        const dummy = new THREE.Object3D()
        dummy.scale.set(1 / this.boardPlane.vertexRatio, 1 / this.boardPlane.vertexRatio, 1 / this.boardPlane.vertexRatio)
        dummy.position.set(x, y, z)
        dummy.rotation.set(0, 0, 0)
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