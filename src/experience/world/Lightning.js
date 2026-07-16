import Experience from "../Experience"
import * as THREE from 'three'

export default class Lightning{
    constructor(boardHeight, boardWidth) {

        this.experience = new Experience()
        this.scene = this.experience.scene
        this.debugUI = this.experience.debug.ui
        this.boardHeight = boardHeight
        this.boardWidth = boardWidth

        this.setLights()
        this.setDebug()
    }

    setLights() {

        this.ambientLight = new THREE.HemisphereLight('#fffc','#6e3700', 0.7)
        this.scene.add(this.ambientLight)

        this.directionalLight = new THREE.DirectionalLight('#ffffec', 3)
        this.directionalLight.target.position.set(0, 0, 0)
        this.directionalLight.position.set(- this.boardWidth / 2 - 2, 15, this.boardHeight / 2 + 2)
        this.directionalLight.castShadow = true
        this.directionalLight.shadow.camera.far = 100
        this.directionalLight.shadow.camera.top = this.boardHeight
        this.directionalLight.shadow.camera.right = this.boardWidth
        this.directionalLight.shadow.camera.bottom = -this.boardHeight
        this.directionalLight.shadow.camera.left = -this.boardWidth
        this.directionalLight.shadow.mapSize.width = 1024
        this.directionalLight.shadow.mapSize.height = 1024
    
        this.directionaLightHelper = new THREE.DirectionalLightHelper(this.directionalLight)
        this.directionaLightHelper.visible = false
        
        this.scene.add(this.directionaLightHelper)
        this.scene.add(this.directionalLight)
    }

    setDebug() {
        this.debugFolder = this.debugUI.addFolder('Lights parameters')
        this.debugFolder.add(this.ambientLight, 'intensity').min(0.5).max(1).step(0.1).name("Ambient light intensity")
        this.debugFolder.add(this.directionalLight.position, 'x')
                        .min(- this.boardWidth / 2 - 2)
                        .max(this.boardWidth / 2 + 2)
                        .step(1)
                        .name("Directional light position x")
                        .onChange(() => {
                            this.directionaLightHelper.update()
                        })
        this.debugFolder.add(this.directionalLight.position, 'y')
                        .min(0)
                        .max(30)
                        .step(1)
                        .name("Directional light position y")
                        .onChange(() => {
                            this.directionaLightHelper.update()
                        })
        this.debugFolder.add(this.directionalLight.position, 'z')
                        .min(- this.boardHeight / 2 - 2)
                        .max(this.boardHeight / 2 + 2)
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

    destroy() {
        const lightsToRemove = [];

        this.scene.traverse((object) => {
            if (object.isLight) {
                lightsToRemove.push(object);
            }
        });

        lightsToRemove.forEach((light) => {
            light.removeFromParent();

            // Alcune luci possono avere texture o target associati
            if (light.dispose) {
                light.dispose();
            }

            if (light.shadow && light.shadow.map) {
                light.shadow.map.dispose();
            }
        });

        if(this.debugFolder){
            this.debugFolder.destroy()
            this.debugFolder = null
        }
    }
}