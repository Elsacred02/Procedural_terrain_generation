import Experience from "../Experience"
import * as THREE from 'three'
import Board from "./Board"
import Lightning from "./Lightning"

export default class World{

    constructor(){

        this.experience = new Experience()
        this.scene = this.experience.scene

        // Lights
        this.lights = new Lightning()

        // Board
        this.board = new Board()

    }

    update(){
        
    }
}