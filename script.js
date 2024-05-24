const canvas = document.getElementById('particleCanvas');
const ctx = canvas.getContext('2d');
let particlesArray = [];
const numberOfParticles = 70; // Reduced number of particles
const avoidArea = {
    x: window.innerWidth / 2 - 200, // Larger avoid area
    y: window.innerHeight / 2 - 150, // Larger avoid area
    width: 400, // Larger avoid area
    height: 300, // Larger avoid area
};

// Set canvas to full screen
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    avoidArea.x = window.innerWidth / 2 - 200;
    avoidArea.y = window.innerHeight / 2 - 150;
    createParticles();
});

const mouse = {
    x: null,
    y: null,
};

canvas.addEventListener('mousemove', (event) => {
    mouse.x = event.x;
    mouse.y = event.y;
});

class Particle {
    constructor(x, y, directionX, directionY, size, color) {
        this.x = x;
        this.y = y;
        this.directionX = directionX;
        this.directionY = directionY;
        this.size = size;
        this.color = color;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color;
        ctx.fill();
    }

    update() {
        // Change direction if particles hit the edges
        if (this.x > canvas.width || this.x < 0) {
            this.directionX = -this.directionX;
        }
        if (this.y > canvas.height || this.y < 0) {
            this.directionY = -this.directionY;
        }

        // Smoothly avoid the center area
        const centerX = avoidArea.x + avoidArea.width / 2;
        const centerY = avoidArea.y + avoidArea.height / 2;
        const distX = centerX - this.x;
        const distY = centerY - this.y;
        const distance = Math.sqrt(distX * distX + distY * distY);
        const maxDistance = 200; // Increased distance threshold for avoidance

        if (distance < maxDistance) {
            const angle = Math.atan2(distY, distX);
            const moveDistance = (maxDistance - distance) / maxDistance;
            this.directionX -= Math.cos(angle) * moveDistance * 0.05;
            this.directionY -= Math.sin(angle) * moveDistance * 0.05;
        }

        // Move particles
        this.x += this.directionX * 0.5; // Reduced speed
        this.y += this.directionY * 0.5; // Reduced speed

        this.draw();
    }
}

function createParticles() {
    particlesArray = [];
    for (let i = 0; i < numberOfParticles; i++) {
        let size = (Math.random() * 2) + 1; // Smaller particles
        let x = (Math.random() * ((window.innerWidth - size * 2) - (size * 2)) + size * 2);
        let y = (Math.random() * ((window.innerHeight - size * 2) - (size * 2)) + size * 2);
        let directionX = (Math.random() * 2) - 1; // Reduced speed range
        let directionY = (Math.random() * 2) - 1; // Reduced speed range
        let color = 'rgb(255, 198, 254)';

        particlesArray.push(new Particle(x, y, directionX, directionY, size, color));
    }
}

function connect() {
    let opacityValue = 1;
    for (let a = 0; a < particlesArray.length; a++) {
        for (let b = a; b < particlesArray.length; b++) {
            let distance = ((particlesArray[a].x - particlesArray[b].x) * (particlesArray[a].x - particlesArray[b].x))
                + ((particlesArray[a].y - particlesArray[b].y) * (particlesArray[a].y - particlesArray[b].y));
            if (distance < (canvas.width / 7) * (canvas.height / 7)) {
                opacityValue = 1 - (distance / 20000);
                ctx.strokeStyle = 'rgba(255,198,254,' + opacityValue + ')';
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                ctx.stroke();
            }
        }
    }
}

function animate() {
    requestAnimationFrame(animate);
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

    for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
    }
    connect();
}

createParticles();
animate();
