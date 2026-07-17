import { useEffect, useRef } from 'react';

export default function CursedParticles({ active, shockwaveForce }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!active) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let particles = [];

    const resizeCanvas = () => {
      if (!canvas) return;
      canvas.width = canvas.parentElement.clientWidth;
      canvas.height = canvas.parentElement.clientHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Particle class simulating dark cursed energy
    class Particle {
      constructor() {
        this.reset();
        // Distribute vertically at start
        this.y = Math.random() * canvas.height;
      }

      reset() {
        this.x = Math.random() * canvas.width;
        this.y = canvas.height + Math.random() * 20;
        this.size = Math.random() * 3 + 1.5;
        this.speedY = Math.random() * 1.8 + 0.6; // upward speed
        this.speedX = Math.random() * 0.8 - 0.4;
        this.angle = Math.random() * Math.PI * 2;
        this.angleSpeed = Math.random() * 0.04 - 0.02;
        this.opacity = Math.random() * 0.6 + 0.3;
        
        // Cursed energy colors: neon purple, toxic green, and crimson red
        const colors = [
          'rgba(188, 19, 254, ', // #bc13fe
          'rgba(57, 255, 20, ',  // #39ff14
          'rgba(255, 7, 58, '    // #ff073a
        ];
        this.colorPrefix = colors[Math.floor(Math.random() * colors.length)];
      }

      update(mx, my, shockwave) {
        this.y -= this.speedY;
        this.x += this.speedX + Math.sin(this.angle) * 0.4;
        this.angle += this.angleSpeed;

        // Reset if float off screen
        if (this.y < -15) {
          this.reset();
        }

        // React to shockwaves (push radially outwards from center)
        if (shockwave > 0) {
          const centerX = canvas.width / 2;
          const centerY = canvas.height / 2;
          const dx = this.x - centerX;
          const dy = this.y - centerY;
          const dist = Math.sqrt(dx * dx + dy * dy) || 1;
          const force = (shockwave / dist) * 18;
          this.x += (dx / dist) * force;
          this.y += (dy / dist) * force;
        }

        // React to mouse cursor (drift away)
        if (mx !== undefined && my !== undefined) {
          const dx = this.x - mx;
          const dy = this.y - my;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 140) {
            const push = (140 - dist) / 140 * 2.0;
            this.x += (dx / dist) * push;
            this.y += (dy / dist) * push;
          }
        }
      }

      draw() {
        ctx.beginPath();
        // Glow radial gradient
        const grad = ctx.createRadialGradient(
          this.x, this.y, 0,
          this.x, this.y, this.size * 2.2
        );
        grad.addColorStop(0, this.colorPrefix + this.opacity + ')');
        grad.addColorStop(0.5, this.colorPrefix + (this.opacity * 0.4) + ')');
        grad.addColorStop(1, this.colorPrefix + '0)');
        
        ctx.fillStyle = grad;
        ctx.arc(this.x, this.y, this.size * 2.2, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Initialize particles list
    const maxParticles = 50;
    for (let i = 0; i < maxParticles; i++) {
      particles.push(new Particle());
    }

    let mouseX = undefined;
    let mouseY = undefined;
    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
    };
    
    const parent = canvas.parentElement;
    parent.addEventListener('mousemove', handleMouseMove);

    // Frame runner
    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      for (let i = 0; i < particles.length; i++) {
        particles[i].update(mouseX, mouseY, shockwaveForce);
        particles[i].draw();
      }
      
      animationFrameId = requestAnimationFrame(render);
    };
    render();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (parent) {
        parent.removeEventListener('mousemove', handleMouseMove);
      }
      cancelAnimationFrame(animationFrameId);
    };
  }, [active, shockwaveForce]);

  if (!active) return null;

  return (
    <canvas 
      ref={canvasRef} 
      className="absolute inset-0 pointer-events-none z-10 w-full h-full"
    />
  );
}
