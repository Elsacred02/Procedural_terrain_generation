import Tree from './Tree'
import Rock from './Rock'

export default [
    {
        heightRange: {min: 0, max: 0.1},
        assets:[
            {
                name: "oak_tree",
                class: Tree,
                species: "oak",
                scale: 1,
                positionOffset: 0,
                probability: 0.7
            },
            {
                name: "big_oak_tree",
                class: Tree,
                species: "big_oak",
                scale: 1,
                positionOffset: 0,
                probability: 0.3
            }
        ]
    },
    {
        heightRange: {min: 0.1, max: 0.75},
        assets: [
            {
                name: "spruce_tree",
                class: Tree,
                species: "spruce",
                scale: 2,
                positionOffset: -0.5,
                probability: 1
            }
        ]
    },
    {
        heightRange: {min: 0.75, max: 1},
        assets: [
            {
                name: "rock",
                class: Rock,
                scale: 4,
                positionOffset: -0.2,
                probability: 1
            }
        ]
    }
]