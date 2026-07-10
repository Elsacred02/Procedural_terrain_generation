import { PerspectiveCamera } from "three";
import Experience from "./Experience";
import { OrbitControls } from "three/examples/jsm/Addons.js";

export default class Camera{

    constructor(){

        // Parameters 

        this.experience = new Experience()
        this.sizes = this.experience.sizes
        this.scene = this.experience.scene
        this.canvas = this.experience.canvas
        this.debugUI = this.experience.debug.ui

        this.setInstance()
        this.setOrbitControls()
        this.setDebugUI()
    }

    setInstance() {
        this.instance = new PerspectiveCamera(35, this.sizes.width / this.sizes.height, 0.1, 1000)
        this.instance.position.set(50, 50, 0)
        this.scene.add(this.instance)
    }

    setOrbitControls() {
        this.controls = new OrbitControls(this.instance, this.canvas)
        this.controls.enableDamping = true
    }

    resize() {
        this.instance.aspect = this.sizes.width / this.sizes.height
        this.instance.updateProjectionMatrix()
    }

    update() {
        this.controls.update()
    }

    setDebugUI() {
        this.debugFolder = this.debugUI.addFolder('Camera parameters')
        this.debugFolder.add(this.instance.position, 'x').min(1).max(100).step(1).name("Camera position x")
        this.debugFolder.add(this.instance.position, 'y').min(1).max(100).step(1).name("Camera position y")
        this.debugFolder.add(this.instance.position, 'z').min(1).max(100).step(1).name("Camera position z")
    }
}