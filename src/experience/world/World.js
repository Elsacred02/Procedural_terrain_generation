import Experience from "../Experience"
import * as THREE from 'three'
import Lightning from "./Lightning"
import HeightMap from "./HeightMap"
import AssetMap from "./AssetMap"
import BoardPlane from "./boardComponents/BoardPlane"
import BoardBevel from "./boardComponents/BoardBevel"
import BoardAssets from "./boardComponents/BoardAssets"

export default class World{

    constructor(){

        this.experience = new Experience()
        this.resources = this.experience.resources
        this.scene = this.experience.scene
        this.debugUI = this.experience.debug.ui
        
        // Set debug GUI
        this.parameters = {
            boardBevel: 4,
            boardWidth: 64,
            boardHeight: 64,
            boardVertexRatio: 1,
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
            this.create()
        })
    }

    create() {

        this.heightMap = new HeightMap(
            this.parameters.boardWidth * this.parameters.boardVertexRatio,
            this.parameters.boardHeight * this.parameters.boardVertexRatio,
            this.parameters.perlinNoiseOctaves,
            this.parameters.perlinNoiseCoordinatesScale,
            this.parameters.seed
        )

        this.assetMap = new AssetMap(
            this.heightMap
        )

        this.boardBevel = new BoardBevel(
            this.parameters.boardWidth,
            this.parameters.boardHeight,
            this.parameters.boardBevel,
            this.parameters.heightMapScaler
        )

        this.boardPlane = new BoardPlane(
            this.parameters.boardWidth,
            this.parameters.boardHeight,
            this.parameters.boardVertexRatio,
            this.heightMap,
            this.parameters.heightMapScaler,
            this.parameters.heightMapPower
        )

        this.boardAssets = new BoardAssets(
            this.boardPlane,
            this.assetMap,
            this.heightMap
        )

        this.lights = new Lightning(
            this.parameters.boardWidth,
            this.parameters.boardHeight
        )
    }

    rebuildScene() {
        this.boardBevel.destroy()
        this.boardPlane.destroy()
        this.lights.destroy()
        this.create()
        this.experience.camera.resetInitialPosition()
    }

    setDebug() {
        this.debugFolder = this.debugUI.addFolder('World parameters')
        this.debugFolder.add(this.parameters, 'seed')
            .min(0).max(64).step(1)
            .name("World seed")
        this.debugFolder.add(this.parameters, 'boardVertexRatio')
            .min(0.5).max(8).step(0.5)
            .name("Board's Vertex Ratio")
        this.debugFolder.add(this.parameters, 'perlinNoiseOctaves')
            .min(1).max(8).step(1)
            .name("Perlin noise octaves")
        this.debugFolder.add(this.parameters, 'perlinNoiseCoordinatesScale')
            .min(0.005).max(0.03).step(0.005)
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