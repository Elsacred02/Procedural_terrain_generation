import Experience from "../Experience"
import * as THREE from 'three'
import Lightning from "./Lightning"
import HeightMap from "./HeightMap"
import NatureMap from "./NatureMap"
import BoardPlane from "./boardComponents/BoardPlane"
import BoardBevel from "./boardComponents/BoardBevel"
import BoardNature from "./boardComponents/BoardNature"

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
            boardVertexRatio: 4,
            perlinNoiseOctaves: 4,
            perlinNoiseCoordinatesScale: 0.01,
            heightMapScaler: 10,
            heightMapPower: 3.0,
            seed: 0,
            boardAssetResolution: 4,
            numberOfAssets : 500,
            percentTrees: 0.8,
            numberOfForests: 10,
            generationAlgorithm: "random",
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

        this.assetMap = new NatureMap(
            this.heightMap,
            this.parameters.boardAssetResolution,
            this.parameters.heightMapScaler,
            this.parameters.heightMapPower
        )
        switch(this.parameters.generationAlgorithm){
            case "random":
                this.assetMap.randomAssetMap(this.parameters.numberOfAssets)
                break
            case "forests":
                this.assetMap.forestCluster(
                    this.parameters.numberOfAssets, 
                    this.parameters.numberOfForests, 
                    this.parameters.percentTrees, 
                    50
                )
                break
        }

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

        this.boardNature = new BoardNature(
            this.boardPlane,
            this.assetMap,
            this.heightMap,
            this.parameters.boardAssetResolution,
            this.parameters.numberOfAssets
        )

        this.lights = new Lightning(
            this.parameters.boardWidth,
            this.parameters.boardHeight
        )
    }

    rebuildScene() {
        this.boardBevel.destroy()
        this.boardPlane.destroy()
        this.boardNature.destroy()
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
            .min(1).max(8).step(0.5)
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
        this.debugFolder.add(this.parameters, 'boardAssetResolution', [4, 8])
            .name("Asset spawn resolution")
        this.debugFolder.add(this.parameters, 'numberOfAssets')
            .min(100).max(1000).step(50)
            .name("Number of spawn assets")
        this.numberOfForestsControl = this.debugFolder.add(this.parameters, 'numberOfForests')
            .min(5).max(20).step(1)
            .name("Number of spawned forests").hide()
        this.percentTreesControl = this.debugFolder.add(this.parameters, 'percentTrees')
            .min(0.1).max(1).step(0.1)
            .name("Assets assigned to forests").hide()
        this.debugFolder.add(this.parameters, 'generationAlgorithm', ["random", "forests"])
            .name("Control the type of generation")
            .onChange((chosenAlgorithm) => {
                if (chosenAlgorithm == "random"){
                    this.numberOfForestsControl.hide()
                    this.percentTreesControl.hide()
                }
                else{
                    this.numberOfForestsControl.show()
                    this.percentTreesControl.show()
                }
            })
        this.debugFolder.add(this.parameters, 'generate')
    }
}