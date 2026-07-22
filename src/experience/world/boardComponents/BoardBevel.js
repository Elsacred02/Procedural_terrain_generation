import { SUBTRACTION, Brush, Evaluator } from 'three-bvh-csg';
import Experience from '../../Experience';
import * as THREE from 'three'

export default class BoardBevel{
    constructor(width, height, bevelThickness, bevelHeightness){
        this.experience = new Experience()
        this.scene = this.experience.scene

        this.width = width
        this.height = height
        this.bevelThickness = bevelThickness
        this.bevelHeightness = bevelHeightness

        this.setup()
    }

    setup() {
        const boardFilled = new Brush(new THREE.BoxGeometry(
            this.width + this.bevelThickness, 
            this.bevelHeightness, 
            this.height + this.bevelThickness))
        const boardHole = new Brush(new THREE.BoxGeometry(
            this.width, 
            this.bevelHeightness + 0.1, 
            this.height))

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
        this.boardBorders.position.y = this.bevelHeightness / 2
        this.scene.add(this.boardBorders)
    }

    destroy() {
        this.scene.remove(this.boardBorders)
        this.boardBorders.material.dispose()
        this.boardBorders.geometry.dispose()
    }
}