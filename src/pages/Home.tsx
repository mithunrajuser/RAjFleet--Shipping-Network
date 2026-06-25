import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

interface Point {
  x: number;
  y: number;
}

export default function Home() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const journeyCanvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    // ── PARTICLE NETWORK BACKGROUND ──
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    let W = window.innerWidth;
    let H = window.innerHeight;
    canvas.width = W;
    canvas.height = H;

    const particles: Particle[] = [];
    const NUM = 80;
    const CONNECT_DIST = 120;
    const MOUSE = { x: -999, y: -999 };

    function resize() {
      if (!canvas) return;
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resize);

    const handleMouseMove = (e: MouseEvent) => {
      MOUSE.x = e.clientX;
      MOUSE.y = e.clientY;
    };
    window.addEventListener('mousemove', handleMouseMove);

    class Particle {
      x!: number;
      y!: number;
      vx!: number;
      vy!: number;
      r!: number;
      alpha!: number;

      constructor() {
        this.reset();
      }

      reset() {
        this.x = Math.random() * W;
        this.y = Math.random() * H;
        this.vx = (Math.random() - .5) * .4;
        this.vy = (Math.random() - .5) * .4;
        this.r = Math.random() * 1.5 + .5;
        this.alpha = Math.random() * .5 + .2;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;
        if (this.x < 0 || this.x > W) this.vx *= -1;
        if (this.y < 0 || this.y > H) this.vy *= -1;
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(79,142,247,${this.alpha})`;
        ctx.fill();
      }
    }

    for (let i = 0; i < NUM; i++) {
      particles.push(new Particle());
    }

    let animationFrameId: number;
    function loop() {
      ctx.clearRect(0, 0, W, H);
      particles.forEach(p => {
        p.update();
        p.draw();
      });

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i];
          const b = particles[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < CONNECT_DIST) {
            const alpha = (1 - dist / CONNECT_DIST) * 0.18;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = `rgba(43,109,234,${alpha})`;
            ctx.lineWidth = .8;
            ctx.stroke();
          }
        }

        // mouse attract
        const dx = particles[i].x - MOUSE.x;
        const dy = particles[i].y - MOUSE.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 100) {
          const alpha = (1 - dist / 100) * 0.35;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(MOUSE.x, MOUSE.y);
          ctx.strokeStyle = `rgba(6,182,212,${alpha})`;
          ctx.lineWidth = .6;
          ctx.stroke();
        }
      }
      animationFrameId = requestAnimationFrame(loop);
    }
    loop();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  useEffect(() => {
    // ── JOURNEY CANVAS ANIMATION ──
    const canvas = journeyCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    let W: number;
    let H: number;
    let progress = 0;
    let started = false;

    // Waypoints (normalized 0-1 for responsive)
    const waypointsNorm = [
      { x: .04, y: .55 },
      { x: .25, y: .25 },
      { x: .5,  y: .65 },
      { x: .75, y: .25 },
      { x: .96, y: .45 },
    ];
    const stepDelays = [0, 0.18, 0.4, 0.65, 0.88];

    function resize() {
      if (!canvas) return;
      const wrap = canvas.parentElement;
      if (!wrap) return;
      W = canvas.width = wrap.offsetWidth;
      H = canvas.height = wrap.offsetHeight || 240;
    }
    resize();

    const handleResize = () => {
      resize();
      if (!started) draw(0);
    };
    window.addEventListener('resize', handleResize);

    function getWaypoints(): Point[] {
      return waypointsNorm.map(p => ({ x: p.x * W, y: p.y * H }));
    }

    function catmullRomPoint(pts: Point[], t: number): Point {
      const n = pts.length - 1;
      const seg = Math.min(Math.floor(t * n), n - 1);
      const lt = (t * n) - seg;
      const p0 = pts[Math.max(seg - 1, 0)];
      const p1 = pts[seg];
      const p2 = pts[Math.min(seg + 1, n)];
      const p3 = pts[Math.min(seg + 2, n)];
      const t2 = lt * lt;
      const t3 = lt * lt * lt;
      return {
        x: .5 * ((2 * p1.x) + (p2.x - p0.x) * lt + (2 * p0.x - 5 * p1.x + 4 * p2.x - p3.x) * t2 + (3 * p1.x - p0.x - 3 * p2.x + p3.x) * t3),
        y: .5 * ((2 * p1.y) + (p2.y - p0.y) * lt + (2 * p0.y - 5 * p1.y + 4 * p2.y - p3.y) * t2 + (3 * p1.y - p0.y - 3 * p2.y + p3.y) * t3)
      };
    }

    function draw(prog: number) {
      if (!canvas) return;
      ctx.clearRect(0, 0, W, H);
      const wps = getWaypoints();

      // ── Ghost track (full dashed) ──
      ctx.save();
      ctx.beginPath();
      for (let i = 0; i <= 100; i++) {
        const pt = catmullRomPoint(wps, i / 100);
        if (i === 0) ctx.moveTo(pt.x, pt.y);
        else ctx.lineTo(pt.x, pt.y);
      }
      ctx.strokeStyle = 'rgba(255,255,255,0.05)';
      ctx.lineWidth = 2;
      ctx.setLineDash([6, 10]);
      ctx.stroke();
      ctx.restore();

      if (prog <= 0) return;

      // ── Glow track (full progress) ──
      ctx.save();
      ctx.beginPath();
      for (let i = 0; i <= Math.round(prog * 100); i++) {
        const pt = catmullRomPoint(wps, i / 100);
        if (i === 0) ctx.moveTo(pt.x, pt.y);
        else ctx.lineTo(pt.x, pt.y);
      }
      const gradEnd = catmullRomPoint(wps, prog);
      const grad = ctx.createLinearGradient(wps[0].x, wps[0].y, gradEnd.x, gradEnd.y);
      grad.addColorStop(0, 'rgba(43,109,234,0.4)');
      grad.addColorStop(.5, 'rgba(6,182,212,0.6)');
      grad.addColorStop(1, 'rgba(251,146,60,0.8)');
      ctx.strokeStyle = grad;
      ctx.lineWidth = 3;
      ctx.setLineDash([]);
      ctx.shadowBlur = 14;
      ctx.shadowColor = 'rgba(6,182,212,0.5)';
      ctx.stroke();
      ctx.restore();

      // ── Waypoint dots ──
      wps.forEach((wp, i) => {
        if (prog < stepDelays[i]) return;
        const a = Math.min((prog - stepDelays[i]) / 0.06, 1);
        // outer ring
        ctx.save();
        ctx.beginPath();
        ctx.arc(wp.x, wp.y, 14 * a, 0, Math.PI * 2);
        const colors = ['rgba(43,109,234', 'rgba(139,92,246', 'rgba(6,182,212', 'rgba(249,115,22', 'rgba(34,197,94'];
        ctx.strokeStyle = colors[i] + ',' + (.3 * a) + ')';
        ctx.lineWidth = 1.5;
        ctx.stroke();
        ctx.restore();
        // inner dot
        ctx.save();
        ctx.beginPath();
        ctx.arc(wp.x, wp.y, 6 * a, 0, Math.PI * 2);
        ctx.fillStyle = colors[i] + ',' + a + ')';
        ctx.shadowBlur = 12;
        ctx.shadowColor = colors[i] + ',0.7)';
        ctx.fill();
        ctx.restore();
        // ripple at destination (last)
        if (i === 4 && prog >= 0.96) {
          const rProg = ((prog - 0.96) / 0.04);
          ctx.save();
          ctx.beginPath();
          ctx.arc(wp.x, wp.y, 8 + rProg * 18, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(34,197,94,${0.5 * (1 - rProg)})`;
          ctx.lineWidth = 1.5;
          ctx.stroke();
          ctx.restore();
        }
      });

      // ── TRUCK ──
      const truckPt = catmullRomPoint(wps, prog);
      const truckPrev = catmullRomPoint(wps, Math.max(0, prog - 0.01));
      const angle = Math.atan2(truckPt.y - truckPrev.y, truckPt.x - truckPrev.x);

      ctx.save();
      ctx.translate(truckPt.x, truckPt.y);
      ctx.rotate(angle);

      // glow halo
      const haloGrad = ctx.createRadialGradient(0, 0, 2, 0, 0, 28);
      haloGrad.addColorStop(0, 'rgba(43,109,234,0.3)');
      haloGrad.addColorStop(1, 'rgba(43,109,234,0)');
      ctx.beginPath();
      ctx.arc(0, 0, 28, 0, Math.PI * 2);
      ctx.fillStyle = haloGrad;
      ctx.fill();

      // truck body
      ctx.fillStyle = '#1D4ED8';
      ctx.beginPath();
      // Use standard rect with rounded corners since roundRect might not be supported on all nodes
      ctx.rect(-22, -10, 42, 20);
      ctx.fill();

      // cabin
      ctx.fillStyle = '#2563EB';
      ctx.beginPath();
      ctx.rect(8, -12, 14, 22);
      ctx.fill();

      // windshield
      ctx.fillStyle = 'rgba(147,197,253,0.8)';
      ctx.fillRect(10, -9, 10, 10);

      // wheels
      [[-14, 10], [8, 10]].forEach(([wx, wy]) => {
        ctx.fillStyle = '#1e293b';
        ctx.beginPath();
        ctx.arc(wx, wy, 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#475569';
        ctx.beginPath();
        ctx.arc(wx, wy, 2.5, 0, Math.PI * 2);
        ctx.fill();
      });

      // headlight
      ctx.fillStyle = 'rgba(253,224,71,0.9)';
      ctx.beginPath();
      ctx.arc(22, 0, 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 8;
      ctx.shadowColor = 'rgba(253,224,71,0.8)';
      ctx.beginPath();
      ctx.arc(22, 0, 2, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();

      // ── Speed particles trail ──
      if (prog > 0.05) {
        for (let i = 0; i < 3; i++) {
          const tp = catmullRomPoint(wps, Math.max(0, prog - 0.03 - i * 0.015));
          ctx.save();
          ctx.beginPath();
          ctx.arc(tp.x, tp.y, 2 - i * 0.5, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(6,182,212,${0.4 - i * 0.12})`;
          ctx.fill();
          ctx.restore();
        }
      }
    }

    // Animate
    let startTime: number | null = null;
    const DURATION = 4200;
    let animationId: number;

    function animate(ts: number) {
      if (!startTime) startTime = ts;
      const elapsed = ts - startTime;
      progress = Math.min(elapsed / DURATION, 1);
      draw(progress);

      // Activate step nodes
      [0, 0.18, 0.40, 0.65, 0.88].forEach((threshold, i) => {
        const el = document.getElementById('js' + i);
        if (!el) return;
        if (progress >= threshold) {
          el.classList.add('active');
          if (progress >= threshold + 0.12) el.classList.add('done');
        }
      });

      // Progress bar
      if (progress > 0.3) {
        const bar = document.getElementById('tbar') as HTMLElement;
        if (bar && !('set' in bar.dataset)) {
          bar.style.width = '72%';
          bar.dataset.set = 'true';
        }
      }

      if (progress < 1) {
        animationId = requestAnimationFrame(animate);
      } else {
        // loop after pause
        setTimeout(() => {
          progress = 0;
          startTime = null;
          started = false;
          document.querySelectorAll('.jstep').forEach(el => {
            el.classList.remove('active', 'done');
          });
          const bar = document.getElementById('tbar') as HTMLElement;
          if (bar) {
            bar.style.transition = 'none';
            bar.style.width = '0';
            delete bar.dataset.set;
            setTimeout(() => {
              bar.style.transition = 'width 2s cubic-bezier(.16,1,.3,1)';
            }, 50);
          }
          setTimeout(() => {
            started = true;
            animationId = requestAnimationFrame(animate);
          }, 800);
        }, 3000);
      }
    }

    // Trigger on scroll into view
    const observer = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting && !started) {
          started = true;
          animationId = requestAnimationFrame(animate);
        }
      });
    }, { threshold: 0.3 });
    observer.observe(canvas);

    // Initial static draw
    draw(0);

    return () => {
      window.removeEventListener('resize', handleResize);
      observer.disconnect();
      cancelAnimationFrame(animationId);
    };
  }, []);

  // Scroll reveal setup
  useEffect(() => {
    const els = document.querySelectorAll('.reveal');
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          obs.unobserve(e.target);
        }
      });
    }, { threshold: 0.12 });
    els.forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  // Bento card mouse glow
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent, card: HTMLElement) => {
      const rect = card.getBoundingClientRect();
      card.style.setProperty('--mouse-x', (e.clientX - rect.left) + 'px');
      card.style.setProperty('--mouse-y', (e.clientY - rect.top) + 'px');
    };

    const cards = document.querySelectorAll('.bcard');
    cards.forEach(card => {
      const htmlCard = card as HTMLElement;
      const listener = (e: MouseEvent) => handleMouseMove(e, htmlCard);
      htmlCard.addEventListener('mousemove', listener);
      (htmlCard as any)._mouseListener = listener;
    });

    return () => {
      cards.forEach(card => {
        const htmlCard = card as HTMLElement;
        if ((htmlCard as any)._mouseListener) {
          htmlCard.removeEventListener('mousemove', (htmlCard as any)._mouseListener);
        }
      });
    };
  }, []);

  return (
    <div className="home-wrap">
      <style>{`
        .home-wrap {
          --bg:#05080F;
          --bg2:#080C16;
          --surface:#0C1120;
          --surface2:#101828;
          --border:rgba(255,255,255,0.06);
          --border-hover:rgba(59,130,246,0.4);
          --blue:#2B6DEA;
          --blue-m:#4F8EF7;
          --blue-l:#82B4FF;
          --cyan:#06B6D4;
          --orange:#F97316;
          --orange-l:#FDBA74;
          --green:#22C55E;
          --purple:#8B5CF6;
          --white:#EEF2FF;
          --white2:#C8D5F0;
          --grey:#637089;
          --grey-l:#8DA0BE;
          --r-sm:12px;
          --r-md:18px;
          --r-lg:24px;
          --r-xl:32px;
          
          background: var(--bg);
          color: var(--white);
          line-height: 1.6;
          overflow-x: hidden;
          -webkit-font-smoothing: antialiased;
          position: relative;
          min-height: 100vh;
        }

        .home-wrap #canvas-bg {
          position: fixed; inset: 0; z-index: 0;
          pointer-events: none;
        }

        .home-wrap::after {
          content: ''; position: absolute; inset: 0; z-index: 1; pointer-events: none;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.03'/%3E%3C/svg%3E");
          opacity: .4;
        }

        .home-wrap .wrap { max-width: 1120px; margin: 0 auto; padding: 0 32px; position: relative; z-index: 5; }
        .home-wrap section { position: relative; z-index: 5; }

        .home-wrap .reveal {
          opacity: 0; transform: translateY(40px);
          transition: opacity .8s cubic-bezier(.16,1,.3,1), transform .8s cubic-bezier(.16,1,.3,1);
        }
        .home-wrap .reveal.visible { opacity: 1; transform: none; }
        .home-wrap .reveal-delay-1 { transition-delay: .1s; }
        .home-wrap .reveal-delay-2 { transition-delay: .2s; }
        .home-wrap .reveal-delay-3 { transition-delay: .3s; }
        .home-wrap .reveal-delay-4 { transition-delay: .4s; }
        .home-wrap .reveal-delay-5 { transition-delay: .5s; }
        .home-wrap .reveal-delay-6 { transition-delay: .6s; }

        .home-wrap .hero {
          padding: 180px 0 80px;
          text-align: center;
          position: relative;
        }
        .home-wrap .hero::before {
          content: '';
          position: absolute; top: -80px; left: 50%; transform: translateX(-50%);
          width: 700px; height: 500px;
          background: radial-gradient(ellipse at 50% 40%, rgba(43,109,234,0.13) 0%, transparent 65%);
          pointer-events: none; z-index: -1;
        }

        .home-wrap .hero-eyebrow {
          display: inline-flex; align-items: center; gap: 9px;
          font-size: 11.5px; font-weight: 600; letter-spacing: 2px; text-transform: uppercase;
          color: var(--blue-l);
          border: 1px solid rgba(130,180,255,0.2);
          background: rgba(43,109,234,0.07);
          padding: 7px 18px; border-radius: 100px;
          margin-bottom: 32px;
        }
        .home-wrap .eyebrow-dot {
          width: 7px; height: 7px; border-radius: 50%;
          background: var(--blue-m);
          box-shadow: 0 0 6px var(--blue-m);
          animation: dotPulse 2s ease infinite;
        }
        @keyframes dotPulse {
          0%, 100% { box-shadow: 0 0 6px var(--blue-m); transform: scale(1); }
          50% { box-shadow: 0 0 14px var(--blue-l), 0 0 28px rgba(79,142,247,0.3); transform: scale(1.2); }
        }

        .home-wrap .hero h1 {
          font-family: 'Sora', sans-serif;
          font-weight: 900;
          font-size: clamp(42px, 7vw, 80px);
          letter-spacing: -3px;
          line-height: 1.0;
          margin-bottom: 24px;
        }
        .home-wrap .hero-line1 { color: var(--white); }
        .home-wrap .hero-line2 {
          background: linear-gradient(100deg, var(--blue-l) 0%, var(--cyan) 35%, var(--blue-m) 65%, var(--orange-l) 100%);
          -webkit-background-clip: text; background-clip: text; color: transparent;
          background-size: 200% auto;
          animation: gradShift 4s linear infinite;
        }
        @keyframes gradShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .home-wrap .hero-sub {
          max-width: 540px; margin: 0 auto 44px;
          font-size: 17.5px; color: var(--grey-l); line-height: 1.7; font-weight: 400;
        }
        .home-wrap .hero-btns { display: flex; gap: 14px; justify-content: center; flex-wrap: wrap; margin-bottom: 64px; }

        .home-wrap .btn {
          display: inline-flex; align-items: center; gap: 9px;
          padding: 15px 30px; border-radius: 12px;
          font-weight: 600; font-size: 15px;
          transition: all .22s cubic-bezier(.16,1,.3,1);
          cursor: pointer; position: relative; overflow: hidden;
        }
        .home-wrap .btn::before {
          content: ''; position: absolute; inset: 0;
          background: rgba(255,255,255,0);
          transition: background .2s;
        }
        .home-wrap .btn:hover::before { background: rgba(255,255,255,0.06); }
        .home-wrap .btn-primary {
          background: linear-gradient(135deg, var(--blue) 0%, #1D5CD4 100%);
          color: #fff;
          box-shadow: 0 1px 0 rgba(255,255,255,0.12) inset,
                     0 8px 28px rgba(43,109,234,0.4),
                     0 0 0 1px rgba(43,109,234,0.5);
        }
        .home-wrap .btn-primary:hover {
          box-shadow: 0 1px 0 rgba(255,255,255,0.12) inset,
                     0 14px 36px rgba(43,109,234,0.55),
                     0 0 0 1px rgba(79,142,247,0.6);
          transform: translateY(-2px) scale(1.01);
        }
        .home-wrap .btn-ghost {
          background: rgba(255,255,255,0.03);
          color: var(--white2);
          border: 1px solid var(--border);
        }
        .home-wrap .btn-ghost:hover { border-color: var(--border-hover); background: rgba(43,109,234,0.06); color: var(--white); }

        .home-wrap .btn-arrow {
          display: inline-flex; align-items: center; justify-content: center;
          width: 18px; height: 18px; border-radius: 50%;
          background: rgba(255,255,255,0.15);
          font-size: 11px; font-style: normal;
          transition: transform .2s;
        }
        .home-wrap .btn:hover .btn-arrow { transform: translateX(3px); }

        .home-wrap .hero-stats {
          display: flex; justify-content: center; gap: 0; flex-wrap: wrap;
          border: 1px solid var(--border);
          border-radius: var(--r-lg);
          background: rgba(12,17,32,0.6);
          backdrop-filter: blur(12px);
          overflow: hidden;
          max-width: 720px; margin: 0 auto;
        }
        .home-wrap .h-stat {
          flex: 1 1 140px;
          padding: 24px 20px;
          text-align: center;
          border-right: 1px solid var(--border);
          position: relative;
        }
        .home-wrap .h-stat:last-child { border-right: none; }
        .home-wrap .h-stat::before {
          content: ''; position: absolute; top: 0; left: 50%; transform: translateX(-50%);
          width: 60%; height: 1px;
          background: linear-gradient(90deg, transparent, var(--blue), transparent);
          opacity: 0;
          transition: opacity .3s;
        }
        .home-wrap .h-stat:hover::before { opacity: 1; }
        .home-wrap .h-num {
          font-family: 'Sora', sans-serif; font-weight: 800;
          font-size: 28px; color: var(--white);
          display: block; margin-bottom: 4px;
          background: linear-gradient(135deg, var(--white) 0%, var(--blue-l) 100%);
          -webkit-background-clip: text; background-clip: text; color: transparent;
        }
        .home-wrap .h-lbl { font-size: 12px; color: var(--grey); letter-spacing: 0.3px; }

        .home-wrap .sec-eyebrow {
          display: block;
          font-size: 11.5px; font-weight: 700; letter-spacing: 2.5px; text-transform: uppercase;
          color: var(--blue-m); margin-bottom: 14px; text-align: center;
        }
        .home-wrap .sec-title {
          font-family: 'Sora', sans-serif; font-weight: 700;
          font-size: clamp(26px, 3.8vw, 38px);
          letter-spacing: -0.8px; text-align: center;
          margin-bottom: 56px;
        }
        .home-wrap .sec-title em { font-style: normal; color: var(--blue-l); }
        .home-wrap .sec-divider {
          border: none;
          border-top: 1px solid var(--border);
          margin: 80px 0;
        }

        .home-wrap .journey-section { padding: 80px 0; }
        .home-wrap .journey-canvas-wrap {
          position: relative;
          height: 280px;
          margin-bottom: 0;
          border-radius: var(--r-xl);
          overflow: visible;
        }
        .home-wrap #journey-canvas {
          width: 100%; height: 100%; display: block;
          border-radius: var(--r-xl);
        }

        .home-wrap .journey-steps {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 0;
          margin-top: 24px;
          position: relative;
        }
        .home-wrap .journey-steps::before {
          content: '';
          position: absolute;
          top: 28px; left: 10%; right: 10%;
          height: 1px;
          background: linear-gradient(90deg, transparent, var(--border) 10%, var(--border) 90%, transparent);
          z-index: 0;
        }
        .home-wrap .jstep {
          text-align: center;
          padding: 0 8px;
          position: relative; z-index: 1;
          opacity: 0; transform: translateY(20px);
          transition: opacity .5s cubic-bezier(.16,1,.3,1), transform .5s cubic-bezier(.16,1,.3,1);
        }
        .home-wrap .jstep.active { opacity: 1; transform: none; }
        .home-wrap .jstep-icon-wrap {
          position: relative;
          display: inline-flex; align-items: center; justify-content: center;
          width: 56px; height: 56px;
          margin: 0 auto 12px;
        }
        .home-wrap .jstep-ring {
          position: absolute; inset: 0; border-radius: 50%;
          border: 1.5px solid var(--border);
          transition: border-color .4s, box-shadow .4s;
        }
        .home-wrap .jstep.active .jstep-ring {
          border-color: var(--blue-m);
          box-shadow: 0 0 0 4px rgba(43,109,234,0.1), 0 0 16px rgba(43,109,234,0.25);
        }
        .home-wrap .jstep.done .jstep-ring { border-color: var(--green); box-shadow: 0 0 12px rgba(34,197,94,0.2); }
        .home-wrap .jstep-icon {
          width: 40px; height: 40px; border-radius: 50%;
          background: var(--surface);
          display: flex; align-items: center; justify-content: center;
          font-size: 18px; position: relative; z-index: 1;
          border: 1px solid var(--border);
          transition: background .3s;
        }
        .home-wrap .jstep.active .jstep-icon { background: rgba(43,109,234,0.12); }
        .home-wrap .jstep.done .jstep-icon { background: rgba(34,197,94,0.1); }
        .home-wrap .jstep-label { font-family: 'Sora', sans-serif; font-size: 12.5px; font-weight: 700; color: var(--white2); margin-bottom: 4px; }
        .home-wrap .jstep-desc { font-size: 11px; color: var(--grey); line-height: 1.45; max-width: 90px; margin: 0 auto; }
        .home-wrap .jstep.active .jstep-label { color: var(--white); }

        .home-wrap .tracker-card {
          margin-top: 32px;
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: var(--r-lg);
          padding: 22px 28px;
          display: flex; align-items: center; gap: 24px; flex-wrap: wrap;
          backdrop-filter: blur(8px);
          position: relative; overflow: hidden;
        }
        .home-wrap .tracker-card::before {
          content: '';
          position: absolute; top: 0; left: 0; right: 0; height: 1px;
          background: linear-gradient(90deg, transparent 0%, var(--blue) 50%, transparent 100%);
          opacity: 0.5;
        }
        .home-wrap .tcard-status {
          display: flex; align-items: center; gap: 11px;
          flex: 0 0 auto;
        }
        .home-wrap .live-dot {
          width: 10px; height: 10px; border-radius: 50%;
          background: var(--green);
          box-shadow: 0 0 0 0 rgba(34,197,94,0.5);
          animation: livePing 2s ease infinite;
        }
        @keyframes livePing {
          0% { box-shadow: 0 0 0 0 rgba(34,197,94,0.5); }
          70% { box-shadow: 0 0 0 10px rgba(34,197,94,0); }
          100% { box-shadow: 0 0 0 0 rgba(34,197,94,0); }
        }
        .home-wrap .tcard-id strong { display: block; font-size: 15px; font-weight: 600; color: var(--white); }
        .home-wrap .tcard-id span { font-size: 12.5px; color: var(--grey); }
        .home-wrap .tcard-bar { flex: 1 1 200px; min-width: 160px; }
        .home-wrap .tbar-top { display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 12px; color: var(--grey); }
        .home-wrap .tbar-top strong { color: var(--blue-l); }
        .home-wrap .tbar-track { height: 5px; background: rgba(43,109,234,0.1); border-radius: 100px; overflow: hidden; }
        .home-wrap .tbar-fill {
          height: 100%; border-radius: 100px;
          background: linear-gradient(90deg, var(--blue), var(--cyan));
          width: 0;
          transition: width 2s cubic-bezier(.16,1,.3,1);
          box-shadow: 0 0 8px rgba(6,182,212,0.5);
        }
        .home-wrap .tcard-eta {
          text-align: center; padding: 0 8px; flex: 0 0 auto;
        }
        .home-wrap .eta-num {
          font-family: 'Sora', sans-serif; font-weight: 800; font-size: 28px;
          background: linear-gradient(135deg, var(--orange-l), var(--orange));
          -webkit-background-clip: text; background-clip: text; color: transparent;
        }
        .home-wrap .eta-lbl { font-size: 11px; color: var(--grey); margin-top: 2px; }

        .home-wrap .features-section { padding: 20px 0 80px; }
        .home-wrap .bento {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          grid-template-rows: auto auto;
          gap: 16px;
        }
        .home-wrap .bcard {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: var(--r-lg);
          padding: 28px 26px;
          position: relative; overflow: hidden;
          transition: border-color .3s, transform .3s cubic-bezier(.16,1,.3,1), box-shadow .3s;
          cursor: default;
        }
        .home-wrap .bcard::after {
          content: '';
          position: absolute; inset: 0; border-radius: inherit;
          background: radial-gradient(600px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(43,109,234,0.05), transparent 40%);
          opacity: 0; transition: opacity .4s;
          pointer-events: none;
        }
        .home-wrap .bcard:hover::after { opacity: 1; }
        .home-wrap .bcard:hover {
          border-color: rgba(43,109,234,0.25);
          transform: translateY(-4px);
          box-shadow: 0 20px 48px rgba(0,0,0,0.4), 0 0 0 1px rgba(43,109,234,0.15);
        }
        .home-wrap .bcard::before {
          content: '';
          position: absolute; top: 0; left: 24px; right: 24px; height: 1px;
          background: linear-gradient(90deg, transparent, var(--blue), transparent);
          opacity: 0; transition: opacity .3s;
        }
        .home-wrap .bcard:hover::before { opacity: 1; }

        .home-wrap .bcard-wide { grid-column: span 2; }
        .home-wrap .bcard-icon {
          width: 48px; height: 48px; border-radius: 14px;
          background: rgba(43,109,234,0.08);
          border: 1px solid rgba(43,109,234,0.15);
          display: flex; align-items: center; justify-content: center;
          font-size: 22px; margin-bottom: 18px;
        }
        .home-wrap .bcard h3 {
          font-family: 'Sora', sans-serif; font-size: 17px; font-weight: 700;
          color: var(--white); margin-bottom: 9px; letter-spacing: -0.2px;
        }
        .home-wrap .bcard p { font-size: 13.5px; color: var(--grey); line-height: 1.6; }
        .home-wrap .bcard-tag {
          display: inline-block;
          font-size: 10.5px; font-weight: 600; letter-spacing: 1px; text-transform: uppercase;
          color: var(--blue-m); border: 1px solid rgba(43,109,234,0.2);
          padding: 3px 10px; border-radius: 100px; margin-bottom: 12px;
        }

        .home-wrap .mini-route {
          margin-top: 20px;
          height: 5px; border-radius: 100px;
          background: rgba(43,109,234,0.08);
          position: relative; overflow: hidden;
        }
        .home-wrap .mini-route-fill {
          height: 100%;
          background: linear-gradient(90deg, var(--blue), var(--cyan));
          border-radius: 100px;
          width: 0;
          animation: miniProg 3s ease 1.5s forwards;
        }
        @keyframes miniProg { to { width: 82%; } }
        .home-wrap .mini-route-truck {
          position: absolute; top: 50%; transform: translateY(-50%);
          font-size: 14px; left: 0%;
          animation: miniTruck 3s ease 1.5s forwards;
        }
        @keyframes miniTruck { to { left: 78%; } }

        .home-wrap .eco-section { padding: 0 0 80px; }
        .home-wrap .eco-card {
          background: linear-gradient(135deg, rgba(43,109,234,0.07) 0%, rgba(139,92,246,0.04) 50%, rgba(249,115,22,0.04) 100%);
          border: 1px solid var(--border);
          border-radius: var(--r-xl);
          padding: 52px 48px;
          display: flex; align-items: center; justify-content: space-between;
          gap: 36px; flex-wrap: wrap;
          position: relative; overflow: hidden;
        }
        .home-wrap .eco-card::before {
          content: '';
          position: absolute; top: 0; left: 0; right: 0; height: 1px;
          background: linear-gradient(90deg, transparent 0%, rgba(43,109,234,0.5) 30%, rgba(139,92,246,0.4) 60%, rgba(249,115,22,0.3) 80%, transparent 100%);
        }
        .home-wrap .eco-left h3 {
          font-family: 'Sora', sans-serif; font-size: clamp(20px, 2.5vw, 26px); font-weight: 700;
          margin-bottom: 10px; letter-spacing: -0.4px;
        }
        .home-wrap .eco-left p { color: var(--grey); font-size: 14.5px; max-width: 420px; line-height: 1.65; }
        .home-wrap .eco-brands {
          display: flex; gap: 12px; flex-wrap: wrap; align-items: center;
        }
        .home-wrap .brand-chip {
          font-size: 13px; font-weight: 600;
          padding: 10px 20px; border-radius: 10px;
          border: 1px solid var(--border);
          background: rgba(255,255,255,0.02);
          color: var(--white2);
          transition: all .25s;
          cursor: default;
        }
        .home-wrap .brand-chip:hover { border-color: var(--border-hover); background: rgba(43,109,234,0.08); color: var(--white); transform: translateY(-2px); }

        .home-wrap .eco-orb {
          position: absolute; border-radius: 50%;
          filter: blur(60px); pointer-events: none; opacity: 0.12;
        }
        .home-wrap .eco-orb-1 { width: 200px; height: 200px; background: var(--blue); top: -60px; right: 100px; }
        .home-wrap .eco-orb-2 { width: 150px; height: 150px; background: var(--purple); bottom: -40px; right: 0; }

        .home-wrap .cta-section {
          padding: 60px 0 100px;
          text-align: center;
          position: relative;
        }
        .home-wrap .cta-glow {
          position: absolute; top: 0; left: 50%; transform: translateX(-50%);
          width: 600px; height: 300px;
          background: radial-gradient(ellipse, rgba(43,109,234,0.12) 0%, transparent 65%);
          pointer-events: none;
        }
        .home-wrap .cta-section h2 {
          font-family: 'Sora', sans-serif; font-weight: 800;
          font-size: clamp(28px, 4vw, 46px);
          letter-spacing: -1.2px; margin-bottom: 16px;
        }
        .home-wrap .cta-section p { color: var(--grey-l); font-size: 16px; margin-bottom: 36px; max-width: 440px; margin-left: auto; margin-right: auto; }

        @media(max-width:900px){
          .home-wrap .bento { grid-template-columns: 1fr 1fr; }
          .home-wrap .bcard-wide { grid-column: span 2; }
          .home-wrap .journey-steps { grid-template-columns: repeat(5, 1fr); }
        }
        @media(max-width:640px){
          .home-wrap .bento { grid-template-columns: 1fr; }
          .home-wrap .bcard-wide { grid-column: span 1; }
          .home-wrap .hero-stats { flex-wrap: wrap; }
          .home-wrap .h-stat { flex: 1 1 45%; }
          .home-wrap .h-stat:nth-child(2) { border-right: none; }
          .home-wrap .journey-steps { grid-template-columns: repeat(3, 1fr); gap: 12px; }
          .home-wrap .jstep:nth-child(4), .home-wrap .jstep:nth-child(5) { display: none; }
          .home-wrap .eco-card { padding: 32px 24px; }
          .home-wrap .hero { padding: 120px 0 60px; }
        }
        @media(prefers-reduced-motion:reduce){
          .home-wrap *, .home-wrap *::before, .home-wrap *::after { animation: none !important; transition: none !important; }
        }
      `}</style>

      {/* PARTICLE CANVAS */}
      <canvas ref={canvasRef} id="canvas-bg"></canvas>

      <div className="wrap">
        {/* HERO */}
        <section className="hero reveal">
          <div className="hero-eyebrow">
            <span className="eyebrow-dot"></span> Currently in Development
          </div>
          <h1>
            <div className="hero-line1">India's Smartest</div>
            <div className="hero-line2">Shipping Network</div>
          </h1>
          <p className="hero-sub">
            RAjFleet moves every order across the RAj Ecosystem — warehouse to doorstep — with intelligent routing and real-time tracking built for India.
          </p>
          <div className="hero-btns">
            <a href="https://rajfleet.rajhomeindia.com/" target="_blank" rel="noopener noreferrer" className="btn btn-primary">
              View Full Website <em className="btn-arrow">↗</em>
            </a>
            <a href="#journey" className="btn btn-ghost">See How It Works</a>
          </div>

          {/* STATS */}
          <div className="hero-stats">
            <div className="h-stat">
              <span className="h-num">5+</span>
              <div className="h-lbl">RAj Brands Served</div>
            </div>
            <div className="h-stat">
              <span className="h-num">24/7</span>
              <div className="h-lbl">Network Uptime</div>
            </div>
            <div className="h-stat">
              <span className="h-num">100%</span>
              <div className="h-lbl">Real-Time Tracking</div>
            </div>
            <div className="h-stat">
              <span className="h-num">2025</span>
              <div className="h-lbl">Network Launched</div>
            </div>
          </div>
        </section>

        <hr className="sec-divider" />

        {/* DELIVERY JOURNEY */}
        <section className="journey-section reveal" id="journey">
          <span className="sec-eyebrow">Live Delivery Flow</span>
          <h2 className="sec-title">Your order — every step, <em>live</em></h2>

          <div className="journey-canvas-wrap">
            <canvas ref={journeyCanvasRef} id="journey-canvas"></canvas>
          </div>

          {/* Step nodes */}
          <div className="journey-steps">
            <div className="jstep" id="js0">
              <div className="jstep-icon-wrap">
                <div className="jstep-ring"></div>
                <div className="jstep-icon">🏬</div>
              </div>
              <div className="jstep-label">Order Placed</div>
              <div className="jstep-desc">Customer confirms on RAj platform</div>
            </div>
            <div className="jstep" id="js1">
              <div className="jstep-icon-wrap">
                <div className="jstep-ring"></div>
                <div className="jstep-icon">📦</div>
              </div>
              <div className="jstep-label">Packed</div>
              <div className="jstep-desc">Warehouse prepares & seals</div>
            </div>
            <div className="jstep" id="js2">
              <div className="jstep-icon-wrap">
                <div className="jstep-ring"></div>
                <div className="jstep-icon">🚚</div>
              </div>
              <div className="jstep-label">In Transit</div>
              <div className="jstep-desc">Rider picked up, on the move</div>
            </div>
            <div className="jstep" id="js3">
              <div className="jstep-icon-wrap">
                <div className="jstep-ring"></div>
                <div className="jstep-icon">📍</div>
              </div>
              <div className="jstep-label">Out for Delivery</div>
              <div className="jstep-desc">Last-mile hyperlocal route</div>
            </div>
            <div className="jstep" id="js4">
              <div className="jstep-icon-wrap">
                <div className="jstep-ring"></div>
                <div className="jstep-icon">🏠</div>
              </div>
              <div className="jstep-label">Delivered</div>
              <div className="jstep-desc">At your doorstep</div>
            </div>
          </div>

          {/* Tracker card */}
          <div className="tracker-card reveal reveal-delay-3">
            <div className="tcard-status">
              <div className="live-dot"></div>
              <div className="tcard-id">
                <strong>Order #RJF-2906</strong>
                <span>Patna Hub → Boring Road, Patna</span>
              </div>
            </div>
            <div className="tcard-bar">
              <div className="tbar-top">
                <span>Out for Delivery</span>
                <strong>72% complete</strong>
              </div>
              <div className="tbar-track">
                <div className="tbar-fill" id="tbar"></div>
              </div>
            </div>
            <div className="tcard-eta">
              <div className="eta-num">18 min</div>
              <div className="eta-lbl">Estimated Arrival</div>
            </div>
          </div>
        </section>

        <hr className="sec-divider" />

        {/* FEATURES BENTO */}
        <section className="features-section">
          <span className="sec-eyebrow">Why RAjFleet</span>
          <h2 className="sec-title">Built to move the whole ecosystem</h2>
          <div className="bento">
            <div className="bcard reveal reveal-delay-1">
              <div className="bcard-tag">Delivery</div>
              <div className="bcard-icon">🚚</div>
              <h3>Hyperlocal Delivery</h3>
              <p>Dense rider and hub coverage designed for fast, last-mile delivery across Indian cities and towns.</p>
            </div>

            <div className="bcard reveal reveal-delay-2">
              <div className="bcard-tag">Tracking</div>
              <div className="bcard-icon">📍</div>
              <h3>Live Order Tracking</h3>
              <p>Every shipment is visible end-to-end — from pickup confirmation to doorstep delivery in real time.</p>
            </div>

            <div className="bcard reveal reveal-delay-3">
              <div className="bcard-tag">Ecosystem</div>
              <div className="bcard-icon">🔗</div>
              <h3>Ecosystem-Native</h3>
              <p>One logistics backbone connecting RAjHOME, RAjLUXE, CLYNj, and RAjMYRA seamlessly.</p>
            </div>

            <div className="bcard bcard-wide reveal reveal-delay-1">
              <div className="bcard-tag">Intelligence</div>
              <div className="bcard-icon">⚡</div>
              <h3>Intelligent Routing Engine</h3>
              <p>Smart algorithms recalculate the fastest path in real time — reducing delivery time and fuel cost on every single route across India's dynamic traffic.</p>
              <div className="mini-route">
                <div className="mini-route-fill"></div>
                <div className="mini-route-truck">🚚</div>
              </div>
            </div>

            <div className="bcard reveal reveal-delay-2">
              <div className="bcard-tag">Security</div>
              <div className="bcard-icon">🛡️</div>
              <h3>Secure Handover</h3>
              <p>OTP-verified delivery and digital proof for every order — zero exceptions.</p>
            </div>

            <div className="bcard reveal reveal-delay-1">
              <div className="bcard-tag">Operations</div>
              <div className="bcard-icon">📊</div>
              <h3>Fleet Dashboard</h3>
              <p>Live fleet status, delivery performance, and full analytics in one operator view.</p>
            </div>
          </div>
        </section>

        {/* ECOSYSTEM BAND */}
        <section className="eco-section">
          <div className="eco-card reveal">
            <div className="eco-orb eco-orb-1"></div>
            <div className="eco-orb eco-orb-2"></div>
            <div className="eco-left">
              <h3>One network. Every RAj brand.</h3>
              <p>RAjFleet is the silent infrastructure that powers every delivery across the RAj Ecosystem — from furniture to fashion, home décor to luxury goods.</p>
            </div>
            <div className="eco-brands">
              <span className="brand-chip">RAjHOME</span>
              <span className="brand-chip">RAjLUXE</span>
              <span className="brand-chip">CLYNj</span>
              <span className="brand-chip">RAjMYRA</span>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="cta-section reveal">
          <div className="cta-glow"></div>
          <h2>See RAjFleet in motion</h2>
          <p>Explore the full platform — live network, tracking portal, and partner details.</p>
          <a href="https://rajfleet.rajhomeindia.com/" target="_blank" rel="noopener noreferrer" className="btn btn-primary" style={{ fontSize: '16px', padding: '17px 36px' }}>
            View Full Website <em className="btn-arrow">↗</em>
          </a>
        </section>
      </div>
    </div>
  );
}
