import Experience from "../Experience";
import * as THREE from 'three'
import { SUBTRACTION, Brush, Evaluator } from 'three-bvh-csg';
import terrainVertexShader from '../shaders/terrain/vertex.glsl'
import terrainFragmentShader from '../shaders/terrain/fragment.glsl'
import CustomShaderMaterial from 'three-custom-shader-material/vanilla'

export default class Board {

    constructor(width, height, vertexRatio, vertexHeightMap, heightScale) {

        this.experience = new Experience()
        this.scene = this.experience.scene
        this.debugUI = this.experience.debug.ui

        this.width = width
        this.height = height

        this.vertexRatio = vertexRatio
        this.vertexHeightMap = vertexHeightMap
        this.heightScale = heightScale
        this.vertexHeightMapTexture = this.vertexHeightMap.buildTexture()

        this.borderBevelWidth = 4
        this.borderBevelHeight = this.heightScale

        const stepX = this.width / (this.width * this.vertexRatio - 1)
        const stepY = this.height / (this.height * this.vertexRatio - 1)

        this.uniforms = {
            uHeightMap: {
                value: this.vertexHeightMapTexture
            },
            uHeightScale: {
                value: this.heightScale
            },
            uHeightMapSize : {
                value: new THREE.Vector2(
                    this.vertexHeightMap.width,
                    this.vertexHeightMap.height
                )
            },
            uTerrainSize: {
                value: new THREE.Vector2(stepX, stepY)
            }
        }

        this.setModel()
        this.setDebug()
    }

    setModel() {

        const boardFilled = new Brush(new THREE.BoxGeometry(
            this.width + this.borderBevelWidth, 
            this.borderBevelHeight, 
            this.height + this.borderBevelWidth))
        const boardHole = new Brush(new THREE.BoxGeometry(
            this.width, 
            this.borderBevelHeight + 0.1, 
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
        this.boardBorders.position.y = this.borderBevelHeight / 2
        this.scene.add(this.boardBorders)

        this.boardPlane = new THREE.Mesh(
            new THREE.PlaneGeometry(
                this.width, 
                this.height, 
                this.width * this.vertexRatio - 1, 
                this.height * this.vertexRatio - 1),
            new CustomShaderMaterial({
                baseMaterial: THREE.MeshStandardMaterial,
                
                vertexShader: terrainVertexShader,
                fragmentShader: terrainFragmentShader,
                uniforms: this.uniforms,
                metalness: 0.0, 
                roughness: 0.5
            })
        )

        const planeDepthMaterial = new CustomShaderMaterial({

            baseMaterial: THREE.MeshDepthMaterial,
            vertexShader: terrainVertexShader,
            uniforms: this.uniforms,

            // MeshDepthMaterial
            depthPacking: THREE.RGBADepthPacking
        })

        this.boardPlane.customDepthMaterial = planeDepthMaterial

        this.boardPlane.rotateX(- Math.PI / 2)
        this.boardPlane.castShadow = true
        this.boardPlane.receiveShadow = true
        this.scene.add(this.boardPlane)
    }

    setDebug() {
        this.debugFolder = this.debugUI.addFolder('Board material parameters')
        this.debugFolder.add(this.boardPlane.material, 'wireframe').name("Wireframe plane")
        this.debugFolder.add(this.boardBorders.material, 'wireframe').name("Wireframe borders")
    }

    destroy() {
        const meshesToRemove = [];

        this.scene.traverse((object) => {
            if (object.isMesh) {
                meshesToRemove.push(object);
            }
        });

        meshesToRemove.forEach((mesh) => {
            
            mesh.removeFromParent();

            if (mesh.geometry) {
                mesh.geometry.dispose();
            }

            if (mesh.material) {
                if (Array.isArray(mesh.material)) {
                    mesh.material.forEach((material) => {
                        material.dispose();
                    });
                } else {
                    mesh.material.dispose();
                }
            }
        });

        if(this.debugFolder){
            this.debugFolder.destroy()
            this.debugFolder = null
        }
    }
}