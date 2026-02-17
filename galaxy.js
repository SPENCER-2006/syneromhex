class Galaxy {
    constructor(targetId) {
        this.target = document.getElementById(targetId);
        if (!this.target) return;
        this.ctx = this.target.getContext("2d");
        this.stars = [];
        this.starCount = 1500; // Dense starfield
        this.init();
    }

    init() {
        this.resize();
        window.addEventListener("resize", () => this.resize());

        // Initialize stars
        for (let i = 0; i < this.starCount; i++) {
            this.stars.push(this.createStar());
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

    createStar() {
        // Create stars at random positions
        return {
            x: Math.random() * this.width,
            y: Math.random() * this.height,
            size: Math.random() * 1.5,
            opacity: Math.random(),
            speed: Math.random() * 0.05 + 0.02, // Very slow rotation
            angle: Math.random() * Math.PI * 2,
            radius: Math.random() * (Math.max(this.width, this.height) * 0.8) // Distance from center
        };
    }

    animate() {
        // Clear with transparent black to leave no trails
        this.ctx.clearRect(0, 0, this.width, this.height);

        // Draw Stars
        this.stars.forEach(star => {
            // Update angle for circular motion
            star.angle += star.speed * 0.01;

            // Calculate new position based on angle and radius
            // We add the center coordinates (cx, cy) to pivot around the center
            const x = this.cx + Math.cos(star.angle) * star.radius;
            const y = this.cy + Math.sin(star.angle) * star.radius;

            this.ctx.beginPath();
            this.ctx.arc(x, y, star.size, 0, Math.PI * 2);
            this.ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
            this.ctx.fill();
        });

        requestAnimationFrame(() => this.animate());
    }
}

// Start effect
new Galaxy("galaxy-canvas");
