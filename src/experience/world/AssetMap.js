import * as THREE from 'three'

export default class AssetMap {
    constructor(heightMap, assetResolution, heightScale, heightPower) {
        this.heightMap = heightMap
        this.width = heightMap.width / assetResolution
        this.height = heightMap.height / assetResolution
        this.assetResolution = assetResolution
        this.heightScale = heightScale
        this.heightPower = heightPower
        this.data = new Float32Array(
            this.width * this.height
        )
        this.validCells = new Uint8Array(
            this.width * this.height
        )
        this.init()
        this.computeValidCells()
    }

    init() {
        for(let i = 0; i < this.data.length; i++) {
            this.data[i] = 0
        }
    }
    
    computeValidCells() {
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                const height = this.getWorldHeight(
                    this.interpolateHeight(x * this.assetResolution, y * this.assetResolution)
                )
                this.validCells[y * this.width + x] = height <= 0.5 * this.heightScale ? 1 : 0
            }
        }
    }

    randomAssetMap(numberOfAssets) {
        if(numberOfAssets > this.data.length) {
            throw new Error("Numero di asset superiore alle posizioni disponibili")
        }
        let placedAssets = 0
        while(placedAssets < numberOfAssets) {
            const index = Math.floor(Math.random() * this.data.length)
            if(this.data[index] === 0) {
                this.data[index] = 1
                placedAssets++
            }
        }
    }

    forestCluster(numberOfAssets, numberOfForests, forestAssets, radius) {

        let radiusCounter = radius
        let forestsCenters
        while (true) {
            this.init()
            forestsCenters = this.poissonDiskSampling(numberOfForests, radiusCounter)
            if (forestsCenters.length === numberOfForests)
                break
            else
                radiusCounter--
        }

        for(const forestCenter of forestsCenters)
            this.generateTreesAroundForest(forestCenter, (numberOfAssets * forestAssets) / numberOfForests)
        
        this.randomAssetMap(numberOfAssets - numberOfAssets * forestAssets)
    }

    generateTreesAroundForest(forest, numberOfTrees) {
        const radius = 7
        let placed = 0
        while(placed < numberOfTrees) {
            const angle = Math.random() * Math.PI * 2
            const distance = Math.sqrt(Math.random()) * radius
            const x = Math.round(forest.x + Math.cos(angle) * distance)
            const y = Math.round(forest.y + Math.sin(angle) * distance)

            const hx = x * this.assetResolution
            const hy = y * this.assetResolution

            if (this.getWorldHeight(this.interpolateHeight(hx, hy)) < this.heightScale * 0.7){
                this.data[y * this.width + x] = 1
                placed++
            }
        }
    }

    poissonDiskSampling(numberOfForests, radius) {

        const active = []
        const points = []

        const isValid = (x, y) => {
            if (x < 0 || y < 0 || x >= this.width || y >= this.height) {
                return false
            }
            const index = y * this.width + x
            if (!this.validCells[index]) {
                return false
            }
            for (const p of points) {
                const dx = p.x - x
                const dy = p.y - y
                if (dx * dx + dy * dy < radius * radius) {
                    return false
                }
            }
            return true
        }

        // Primo punto
        while (true) {
            const x = Math.floor(Math.random() * this.width)
            const y = Math.floor(Math.random() * this.height)
            if (!isValid(x, y))
                continue
            const point = { x, y }
            points.push(point)
            active.push(point)
            this.data[y * this.width + x] = 1
            break
        }

        const k = 30

        while (active.length && points.length < numberOfForests) {
            const activeIndex = Math.floor(Math.random() * active.length)
            const point = active[activeIndex]
            let found = false
            for (let i = 0; i < k; i++) {
                const angle = Math.random() * Math.PI * 2
                const distance = radius + Math.random() * radius
                const x = Math.round(point.x + Math.cos(angle) * distance)
                const y = Math.round(point.y + Math.sin(angle) * distance)
                if (!isValid(x, y))
                    continue
                const candidate = { x, y }
                points.push(candidate)
                active.push(candidate)
                this.data[y * this.width + x] = 1
                found = true
                break
            }
            if (!found) {
                active.splice(activeIndex, 1)
            }
        }
        return points
    }

    interpolateHeight(startX, startY) {
        let sum = 0;
        for (let y = 0; y < 2; y++) {
            for (let x = 0; x < 2; x++) {
                const hx = startX + x;
                const hy = startY + y;
                const index = hy * this.heightMap.width + hx;
                sum += this.heightMap.data[index];
            }
        }
        return sum / 4;
    }
    
    getWorldHeight(value) {
        const h = THREE.MathUtils.smoothstep(value, 0.2, 0.9)
        return Math.pow(h, this.heightPower) * this.heightScale
    }
}