import Sizes from "./utils/Sizes"
import Time from "./utils/Time"
import Camera from "./Camera"
import * as THREE from 'three'
import Renderer from "./Renderer"
import World from "./world/World"
import Debug from "./utils/Debug"

let instance = null

export default class Experience {

    constructor(canvas) {

        if(instance != null) {
            return instance;
        }
        instance = this;

        // Global access
        window.experience = this

        this.debug = new Debug();
        this.canvas = canvas;

        this.scene = new THREE.Scene();

        this.sizes = new Sizes();
        this.sizes.on('resize', () => {
            this.resize()
        });

        this.time = new Time()
        this.time.on('tick', () => {
            this.update()
        })

        this.camera = new Camera();
        this.renderer = new Renderer();

        this.world = new World();
    }

    resize() {
        this.camera.resize()
        this.renderer.resize()
    }

    update() {
        this.camera.update()
        this.renderer.update()
    }
}