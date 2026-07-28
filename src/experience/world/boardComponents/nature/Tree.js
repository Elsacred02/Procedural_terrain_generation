import Experience from "../../../Experience"
import * as THREE from 'three'

export default class SpruceTree {
    constructor(maxNumber, boardPlane, species, baseScale){

        this.experience = new Experience()
        this.scene = this.experience.scene
        this.resources = this.experience.resources
        this.boardPlane = boardPlane

        this.species = species
        this.baseScale = baseScale

        this.logGeometry = this.resources.items[species+"_tree"]
            .scene.getObjectByName(species+"_log").geometry

        this.logMaterial = this.resources.items[species+"_tree"]
            .scene.getObjectByName(species+"_log").material


        this.leavesGeometry = this.resources.items[species+"_tree"]
            .scene.getObjectByName(species+"_leaves").geometry

        this.leavesMaterial = this.resources.items[species+"_tree"]
            .scene.getObjectByName(species+"_leaves").material


        this.meshLog = new THREE.InstancedMesh(
            this.logGeometry,
            this.logMaterial,
            maxNumber
        )
        this.meshLog.userData.boardNature = true

        this.meshLeaves = new THREE.InstancedMesh(
            this.leavesGeometry,
            this.leavesMaterial,
            maxNumber
        )
        this.meshLeaves.userData.boardNature = true

        this.meshLog.count = 0
        this.meshLeaves.count = 0

        this.meshLeaves.castShadow = true

        this.scene.add(this.meshLog, this.meshLeaves)
    }

    spawn(x, y, z) {
        const dummy = new THREE.Object3D()
        dummy.scale.set(
            this.baseScale / this.boardPlane.vertexRatio, 
            this.baseScale / this.boardPlane.vertexRatio, 
            this.baseScale / this.boardPlane.vertexRatio)
        dummy.position.set(x, y, z)
        dummy.rotation.set(0, 0, 0)
        dummy.updateMatrix()
        this.meshLog.setMatrixAt(
            this.meshLog.count,
            dummy.matrix
        )
        this.meshLeaves.setMatrixAt(
            this.meshLeaves.count,
            dummy.matrix
        )
        this.meshLog.count += 1;
        this.meshLeaves.count +=1
        this.meshLog.instanceMatrix.needsUpdate = true
        this.meshLeaves.instanceMatrix.needsUpdate = true
    }
}