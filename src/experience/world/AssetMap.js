export default class AssetMap {
    constructor(heightMap, vertexRatio) {
        this.heightMap = heightMap
        this.vertexRatio = vertexRatio
        this.data = new Float32Array(
            (heightMap.width / 4) * (heightMap.height / 4)
        )
        this.init()
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
                // valore casuale tra 1 e 10
                this.data[index] = Math.floor(Math.random() * 10) + 1
                placedAssets++
            }
        }

        return this.data
    }
}