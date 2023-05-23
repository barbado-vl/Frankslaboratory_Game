
export class Player {
    constructor(game) {
        this.game = game;
        // collision circle
        this.collisionX = this.game.width * 0.5;
        this.collisionY = this.game.height * 0.5;
        this.collisionRadius = 30;
        this.speedX = 0;
        this.speedY = 0;
        this.dx = 0;
        this.dy = 0;
        this.speedModifier = 10;
        // sprite image
        this.image = document.getElementById('bull');
        this.spriteWidth = 255;
        this.spriteHeight = 255;
        this.width = this.spriteWidth;
        this.height =  this.spriteHeight;
        this.spriteX;
        this.spriteY;
        this.frameX = 5;
        this.frameY = 7;
    }

    restart() {
        this.collisionX = this.game.width * 0.5;
        this.collisionY = this.game.height * 0.5;
        this.spriteX = this.collisionX - this.width * 0.5;
        this.spriteY = this.collisionY - this.height * 0.5 - 100;
    }

    draw(context) {
        context.drawImage(this.image, this.frameX * this.spriteWidth,
                          this.frameY * this.spriteHeight, this.spriteWidth,
                          this.spriteHeight, this.spriteX, this.spriteY,
                          this.width, this.height);
        if (this.game.debug) {
            context.beginPath();
            context.arc(this.collisionX, this.collisionY,
                        this.collisionRadius, 0, Math.PI * 2);
            context.save();
            context.globalAlpha = 0.5;
            context.fill();
            context.restore();
            context.stroke();
            context.beginPath();
            context.moveTo(this.collisionX, this.collisionY);
            context.lineTo(this.game.mouse.x, this.game.mouse.y);
            context.stroke();
        }
    }

    update() {

        this.dx = this.game.mouse.x - this.collisionX;
        this.dy = this.game.mouse.y - this.collisionY;

        // sprite animation
        const angel = Math.atan2(this.dy, this.dx);
        if (angel < -1.17) this.frameY = 0;
        else if (angel < -0.39) this.frameY = 1;
        else if (angel < 0.39) this.frameY = 2;
        else if (angel < 1.17) this.frameY = 3;
        else if (angel < 1.96) this.frameY = 4;
        else if (angel < 2.74) this.frameY = 5;
        else if (angel < -2.74 || angel > 2.74) this.frameY = 6;
        else if (angel < -1.96) this.frameY = 7;

        // move
        const distance = Math.hypot(this.dy, this.dx);
        if (distance > this.speedModifier) {
            this.speedX = this.dx / distance || 0;
            this.speedY = this.dy / distance || 0;
        }
        else {
            this.speedX = 0;
            this.speedY = 0;
        }
        this.collisionX += this.speedX * this.speedModifier;
        this.collisionY += this.speedY * this.speedModifier;
        this.spriteX = this.collisionX - this.width * 0.5;
        this.spriteY = this.collisionY - this.height * 0.5 - 100;

        // horizontal boundaries
        if (this.collisionX < this.collisionRadius)
            this.collisionX = this.collisionRadius;
        else if (this.collisionX > this.game.width - this.collisionRadius)
            this.collisionX = this.game.width - this.collisionRadius;
        // horizontal boundaries
        if (this.collisionY < 0 + this.game.topMargin + this.collisionRadius)
            this.collisionY = 0 + this.game.topMargin + this.collisionRadius;
        else if (this.collisionY > this.game.height - this.collisionRadius)
            this.collisionY = this.game.height - this.collisionRadius;

        // collision with obstacles
        this.game.obstacles.forEach(obstacle => {
            let [collision, distance, sumOfRadii, dx, dy] = this.game.checkCollision(this, obstacle)
            if (collision) {
                const unit_x = dx / distance;
                const unit_y = dy / distance;
                this.collisionX = obstacle.collisionX + (sumOfRadii + 1) * unit_x;
                this.collisionY = obstacle.collisionY + (sumOfRadii + 1) * unit_y;
            }
        })
    }
}