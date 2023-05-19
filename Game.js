import {Player} from './Player.js';
import {Obstacle} from './Obstacle.js';
import {Egg} from './Egg.js';

// Logik
export class Game {
    constructor(canvas) {
        this.canvas = canvas;
        this.width = this.canvas.width;
        this.height = this.canvas.height;
        this.topMargin = 200;
        this.debug = true;
        this.fps = 60;
        this.timer = 0;
        this.interval = 1000/this.fps;

        this.player = new Player(this);
        this.numberOfObstacles = 7;
        this.obstacles = [];

        this.maxEggs = 10;
        this.eggs = [];
        this.eggTimer = 0;
        this.eggInterval = 500;

        this.mouse = {
            x: this.width * 0.5,
            y: this.hieght * 0.5,
            pressed: false
        };

        // events listeners
        canvas.addEventListener('mousedown', e => {
            this.mouse.x = e.offsetX;
            this.mouse.y = e.offsetY;
            this.mouse.pressed = true;
        });
        canvas.addEventListener('mouseup', e => {
            this.mouse.x = e.offsetX;
            this.mouse.y = e.offsetY;
            this.mouse.pressed = false;
        });
        canvas.addEventListener('mousemove', e => {
            if (this.mouse.pressed) {
                this.mouse.x = e.offsetX;
                this.mouse.y = e.offsetY;
            }
        });
        window.addEventListener('keydown', e => {
            if (e.key == 'd') this.debug = !this.debug;
        });
    }

    render(context, deltaTime) {
        if (this.timer > this.interval) {
            context.clearRect(0, 0, this.width, this.height);
            this.obstacles.forEach(obstacle => obstacle.draw(context));
            this.eggs.forEach(egg => {
                egg.draw(context),
                egg.update();
            });
            this.player.draw(context);
            this.player.update();
            this.timer = 0;
        }
        this.timer += deltaTime;

        // add eggs periodically
        if (this.eggTimer > this.eggInterval && this.eggs.length < this.maxEggs) {
            this.addEgg();
            this.eggTimer = 0;
            console.log(this.eggs)
        } else  {
            this.eggTimer += deltaTime;
        }
    }

    checkCollision(a, b) {
        const dx = a.collisionX - b.collisionX;
        const dy = a.collisionY - b.collisionY;
        const distance = Math.hypot(dy, dx);
        const sumOfRadii = a.collisionRadius + b.collisionRadius;
        return [(distance < sumOfRadii), distance, sumOfRadii, dx, dy];
    }

    addEgg() {
        this.eggs.push(new Egg(this));
    }



    init() {
        let attempts = 0;
        while (this.obstacles.length < this.numberOfObstacles && attempts < 500) {
            let testObstacle = new Obstacle(this);
            let overlap = false;
            this.obstacles.forEach(obstacle => {
                const dx = testObstacle.collisionX - obstacle.collisionX;
                const dy = testObstacle.collisionY - obstacle.collisionY;
                const distance = Math.hypot(dy, dx);
                const distanceBuffer = 150;
                const sumOfRadii = testObstacle.collisionRadius 
                                 + obstacle.collisionRadius
                                 + distanceBuffer;
                if (distance < sumOfRadii) {
                    overlap = true;
                }
            });
            const margin = testObstacle.collisionRadius * 3;
            if (!overlap
                && testObstacle.spriteX > 0
                && testObstacle.spriteX < this.width - testObstacle.width
                && testObstacle.collisionY > margin + this.topMargin
                && testObstacle.collisionY < this.height - margin) {
                this.obstacles.push(testObstacle);
            }
            attempts++;
        }
    }
}