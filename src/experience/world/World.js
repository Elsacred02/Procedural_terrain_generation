import Experience from "../Experience"
import * as THREE from 'three'
import Board from "./Board"
import Lightning from "./Lightning"
import HeightMap from "./HeightMap"

export default class World{

    constructor(){

        this.experience = new Experience()
        this.resources = this.experience.resources
        this.scene = this.experience.scene
        this.debugUI = this.experience.debug.ui
        
        // Set debug GUI
        this.parameters = {
            axesVisible: false,

            boardWidth: 64,
            boardHeight: 64,
            boardVertexRatio: 4,

            perlinNoiseOctaves: 4,
            perlinNoiseCoordinatesScale: 0.01,
            heightMapScaler: 10,
            heightMapPower: 3.0,
            seed: 0,

            generate: () => {
                this.rebuildScene()
            }
        }

        this.resources.on('ready', () => {

            this.setDebug()

            // HeightMap
            this.heightMap = new HeightMap(
                this.parameters.boardWidth * this.parameters.boardVertexRatio,
                this.parameters.boardHeight * this.parameters.boardVertexRatio,
                this.parameters.perlinNoiseOctaves,
                this.parameters.perlinNoiseCoordinatesScale,
                this.parameters.seed
            )

            // Board
            this.board = new Board(
                this.parameters.boardWidth,
                this.parameters.boardHeight,
                this.parameters.boardVertexRatio,
                this.heightMap,
                this.parameters.heightMapScaler,
                this.parameters.heightMapPower
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
        this.heightMap = new HeightMap(
            this.parameters.boardWidth * this.parameters.boardVertexRatio,
            this.parameters.boardHeight * this.parameters.boardVertexRatio,
            this.parameters.perlinNoiseOctaves,
            this.parameters.perlinNoiseCoordinatesScale,
            this.parameters.seed
        )
        this.board = new Board(
            this.parameters.boardWidth,
            this.parameters.boardHeight,
            this.parameters.boardVertexRatio,
            this.heightMap, 
            this.parameters.heightMapScaler,
            this.parameters.heightMapPower
        )
        this.lights = new Lightning(
            this.parameters.boardWidth,
            this.parameters.boardHeight
        )
        this.experience.camera.resetInitialPosition()
    }

    setDebug() {

        this.debugFolder = this.debugUI.addFolder('World parameters')

        const axesHelper = new THREE.AxesHelper(5)
        axesHelper.position.set(0, 20, 0)
        this.debugFolder.add(this.parameters, "axesVisible").onChange((value) => {
            if(value) {
                this.scene.add(axesHelper)
            }
            else{
                this.scene.remove(axesHelper)
            }
        })

        this.debugFolder.add(this.parameters, 'seed')
            .min(0).max(64).step(1)
            .name("World seed")
        this.debugFolder.add(this.parameters, 'boardWidth')
            .min(48).max(64).step(1)
            .name("Board's Width")
        this.debugFolder.add(this.parameters, 'boardHeight')
            .min(48).max(64).step(1)
            .name("Board's Height")
        this.debugFolder.add(this.parameters, 'boardVertexRatio')
            .min(0.5).max(8).step(0.5)
            .name("Board's Vertex Ratio")
        this.debugFolder.add(this.parameters, 'perlinNoiseOctaves')
            .min(1).max(8).step(1)
            .name("Perlin noise octaves")
        this.debugFolder.add(this.parameters, 'perlinNoiseCoordinatesScale')
            .min(0.005).max(0.1).step(0.005)
            .name("Perlin noise coordinates scaler")
        this.debugFolder.add(this.parameters, 'heightMapScaler')
            .min(5).max(20).step(1)
            .name("Mountains height")
        this.debugFolder.add(this.parameters, 'heightMapPower')
            .min(1).max(20).step(0.1)
            .name("Plains size")
        this.debugFolder.add(this.parameters, 'generate')
    }
}