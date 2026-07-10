import Experience from "../Experience";
import * as THREE from 'three'
import { SUBTRACTION, Brush, Evaluator } from 'three-bvh-csg';

export default class Board {

    constructor() {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.debugUI = this.experience.debug.ui

        this.setModel()
        this.setDebug()
    }

    setModel() {

        const boardFilled = new Brush(new THREE.BoxGeometry(34, 3, 34))
        const boardHole = new Brush(new THREE.BoxGeometry(32, 3.1, 32))

        boardFilled.updateMatrixWorld()
        boardHole.updateMatrixWorld()

        const evaluator = new Evaluator()
        this.boardBorders = evaluator.evaluate(boardFilled, boardHole, SUBTRACTION)
        this.boardBorders.geometry.clearGroups()
        this.boardBorders.geometry.computeVertexNormals()
        this.boardBorders.material = new THREE.MeshStandardMaterial({
            "color": '#ffffff', 
            metalness:0.0, 
            roughness:0.3
        })
        this.boardBorders.castShadow = true
        this.boardBorders.receiveShadow = true
        this.boardBorders.position.y = 1
        this.scene.add(this.boardBorders)

        this.boardPlane = new THREE.Mesh(
            new THREE.PlaneGeometry(32, 32, 64, 64),
            new THREE.MeshStandardMaterial({
                "color": '#64a127', 
                metalness: 0.0, 
                roughness: 0.5
            })
        )
        this.boardPlane.rotateX(- Math.PI / 2)
        this.boardPlane.castShadow = true
        this.boardPlane.receiveShadow = true
        this.scene.add(this.boardPlane)
    }

    setDebug() {
        this.debugFolder = this.debugUI.addFolder('Material parameters')
        this.debugFolder.add(this.boardPlane.material, 'wireframe').name("Wireframe plane")
        this.debugFolder.add(this.boardBorders.material, 'wireframe').name("Wireframe borders")
    }

}