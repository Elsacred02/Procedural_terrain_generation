import Experience from "../Experience"
import * as THREE from 'three'

export default class Cloud {
    constructor(maxNumber){

        this.experience = new Experience()
        this.scene = this.experience.scene
        this.resources = this.experience.resources

        this.cloudGeometry = this.resources.items["cloud"]
            .scene.getObjectByName("cloud").geometry

        this.cloudMaterial = this.resources.items["cloud"]
            .scene.getObjectByName("cloud").material

        this.meshCloud = new THREE.InstancedMesh(
            this.cloudGeometry,
            this.cloudMaterial,
            maxNumber
        )

        this.meshCloud.castShadow = true

        this.meshCloud.userData.sky = true
        this.meshCloud.count = 0
        this.scene.add(this.meshCloud)
    }

    spawn(x, y, z, ry) {
        const dummy = new THREE.Object3D()
        const scale = Math.random() * 2 + 0.2
        dummy.scale.set(scale, scale, scale)
        dummy.position.set(x, y, z)
        dummy.rotation.set(0, ry, 0)
        dummy.updateMatrix()
        this.meshCloud.setMatrixAt(
            this.meshCloud.count,
            dummy.matrix
        )
        this.meshCloud.count += 1;
        this.meshCloud.instanceMatrix.needsUpdate = true
    }
}