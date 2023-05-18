import {Player} from './Player.js';

// Logik
export class Game {
    constructor(canvas) {
        this.canvas = canvas;
        this.width = this.canvas.width;
        this.hieght = this.canvas.height;
        this.player = new Player(this);
    }
}