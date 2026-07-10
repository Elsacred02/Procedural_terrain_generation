import Experience from "../Experience"
import * as THREE from 'three'

export default class Lightning{
    constructor() {

        this.experience = new Experience()
        this.scene = this.experience.scene
        this.debugUI = this.experience.debug.ui

        this.setLights()
        this.setDebug()
    }

    setLights() {

        this.ambientLight = new THREE.AmbientLight('#ffffff', 1)
        this.scene.add(this.ambientLight)

        this.directionalLight = new THREE.DirectionalLight('#ffffff', 2)
        this.directionalLight.target.position.set(0, 0, 0)
        this.directionalLight.position.set(15, 15, 0)
        this.directionalLight.castShadow = true
        this.directionalLight.shadow.mapSize.width = 1024
        this.directionalLight.shadow.mapSize.height = 1024
    
        this.directionaLightHelper = new THREE.DirectionalLightHelper(this.directionalLight)
        this.directionaLightHelper.visible = false
        
        this.scene.add(this.directionaLightHelper)
        this.scene.add(this.directionalLight)
    }

    setDebug() {
        this.debugFolder = this.debugUI.addFolder('Lights parameters')
        this.debugFolder.add(this.ambientLight, 'intensity').min(1).max(5).step(1).name("Ambient light intensity")
        this.debugFolder.add(this.directionalLight.position, 'x')
                        .min(0)
                        .max(20)
                        .step(1)
                        .name("Directional light position x")
                        .onChange(() => {
                            this.directionaLightHelper.update()
                        })
        this.debugFolder.add(this.directionalLight.position, 'y')
                        .min(0)
                        .max(20)
                        .step(1)
                        .name("Directional light position y")
                        .onChange(() => {
                            this.directionaLightHelper.update()
                        })
        this.debugFolder.add(this.directionalLight.position, 'z')
                        .min(0)
                        .max(20)
                        .step(1)
                        .name("Directional light position z")
                        .onChange(() => {
                            this.directionaLightHelper.update()
                        })
        this.debugFolder.add(this.directionalLight, 'intensity')
                        .min(1)
                        .max(5)
                        .step(1)
                        .name("Directional light intensity")
        this.debugFolder.add(this.directionaLightHelper, 'visible')
    }
}