class WarpSpeed {
    constructor(targetId) {
        this.target = document.getElementById(targetId);
        if (!this.target) return;
        this.ctx = this.target.getContext("2d");
        this.stars = [];
        this.speed = 50; // Speed of the stars
        this.starCount = 2000;
        this.init();
    }

    init() {
        this.resize();
        window.addEventListener("resize", () => this.resize());

        // Initialize stars
        for (let i = 0; i < this.starCount; i++) {
            this.stars.push(this.createStar(true));
        }

        this.animate();
    }

    resize() {
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.target.width = this.width;
        this.target.height = this.height;
        this.cx = this.width / 2;
        this.cy = this.height / 2;
    }

    createStar(randomZ = false) {
        return {
            x: (Math.random() - 0.5) * this.width * 2, // Spread wide
            y: (Math.random() - 0.5) * this.height * 2,
            z: randomZ ? Math.random() * 1000 : 1000, // Depth
            radius: Math.random() * 1.5,
            color: this.getRandomColor()
        };
    }

    getRandomColor() {
        const colors = ["#ffffff", "#ffe9c4", "#d4fbff"]; // White, warm white, blueish
        return colors[Math.floor(Math.random() * colors.length)];
    }

    animate() {
        this.ctx.fillStyle = "rgba(5, 5, 5, 0.4)"; // Trails effect (blur)
        this.ctx.fillRect(0, 0, this.width, this.height);

        this.stars.forEach((star, index) => {
            // Move star towards screen
            star.z -= this.speed;

            // Reset star if it passes the screen
            if (star.z <= 1) {
                this.stars[index] = this.createStar();
                star.z = 1000;
            }

            // Project 3D coordinates to 2D
            const scale = 500 / star.z;
            const x2d = this.cx + star.x * scale;
            const y2d = this.cy + star.y * scale;

            // Draw current star
            // Size increases as it gets closer
            const size = star.radius * scale;

            // Draw the streak (simple motion blur)
            // We calculate previous position to draw a line
            const prevScale = 500 / (star.z + this.speed * 2);
            const prevX = this.cx + star.x * prevScale;
            const prevY = this.cy + star.y * prevScale;

            this.ctx.beginPath();
            this.ctx.moveTo(prevX, prevY);
            this.ctx.lineTo(x2d, y2d);
            this.ctx.strokeStyle = `rgba(255, 255, 255, ${Math.min(1, scale)})`;
            this.ctx.lineWidth = size;
            this.ctx.stroke();
        });

        requestAnimationFrame(() => this.animate());
    }
}

// Start effect
new WarpSpeed("warpspeed");
