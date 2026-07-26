import Experience from "../../../Experience"
import * as THREE from 'three'

export default class House {

    constructor(id, boardPlane, baseScale, type) {

        this.experience = new Experience()
        this.scene = this.experience.scene
        this.resources = this.experience.resources

        this.boardPlane = boardPlane
        this.baseScale = baseScale
        this.type = type

        this.meshHouse = this.resources.items[type + "_house"].scene

        this.meshHouse.traverse((child) => {
            if (child.isMesh) {
                child.castShadow = true
                child.receiveShadow = true
            }
        })
    }


    spawn(x, y, z, rx = 0, ry = 0, rz = 0) {

        const house = this.meshHouse.clone()

        house.userData.boardVillage = true

        const scale = this.baseScale / this.boardPlane.vertexRatio

        house.scale.set(
            scale,
            scale,
            scale
        )


        // Posizione
        house.position.set(
            x,
            y,
            z
        )

        // Rotazione
        house.rotation.set(
            rx,
            ry,
            rz
        )


        // Aggiorna matrici
        house.updateMatrixWorld(true)


        // Aggiunge alla scena
        this.scene.add(house)


        return house
    }
}