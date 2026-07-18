export default class BoardAssets {
    constructor() {

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