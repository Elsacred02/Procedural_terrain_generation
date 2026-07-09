import EventEmitter from './EventEmitter'

export default class Sizes extends EventEmitter{

    constructor() {

        super()

        // Parameters
        this.width = window.innerWidth + 1
        this.height = window.innerHeight + 1
        this.pixelRatio = Math.min(window.devicePixelRatio, 2)

        // Events
        window.addEventListener('resize', () => {
            // Update sizes
            this.width = window.innerWidth + 1
            this.height = window.innerHeight + 1
            this.pixelRatio = Math.min(window.devicePixelRatio, 2)

            this.trigger('resize')
        })
    }
}