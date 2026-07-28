export default class WFC{
    constructor(matrixSize, defaultMatrix) {
        this.defaultMatrix = defaultMatrix
        this.defaultMatrixSize = Math.sqrt(defaultMatrix.length)
        this.matrixSize = matrixSize

        this.initCellsAndMatrix()
        this.extractRules()
        this.buildMatrix()
    }

    initCellsAndMatrix() {
        this.data = new Uint8Array(
            this.matrixSize * this.matrixSize
        )
        this.cells = Array.from(
            { length: this.matrixSize * this.matrixSize },
            () => new Set([0,1,2,3])
        )
    }

    extractRules() {
        this.rules = new Map();

        const directions = [
            { name: "up",    dx: -1, dy:  0 },
            { name: "right", dx:  0, dy:  1 },
            { name: "down",  dx:  1, dy:  0 },
            { name: "left",  dx:  0, dy: -1 }
        ];

        for (let i = 0; i < this.defaultMatrixSize; i++) {
            for (let j = 0; j < this.defaultMatrixSize; j++) {

                const index = i * this.defaultMatrixSize + j;
                const tile = this.defaultMatrix[index];

                if (!this.rules.has(tile)) {
                    this.rules.set(tile, {
                        up: new Set(),
                        right: new Set(),
                        down: new Set(),
                        left: new Set()
                    });
                }

                const rule = this.rules.get(tile);

                for (const dir of directions) {

                    const ni = i + dir.dx;
                    const nj = j + dir.dy;

                    if (
                        ni < 0 ||
                        ni >= this.defaultMatrixSize ||
                        nj < 0 ||
                        nj >= this.defaultMatrixSize
                    ) {
                        continue;
                    }

                    const neighbour =
                        this.defaultMatrix[ni * this.defaultMatrixSize + nj];

                    rule[dir.name].add(neighbour);
                }
            }
        }
    }

    buildMatrix() {

        const startIndex = this.chooseVillageCenter()
        this.propagate(startIndex)

        while(!this.isSolved()) {
            const index = this.chooseLowestEntropy()
            this.collapse(index)
            this.propagate(index)
        }

        for(let i = 0; i < this.cells.length; i++) {

            const value = [...this.cells[i]][0]

            this.data[i] = value
        }
    }

    chooseVillageCenter () {
        const indexCenterVillage = Math.floor(Math.random() * Math.pow(this.matrixSize, 2))
        this.data[indexCenterVillage] = 1
        this.cells[indexCenterVillage] = new Set([1])

        return indexCenterVillage
    }

    propagate(index) {

        const queue = [index]

        const directions = {
            up: {di: -1, dj: 0},
            right: {di: 0, dj: 1},
            down: {di: 1, dj: 0},
            left: {di: 0, dj: -1}
        }

        while(queue.length > 0) {

            const currentIndex = queue.shift()
            const currentOptions = this.cells[currentIndex]

            const currentRow = Math.floor(currentIndex / this.matrixSize)
            const currentCol = currentIndex % this.matrixSize

            for (const direction in directions) {

                const {di, dj} = directions[direction]

                const neighbourRow = currentRow + di
                const neighbourCol = currentCol + dj

                if(
                    neighbourRow < 0 ||
                    neighbourRow >= this.matrixSize ||
                    neighbourCol < 0 ||
                    neighbourCol >= this.matrixSize
                ) {
                    continue
                }

                const neighbourIndex = neighbourRow * this.matrixSize + neighbourCol
                const neighbourOptions = this.cells[neighbourIndex]
                const allowed = new Set()

                for(const option of currentOptions) {
                    const rule = this.rules.get(option)
                    for(const possible of rule[direction]) {
                        allowed.add(possible)
                    }
                }

                let changed = false
                for(const option of neighbourOptions) {
                    if(!allowed.has(option)) {
                        neighbourOptions.delete(option)
                        changed = true
                    }
                }

                if(changed) {
                    queue.push(neighbourIndex)
                }
            }
        }
    }

    chooseLowestEntropy() {

        let lowestEntropy = Infinity
        let candidates = []

        for(let i = 0; i < this.cells.length; i++) {
            const entropy = this.cells[i].size

            if(entropy <= 1)
                continue

            if(entropy < lowestEntropy) {
                lowestEntropy = entropy
                candidates = [i]

            } else if(entropy === lowestEntropy) {
                candidates.push(i)
            }
        }

        if(candidates.length === 0)
            return -1

        return candidates[Math.floor(Math.random() * candidates.length)]
    }

    collapse(index) {

        const options = [...this.cells[index]]

        if(options.length === 0) {
            throw new Error("Contradiction: cell has no options")
        }

        const choice = options[Math.floor(Math.random() * options.length)]

        this.cells[index] = new Set([choice])
        this.data[index] = choice
    }

    isSolved() {
        for(const cell of this.cells) {
            if(cell.size !== 1)
                return false
        }
        return true
    }
}