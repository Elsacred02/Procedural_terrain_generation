import Experience from "../Experience"
import * as THREE from 'three'
import Board from "./Board"
import Lightning from "./Lightning"

export default class World{

    constructor(){

        this.experience = new Experience()
        this.resources = this.experience.resources
        this.scene = this.experience.scene
        this.debugUI = this.experience.debug.ui
        
        // Set debug GUI
        this.parameters = {
            boardWidth: 64,
            boardHeight: 64,
            boardVertexRatio: 2,
            generate: () => {
                this.rebuildScene()
            }
        }

        this.resources.on('ready', () => {

            this.setDebug()

            // HeightMatrix

            // Board
            this.board = new Board(
                this.parameters.boardWidth,
                this.parameters.boardHeight,
                this.parameters.boardVertexRatio
            )

            // Lights
            this.lights = new Lightning(
                this.parameters.boardWidth,
                this.parameters.boardHeight
            )

        })
    }

    rebuildScene() {
        this.board.destroy()
        this.lights.destroy()
        this.board = new Board(
            this.parameters.boardWidth,
            this.parameters.boardHeight,
            this.parameters.boardVertexRatio
        )
        this.lights = new Lightning(
            this.parameters.boardWidth,
            this.parameters.boardHeight
        )
        this.experience.camera.resetInitialPosition()
    }

    setDebug() {
        this.debugFolder = this.debugUI.addFolder('World parameters')
        this.debugFolder.add(this.parameters, 'boardWidth').min(32).max(64).step(1).name("Board Width")
        this.debugFolder.add(this.parameters, 'boardHeight').min(32).max(64).step(1).name("Board Height")
        this.debugFolder.add(this.parameters, 'boardVertexRatio').min(1).max(5).step(1).name("Board Vertex Ratio")
        this.debugFolder.add(this.parameters, 'generate')
    }
}