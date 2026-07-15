import { PerspectiveCamera } from "three";
import Experience from "./Experience";
import { OrbitControls } from "three/examples/jsm/Addons.js";
import { gsap } from "gsap";

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
        this.instance = new PerspectiveCamera(50, this.sizes.width / this.sizes.height, 0.1, 1000)
        this.instance.position.set(0, 70, 70)
        this.scene.add(this.instance)
    }

    setOrbitControls() {
        this.controls = new OrbitControls(this.instance, this.canvas)
        this.controls.minPolarAngle = 0
        this.controls.maxPolarAngle = Math.PI / 2;
        this.controls.enableDamping = true
    }

    resize() {
        this.instance.aspect = this.sizes.width / this.sizes.height
        this.instance.updateProjectionMatrix()
    }

    update() {
        this.controls.update()
    }

    resetInitialPosition(){
        gsap.to(this.instance.position, {
            x: 0,
            y: 70,
            z: 70,
            duration: 2,
            ease: "power3.inOut",
            onUpdate: () => {
                this.instance.lookAt(0, 0, 0);
            }
        });
    }

    setDebugUI() {
        this.debugFolder = this.debugUI.addFolder('Camera parameters')
        this.debugFolder.add(this, "resetInitialPosition").name("Reset camera initial position")
    }
}