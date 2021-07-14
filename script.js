/** @type {HTMLCanvasElement}s*/

// Canvas Setup
const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');

canvas.width = 860;
canvas.height = 600;

let score = 0;
let gameFrame = 0;

ctx.font = '30px Georgia';

// Mouse Interactivity
const mouse = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    click: false
}


canvas.addEventListener('mousedown', function (event) {
    mouse.click = true;
    mouse.x = event.offsetX;
    mouse.y = event.offsetY;
});

canvas.addEventListener('up', function (event) {
    mouse.click = false;
});



// Player
class Player {
    constructor() {
        this.x = canvas.width;
        this.y = canvas.height / 2;
        this.radius = 50;
        this.angle = 0;
        this.frameX = 0;
        this.frameY = 0;
        this.frame = 0;
        this.spriteWidth = 1992 / 4;
        this.spriteHeight = 1635 / 5;
    }

    update() {
        const dx = this.x - mouse.x;
        const dy = this.y - mouse.y;
        this.angle = Math.atan2(dy, dx); // angle of distance between mouse and player

        if (this.x != mouse.x) {
            this.x -= dx / 20 // for speed
        }
        if (this.y != mouse.y) {
            this.y -= dy / 20 // for speed
        }
    }

    draw() {

        if (mouse.click) {
            ctx.lineWidth = 0.2;
            ctx.beginPath();
            ctx.moveTo(this.x, this.y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.stroke();
        }

        ctx.fillStyle = 'red';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();


        ctx.save(); // save canvas sittings
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle); // rotate player according to angle

        if (this.x >= mouse.x) {
            // Img to left
            ctx.drawImage(playerLeft, this.frameX * this.spriteWidth, this.frameY * this.spriteHeight, this.spriteWidth, this.spriteHeight, 0 - 60, 0 - 45, this.spriteWidth / 4, this.spriteHeight / 4)
        } else {
            // Img to right
            ctx.drawImage(playerRight, this.frameX * this.spriteWidth, this.frameY * this.spriteHeight, this.spriteWidth, this.spriteHeight, 0 - 60, 0 - 45, this.spriteWidth / 4, this.spriteHeight / 4)

        }
        ctx.restore();

    }
}

const player = new Player();
const playerLeft = new Image();
playerLeft.src = 'images/red_fish_left.png';
const playerRight = new Image();
playerRight.src = 'images/red_fish_right.png';











// Bubbles 
const bubblesArray = [];

class Bubble {
    constructor() {
        this.radius = Math.random() * 25 + 25;
        this.x = Math.random() * canvas.width;
        this.y = canvas.height + this.radius;
        this.speed = Math.random() * 3 + 1;
        this.distance;
        this.sound = new Audio();
        this.sound.src = 'sounds/bubbles-single2.wav';
    }

    update() {

        this.y -= this.speed;

        const dx = this.x - player.x;
        const dy = this.y - player.y;
        this.distance = Math.sqrt(dx * dx + dy * dy);
    }

    draw() {

        ctx.fillStyle = 'rgba(255,255,255,0.7)';

        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = 'rgba(14,147,213,1)';
        ctx.closePath();
        ctx.stroke();

    }
}

function handleBubble() {

    // Every 50 frames, create new bubble
    if (gameFrame % 100 === 0) {
        bubblesArray.push(new Bubble());
    }

    // call to draw and update bubble
    for (let i = 0; i < bubblesArray.length; i++) {
        bubblesArray[i].update();
        bubblesArray[i].draw();
    }


    for (let i = 0; i < bubblesArray.length; i++) {
        // Remove Bubble from Array when it reach the top of canvas
        if (bubblesArray[i].y + bubblesArray[i].radius < 0) {
            bubblesArray.splice(i, 1);
        }

        // if this bubble is exists
        if (bubblesArray[i]) {
            // Check for collision between player and bubble
            if (bubblesArray[i].distance < bubblesArray[i].radius + player.radius) {
                bubblesArray[i].sound.play()
                score++;
                bubblesArray.splice(i, 1); // remove it when there is collision
            }
        }
    }

}


// Start Animation Loop
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    player.update();
    player.draw();


    ctx.fillStyle = 'black';
    ctx.fillText('score: ' + score, 5, 25);
    handleBubble();

    gameFrame++;
    requestAnimationFrame(animate);
}

animate();