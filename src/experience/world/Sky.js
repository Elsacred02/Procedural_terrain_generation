import Experience from "../Experience"
import * as THREE from 'three'
import skyVertexShader from '../shaders/sky/vertex.glsl'
import skyFragmentShader from '../shaders/sky/fragment.glsl'
import Cloud from "./Cloud"

export default class Sky{
    constructor() {
        this.experience = new Experience()
        this.scene = this.experience.scene

        this.setupSky()
        this.setupClouds()
    }

    setupSky() {
        this.skyGeometry = new THREE.SphereGeometry(1000, 16, 8);
        this.skyMaterial = new THREE.ShaderMaterial({
            side: THREE.BackSide,
            uniforms: {
                topColor: { value: new THREE.Color("#023e8a") },
                bottomColor: { value: new THREE.Color("#8ecae6") }
            },
            vertexShader: skyVertexShader,
            fragmentShader: skyFragmentShader
        });

        this.skyMesh = new THREE.Mesh(this.skyGeometry, this.skyMaterial)
        this.scene.add(this.skyMesh);
    }

    setupClouds() {
        this.clouds = new Cloud(1000)

        const radiusMin = 400
        const radiusMax = 500

        for(let i = 0; i < 100; i++) {

            const theta = Math.random() * Math.PI * 2
            const phi = Math.acos(THREE.MathUtils.randFloat(-1, 1))

            const radius = THREE.MathUtils.randFloat(
                radiusMin,
                radiusMax
            )

            const x = radius * Math.sin(phi) * Math.cos(theta)
            const y = radius * Math.cos(phi)
            const z = radius * Math.sin(phi) * Math.sin(theta)

            const normal = new THREE.Vector3(x, y, z).normalize()

            const rotationY = Math.atan2(normal.x, normal.z)

            this.clouds.spawn(
                x,
                y,
                z,
                rotationY
            )
        }
    }

    destroy() {

        const meshesToRemove = [];
        meshesToRemove.push(this.skyMesh)

        this.scene.traverse((child) => {

            if (
                child.isInstancedMesh &&
                child.userData.sky
            ) {
                meshesToRemove.push(child);
            }

        });

        for (const mesh of meshesToRemove) {

            this.scene.remove(mesh);

            mesh.geometry.dispose();

            if (Array.isArray(mesh.material)) {
                mesh.material.forEach(material => material.dispose());
            } else {
                mesh.material.dispose();
            }
        }
    }
}