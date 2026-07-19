export default class AssetMap {
    constructor(heightMap, assetResolution, numberOfAssets) {
        this.heightMap = heightMap
        this.width = heightMap.width / assetResolution
        this.height = heightMap.height / assetResolution
        this.data = new Float32Array(
            this.width * this.height
        )
        this.init()
        this.data = this.randomAssetMap(numberOfAssets)
    }

    init() {
        for(let i = 0; i < this.data.length; i++) {
            this.data[i] = 0
        }
    }

    randomAssetMap(numberOfAssets) {
        if(numberOfAssets > this.data.length) {
            throw new Error("Numero di asset superiore alle posizioni disponibili")
        }

        let placedAssets = 0

        while(placedAssets < numberOfAssets) {
            // scegli una posizione casuale
            const index = Math.floor(Math.random() * this.data.length)

            // se la posizione è vuota, inserisci l'asset
            if(this.data[index] === 0) {
                this.data[index] = 1
                placedAssets++
            }
        }

        return this.data
    }
}