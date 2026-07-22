import * as THREE from 'three'
import Experience from '../../Experience'
import terrainVertexShader from '../../shaders/terrain/vertex.glsl'
import terrainFragmentShader from '../../shaders/terrain/fragment.glsl'
import CustomShaderMaterial from 'three-custom-shader-material/vanilla'

export default class BoardPlane {

    constructor(width, height, vertexRatio, heightMap, heightScale, heightPower) {

        this.experience = new Experience()
        this.scene = this.experience.scene

        this.width = width
        this.height = height
        this.vertexRatio = vertexRatio

        this.heightMap = heightMap
        this.heightScale = heightScale
        this.heightPower = heightPower

        const stepX = this.width / (this.width * this.vertexRatio - 1)
        const stepY = this.height / (this.height * this.vertexRatio - 1)

        this.uniforms = {
            uHeightMap: {
                value: this.heightMap.buildTexture()
            },
            uHeightScale: {
                value: this.heightScale
            },
            uHeightPower:{
                value: this.heightPower
            },
            uHeightMapSize : {
                value: new THREE.Vector2(
                    this.heightMap.width,
                    this.heightMap.height
                )
            },
            uTerrainSize: {
                value: new THREE.Vector2(stepX, stepY)
            }
        }

        this.setup()
    }

    setup() {
        this.boardPlaneGeometry = new THREE.PlaneGeometry(
            this.width, 
            this.height, 
            this.width * this.vertexRatio - 1, 
            this.height * this.vertexRatio - 1
        )
        this.boardPlaneGeometry.deleteAttribute('normal')

        this.boardPlaneMaterial = new CustomShaderMaterial({
            baseMaterial: THREE.MeshStandardMaterial,
            vertexShader: terrainVertexShader,
            fragmentShader: terrainFragmentShader,
            uniforms: this.uniforms,
            metalness: 0.0, 
            roughness: 0.5
        })

        this.boardPlane = new THREE.Mesh(
            this.boardPlaneGeometry,
            this.boardPlaneMaterial
        )

        this.planeDepthMaterial = new CustomShaderMaterial({

            baseMaterial: THREE.MeshDepthMaterial,
            vertexShader: terrainVertexShader,
            uniforms: this.uniforms,

            // MeshDepthMaterial
            depthPacking: THREE.RGBADepthPacking
        })

        this.boardPlane.customDepthMaterial = this.planeDepthMaterial

        this.boardPlane.rotateX(- Math.PI / 2)
        this.boardPlane.castShadow = true
        this.boardPlane.receiveShadow = true
        this.scene.add(this.boardPlane)
    }

    destroy() {
        this.scene.remove(this.boardPlane)
        this.boardPlaneMaterial.dispose()
        this.planeDepthMaterial.dispose()
        this.boardPlaneGeometry.dispose()
    }
}