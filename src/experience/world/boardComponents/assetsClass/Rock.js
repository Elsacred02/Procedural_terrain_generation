import Experience from "../../../Experience"
import * as THREE from 'three'

export default class Rock {
    constructor(maxNumber, boardPlane, baseScale){

        this.experience = new Experience()
        this.scene = this.experience.scene
        this.resources = this.experience.resources
        this.boardPlane = boardPlane
        this.baseScale = baseScale

        this.rockGeometry = this.resources.items["big_rock"]
            .scene.getObjectByName("big_rock").geometry

        this.rockMaterial = this.resources.items["big_rock"]
            .scene.getObjectByName("big_rock").material

        this.meshRock = new THREE.InstancedMesh(
            this.rockGeometry,
            this.rockMaterial,
            maxNumber
        )
        this.meshRock.userData.boardAsset = true
        this.meshRock.count = 0
        this.scene.add(this.meshRock)
    }

    spawn(x, y, z) {
        const dummy = new THREE.Object3D()
        dummy.scale.set(
            this.baseScale / this.boardPlane.vertexRatio, 
            this.baseScale / this.boardPlane.vertexRatio, 
            this.baseScale / this.boardPlane.vertexRatio)
        dummy.position.set(x, y, z)
        dummy.rotation.set(-Math.PI / 2, 0, Math.random() * Math.PI * 2)
        dummy.updateMatrix()
        this.meshRock.setMatrixAt(
            this.meshRock.count,
            dummy.matrix
        )
        this.meshRock.count += 1;
        this.meshRock.instanceMatrix.needsUpdate = true
    }
}