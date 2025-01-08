class FireEffect {
    constructor() {
        this.canvas = document.getElementById('fireCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.resize();
        
        // Increased particle count and adjusted parameters
        this.particles = [];
        this.particleCount = 500; // Increased from 350
        this.baseHue = 15;
        
        this.initParticles();
        this.animate();
        
        window.addEventListener('resize', () => this.resize());
    }
    
    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
    
    initParticles() {
        for (let i = 0; i < this.particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: this.canvas.height + Math.random() * 20,
                size: Math.random() * 3 + 1, // Slightly larger particles
                speedY: Math.random() * -4 - 2, // Faster upward speed
                speedX: Math.random() * 2 - 1,
                life: 1.5, // Increased life duration
                hue: this.baseHue + Math.random() * 15
            });
        }
    }
    
    updateParticle(particle) {
        particle.x += particle.speedX;
        particle.y += particle.speedY;
        particle.life -= 0.008; // Slower life decrease
        
        // Reset particle when it dies or goes off screen
        if (particle.life <= 0 || particle.y < -50) { // Allow particles to go slightly off-screen
            particle.x = Math.random() * this.canvas.width;
            particle.y = this.canvas.height + Math.random() * 20;
            particle.life = 1.5;
            particle.hue = this.baseHue + Math.random() * 15;
        }
        
        particle.speedX += (Math.random() - 0.5) * 0.1;
        particle.speedX = Math.min(Math.max(particle.speedX, -2), 2);
    }
    
    drawParticle(particle) {
        this.ctx.beginPath();
        const gradient = this.ctx.createRadialGradient(
            particle.x, particle.y, 0,
            particle.x, particle.y, particle.size * 2
        );
        
        const alpha = particle.life * 0.6;
        gradient.addColorStop(0, `hsla(${particle.hue}, 100%, 50%, ${alpha})`);
        gradient.addColorStop(1, `hsla(${particle.hue}, 100%, 50%, 0)`);
        
        this.ctx.fillStyle = gradient;
        this.ctx.arc(particle.x, particle.y, particle.size * 2, 0, Math.PI * 2);
        this.ctx.fill();
    }
    
    animate() {
        // Clear canvas with a slight fade effect
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Update and draw particles
        this.particles.forEach(particle => {
            this.updateParticle(particle);
            this.drawParticle(particle);
        });
        
        requestAnimationFrame(() => this.animate());
    }
}

// Initialize the fire effect when the document is ready
document.addEventListener('DOMContentLoaded', () => {
    new FireEffect();
}); 