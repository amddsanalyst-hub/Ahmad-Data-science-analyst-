/**
 * Interactive Data Network Particle Canvas for Ahmad Dawood Portfolio
 * Simulates real-time data pipelines, graph nodes, and interactive cursor connections
 */

class DataNetworkCanvas {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
    this.packetList = [];
    this.particleCount = 55;
    this.maxDistance = 140;
    this.mouse = { x: null, y: null, radius: 160 };
    this.animationFrameId = null;

    this.init();
  }

  init() {
    this.resize();
    window.addEventListener('resize', () => this.resize());

    window.addEventListener('mousemove', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      this.mouse.x = e.clientX - rect.left;
      this.mouse.y = e.clientY - rect.top;
    });

    window.addEventListener('mouseleave', () => {
      this.mouse.x = null;
      this.mouse.y = null;
    });

    this.createParticles();
    this.animate();
  }

  resize() {
    const parent = this.canvas.parentElement;
    this.width = this.canvas.width = parent.clientWidth;
    this.height = this.canvas.height = parent.clientHeight;
    this.particleCount = Math.floor((this.width * this.height) / 16000);
    if (this.particleCount < 30) this.particleCount = 30;
    if (this.particleCount > 80) this.particleCount = 80;
    this.createParticles();
  }

  createParticles() {
    this.particles = [];
    const colors = [
      'rgba(56, 189, 248, ', // Sky blue
      'rgba(0, 242, 254, ',   // Cyan
      'rgba(99, 102, 241, ',  // Indigo
      'rgba(245, 158, 11, '   // Gold highlight
    ];

    for (let i = 0; i < this.particleCount; i++) {
      const colorBase = colors[Math.floor(Math.random() * (i % 7 === 0 ? 4 : 3))];
      this.particles.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        vx: (Math.random() - 0.5) * 0.7,
        vy: (Math.random() - 0.5) * 0.7,
        radius: Math.random() * 2.2 + 1.2,
        colorBase: colorBase,
        alpha: Math.random() * 0.5 + 0.3,
        pulseSpeed: Math.random() * 0.02 + 0.01,
        pulsePhase: Math.random() * Math.PI * 2
      });
    }
  }

  animate() {
    this.ctx.clearRect(0, 0, this.width, this.height);

    // Update and draw particles
    for (let i = 0; i < this.particles.length; i++) {
      const p = this.particles[i];

      p.x += p.vx;
      p.y += p.vy;

      // Bounce off walls
      if (p.x < 0 || p.x > this.width) p.vx *= -1;
      if (p.y < 0 || p.y > this.height) p.vy *= -1;

      // Mouse interaction
      if (this.mouse.x !== null && this.mouse.y !== null) {
        const dx = this.mouse.x - p.x;
        const dy = this.mouse.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < this.mouse.radius) {
          const force = (1 - dist / this.mouse.radius) * 0.6;
          p.x += (dx / dist) * force;
          p.y += (dy / dist) * force;
        }
      }

      // Pulse alpha
      p.pulsePhase += p.pulseSpeed;
      const currentAlpha = p.alpha + Math.sin(p.pulsePhase) * 0.15;

      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      this.ctx.fillStyle = `${p.colorBase}${Math.max(0.1, currentAlpha)})`;
      this.ctx.shadowBlur = 8;
      this.ctx.shadowColor = p.colorBase + '0.8)';
      this.ctx.fill();
      this.ctx.shadowBlur = 0; // reset
    }

    // Connect particles
    for (let i = 0; i < this.particles.length; i++) {
      for (let j = i + 1; j < this.particles.length; j++) {
        const p1 = this.particles[i];
        const p2 = this.particles[j];
        const dx = p1.x - p2.x;
        const dy = p1.y - p2.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < this.maxDistance) {
          const opacity = (1 - dist / this.maxDistance) * 0.25;
          this.ctx.beginPath();
          this.ctx.moveTo(p1.x, p1.y);
          this.ctx.lineTo(p2.x, p2.y);
          this.ctx.strokeStyle = `rgba(56, 189, 248, ${opacity})`;
          this.ctx.lineWidth = 0.9;
          this.ctx.stroke();

          // Occasionally spawn a moving packet along edges
          if (Math.random() < 0.0004 && this.packetList.length < 8) {
            this.packetList.push({
              p1, p2, progress: 0, speed: Math.random() * 0.015 + 0.01
            });
          }
        }
      }
    }

    // Draw and update active packets
    for (let i = this.packetList.length - 1; i >= 0; i--) {
      const pkt = this.packetList[i];
      pkt.progress += pkt.speed;

      if (pkt.progress >= 1) {
        this.packetList.splice(i, 1);
        continue;
      }

      const curX = pkt.p1.x + (pkt.p2.x - pkt.p1.x) * pkt.progress;
      const curY = pkt.p1.y + (pkt.p2.y - pkt.p1.y) * pkt.progress;

      this.ctx.beginPath();
      this.ctx.arc(curX, curY, 2.5, 0, Math.PI * 2);
      this.ctx.fillStyle = '#00f2fe';
      this.ctx.shadowBlur = 10;
      this.ctx.shadowColor = '#00f2fe';
      this.ctx.fill();
      this.ctx.shadowBlur = 0;
    }

    // Connect to mouse
    if (this.mouse.x !== null && this.mouse.y !== null) {
      for (let i = 0; i < this.particles.length; i++) {
        const p = this.particles[i];
        const dx = this.mouse.x - p.x;
        const dy = this.mouse.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < this.mouse.radius) {
          const opacity = (1 - dist / this.mouse.radius) * 0.45;
          this.ctx.beginPath();
          this.ctx.moveTo(p.x, p.y);
          this.ctx.lineTo(this.mouse.x, this.mouse.y);
          this.ctx.strokeStyle = `rgba(0, 242, 254, ${opacity})`;
          this.ctx.lineWidth = 1.2;
          this.ctx.stroke();
        }
      }
    }

    this.animationFrameId = requestAnimationFrame(() => this.animate());
  }

  destroy() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
  }
}

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('hero-canvas')) {
    new DataNetworkCanvas('hero-canvas');
  }
});