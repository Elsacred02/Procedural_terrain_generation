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

        // Asset originale importato
        this.meshHouse = this.resources.items[type + "_house"].scene

        // Shadow sull'asset originale
        this.meshHouse.traverse((child) => {
            if (child.isMesh) {
                child.castShadow = true
                child.receiveShadow = true
            }
        })
    }


    spawn(x, y, z, rx = 0, ry = 0, rz = 0) {

        // Crea una copia indipendente della gerarchia
        const house = this.meshHouse.clone()


        // Scala relativa alla board
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