import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useScroll, useTransform } from "motion/react";
import confetti from "canvas-confetti";

const C = {
  rose: "#e8637a",
  roseDeep: "#c0394f",
  gold: "#d4a843",
  goldLight: "#f5d78e",
  dark: "#1a0a0d",
  dark2: "#2a1018",
  petals: "#f9c0cb",
  lavender: "#c9a8d4",
};

const GALLERY = [
  { url: "https://images.unsplash.com/photo-1556712691-5c39e0e32a8e?w=600&h=600&fit=crop&auto=format", alt: "Orange and pink roses" },
  { url: "https://images.unsplash.com/photo-1617658260099-d1f805576486?w=600&h=600&fit=crop&auto=format", alt: "Red roses in vase" },
  { url: "https://images.unsplash.com/photo-1599577011266-9c006a93c294?w=600&h=600&fit=crop&auto=format", alt: "Colorful bouquet" },
  { url: "https://images.unsplash.com/photo-1619467416348-6a782839e95f?w=600&h=600&fit=crop&auto=format", alt: "Travel map" },
  { url: "https://images.unsplash.com/photo-1779398190218-0018f195da4d?w=600&h=600&fit=crop&auto=format", alt: "Woman with roses" },
  { url: "https://images.unsplash.com/photo-1767730791330-ddeec135f345?w=600&h=600&fit=crop&auto=format", alt: "Red roses in park" },
];

const PHOTO_WISHES = [
  { ...GALLERY[0], wish: "May every morning of your 22nd year open like a fresh bloom.", tag: "Wish 01" },
  { ...GALLERY[1], wish: "May love, laughter, and soft little surprises find you everywhere.", tag: "Wish 02" },
  { ...GALLERY[2], wish: "May your smile stay bright enough to turn ordinary days into memories.", tag: "Wish 03" },
  { ...GALLERY[3], wish: "May every road you dream of walking become a beautiful adventure.", tag: "Wish 04" },
  { ...GALLERY[4], wish: "May you always feel celebrated, treasured, and deeply loved.", tag: "Wish 05" },
  { ...GALLERY[5], wish: "May this birthday be the beginning of your most magical chapter yet.", tag: "Wish 06" },
];

const PHRASES = [
  "A world explorer, born to wander 🌍",
  "The most beautiful soul 🌸",
  "Happy 22nd Birthday, Isha! 🎉",
  "May every journey be magical ✈️",
  "Queen of Royal Floral ✨🌹",
];

function useTypewriter() {
  const [text, setText] = useState("");
  const state = useRef({ pIdx: 0, cIdx: 0, deleting: false });

  useEffect(() => {
    const tick = () => {
      const { pIdx, cIdx, deleting } = state.current;
      const phrase = PHRASES[pIdx];
      if (!deleting) {
        if (cIdx < phrase.length) {
          setText(phrase.slice(0, cIdx + 1));
          state.current.cIdx++;
          setTimeout(tick, 90);
        } else {
          state.current.deleting = true;
          setTimeout(tick, 2200);
        }
      } else {
        if (cIdx > 0) {
          setText(phrase.slice(0, cIdx - 1));
          state.current.cIdx--;
          setTimeout(tick, 45);
        } else {
          state.current.deleting = false;
          state.current.pIdx = (pIdx + 1) % PHRASES.length;
          setTimeout(tick, 90);
        }
      }
    };
    const t = setTimeout(tick, 1800);
    return () => clearTimeout(t);
  }, []);

  return text;
}

function useCountdown() {
  const [time, setTime] = useState({ days: 0, hours: 0, mins: 0, secs: 0, isToday: false });
  useEffect(() => {
    const calc = () => {
      const now = new Date();
      let next = new Date(now.getFullYear(), 5, 12);
      if (now > next) next = new Date(now.getFullYear() + 1, 5, 12);
      const diff = next.getTime() - now.getTime();
      if (diff <= 0) { setTime({ days: 0, hours: 0, mins: 0, secs: 0, isToday: true }); return; }
      setTime({
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        mins: Math.floor((diff % 3600000) / 60000),
        secs: Math.floor((diff % 60000) / 1000),
        isToday: false,
      });
    };
    calc();
    const id = setInterval(calc, 1000);
    return () => clearInterval(id);
  }, []);
  return time;
}

function StarsCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const c = ref.current!; const ctx = c.getContext("2d")!;
    let raf: number;
    const stars: any[] = [];
    const resize = () => { c.width = innerWidth; c.height = innerHeight; };
    resize(); window.addEventListener("resize", resize);
    for (let i = 0; i < 220; i++) stars.push({ x: Math.random() * c.width, y: Math.random() * c.height, r: Math.random() * 1.5 + 0.2, o: Math.random() * 0.6 + 0.1, speed: Math.random() * 0.15 + 0.02, pulse: Math.random() * Math.PI * 2 });
    const draw = () => {
      ctx.clearRect(0, 0, c.width, c.height);
      const t = Date.now() * 0.001;
      stars.forEach(s => { const op = s.o * (0.6 + 0.4 * Math.sin(t * s.speed * 10 + s.pulse)); ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2); ctx.fillStyle = `rgba(245,215,142,${op})`; ctx.fill(); });
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, []);
  return <canvas ref={ref} style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none" }} />;
}

function PetalsCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const c = ref.current!; const ctx = c.getContext("2d")!;
    let raf: number; let petals: any[] = [];
    const resize = () => { c.width = innerWidth; c.height = innerHeight; };
    resize(); window.addEventListener("resize", resize);
    const newP = () => ({ x: Math.random() * c.width, y: -20, vx: (Math.random() - 0.5) * 0.8, vy: Math.random() * 1 + 0.4, rot: Math.random() * Math.PI * 2, rotV: (Math.random() - 0.5) * 0.04, s: Math.random() * 14 + 6, alpha: Math.random() * 0.5 + 0.3, swing: Math.random() * Math.PI * 2, swingSpeed: Math.random() * 0.02 + 0.01 });
    for (let i = 0; i < 35; i++) { const p = newP(); p.y = Math.random() * c.height; petals.push(p); }
    const drawP = (x: number, y: number, s: number, rot: number, alpha: number) => { ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.globalAlpha = alpha; ctx.beginPath(); ctx.ellipse(0, 0, s * 0.4, s * 0.7, 0, 0, Math.PI * 2); const g = ctx.createRadialGradient(0, -s * 0.2, 0, 0, 0, s * 0.7); g.addColorStop(0, "rgba(255,192,203,0.9)"); g.addColorStop(1, "rgba(200,80,100,0.4)"); ctx.fillStyle = g; ctx.fill(); ctx.restore(); };
    const draw = () => { ctx.clearRect(0, 0, c.width, c.height); petals.forEach((p, i) => { p.y += p.vy; p.x += p.vx + Math.sin(p.swing) * 0.5; p.swing += p.swingSpeed; p.rot += p.rotV; if (p.y > c.height + 30) petals[i] = newP(); drawP(p.x, p.y, p.s, p.rot, p.alpha); }); raf = requestAnimationFrame(draw); };
    draw();
    const iv = setInterval(() => { if (petals.length < 50) petals.push(newP()); }, 800);
    return () => { cancelAnimationFrame(raf); clearInterval(iv); window.removeEventListener("resize", resize); };
  }, []);
  return <canvas ref={ref} style={{ position: "fixed", inset: 0, zIndex: 1, pointerEvents: "none" }} />;
}

function FireworksCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);
  const pts = useRef<any[]>([]);
  useEffect(() => {
    const c = ref.current!; const ctx = c.getContext("2d")!; let raf: number;
    const resize = () => { c.width = innerWidth; c.height = innerHeight; };
    resize(); window.addEventListener("resize", resize);
    const launch = (x: number, y: number, count = 90, power = 6, size = 3) => {
      const cols = [C.goldLight, C.rose, C.lavender, "#fff", C.petals, C.gold];
      for (let i = 0; i < count; i++) { const a = Math.random() * Math.PI * 2; const sp = Math.random() * power + 0.8; pts.current.push({ x, y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp, color: cols[Math.floor(Math.random() * cols.length)], life: 1, decay: Math.random() * 0.018 + 0.012, size: Math.random() * size + 0.8 }); }
    };
    const backgroundBurst = () => {
      const x = innerWidth * (0.12 + Math.random() * 0.76);
      const y = innerHeight * (0.12 + Math.random() * 0.48);
      launch(x, y, 42, 3.8, 2.2);
      if (Math.random() > 0.65) {
        setTimeout(() => launch(x + (Math.random() - 0.5) * 180, y + (Math.random() - 0.5) * 80, 26, 3.2, 1.8), 180);
      }
    };
    const draw = () => { ctx.clearRect(0, 0, c.width, c.height); pts.current.forEach(p => { p.x += p.vx; p.y += p.vy; p.vy += 0.07; p.vx *= 0.98; p.vy *= 0.98; p.life -= p.decay; ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2); ctx.fillStyle = p.color; ctx.globalAlpha = Math.max(0, p.life); ctx.fill(); ctx.globalAlpha = 1; }); pts.current = pts.current.filter(p => p.life > 0); raf = requestAnimationFrame(draw); };
    draw();
    const t1 = setTimeout(() => { launch(innerWidth * 0.25, innerHeight * 0.3); launch(innerWidth * 0.75, innerHeight * 0.25); launch(innerWidth * 0.5, innerHeight * 0.4); }, 1500);
    const t2 = setTimeout(() => { launch(innerWidth * 0.15, innerHeight * 0.5); launch(innerWidth * 0.85, innerHeight * 0.45); }, 2500);
    const crackle = setInterval(backgroundBurst, 950);
    const firstCrackle = setTimeout(backgroundBurst, 500);
    const onClick = (e: MouseEvent) => { launch(e.clientX, e.clientY); setTimeout(() => launch(e.clientX + 60, e.clientY - 40), 120); setTimeout(() => launch(e.clientX - 60, e.clientY - 20), 240); };
    window.addEventListener("click", onClick);
    return () => { cancelAnimationFrame(raf); clearTimeout(t1); clearTimeout(t2); clearTimeout(firstCrackle); clearInterval(crackle); window.removeEventListener("resize", resize); window.removeEventListener("click", onClick); };
  }, []);
  return <canvas ref={ref} style={{ position: "fixed", inset: 0, zIndex: 2, pointerEvents: "none" }} />;
}

function CakeCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);
  const [blown, setBlown] = useState(false);
  const blownRef = useRef(false);

  useEffect(() => {
    const canvas = ref.current!; const ctx = canvas.getContext("2d")!; let raf: number; let t = 0;
    const draw = () => {
      ctx.clearRect(0, 0, 380, 420); t += 0.03;
      // shadow
      ctx.save(); ctx.globalAlpha = 0.25; ctx.fillStyle = "#000"; ctx.beginPath(); ctx.ellipse(190, 400, 120, 18, 0, 0, Math.PI * 2); ctx.fill(); ctx.restore();
      // bottom tier
      const btG = ctx.createLinearGradient(60, 290, 320, 380); btG.addColorStop(0, "#b5375a"); btG.addColorStop(0.5, C.rose); btG.addColorStop(1, C.roseDeep);
      ctx.beginPath(); ctx.ellipse(190, 295, 130, 22, 0, 0, Math.PI, Math.PI * 2); ctx.lineTo(60, 370); ctx.ellipse(190, 370, 130, 22, 0, Math.PI, 0); ctx.closePath(); ctx.fillStyle = btG; ctx.fill();
      ctx.beginPath(); ctx.ellipse(190, 295, 130, 22, 0, 0, Math.PI * 2); const t1G = ctx.createRadialGradient(190, 295, 10, 190, 295, 130); t1G.addColorStop(0, C.petals); t1G.addColorStop(1, C.rose); ctx.fillStyle = t1G; ctx.fill();
      // drips
      [80, 120, 155, 190, 225, 260, 295].forEach(dx => { ctx.beginPath(); ctx.moveTo(dx, 295); ctx.bezierCurveTo(dx - 6, 310, dx + 6, 320, dx, 330); ctx.strokeStyle = "rgba(255,245,247,0.85)"; ctx.lineWidth = 7; ctx.lineCap = "round"; ctx.stroke(); });
      // mid tier
      const mtG = ctx.createLinearGradient(90, 210, 290, 295); mtG.addColorStop(0, "#7b2040"); mtG.addColorStop(0.5, C.roseDeep); mtG.addColorStop(1, "#9a2040");
      ctx.beginPath(); ctx.ellipse(190, 218, 100, 18, 0, 0, Math.PI, Math.PI * 2); ctx.lineTo(90, 290); ctx.ellipse(190, 290, 100, 18, 0, Math.PI, 0); ctx.closePath(); ctx.fillStyle = mtG; ctx.fill();
      ctx.beginPath(); ctx.ellipse(190, 218, 100, 18, 0, 0, Math.PI * 2); const t2G = ctx.createRadialGradient(190, 218, 5, 190, 218, 100); t2G.addColorStop(0, "#f5c8d4"); t2G.addColorStop(1, C.roseDeep); ctx.fillStyle = t2G; ctx.fill();
      ctx.beginPath(); ctx.ellipse(190, 218, 100, 18, 0, 0, Math.PI * 2); ctx.strokeStyle = C.gold; ctx.lineWidth = 2; ctx.stroke();
      [110, 130, 150, 170, 190, 210, 230, 250, 270].forEach(rx => { ctx.beginPath(); ctx.arc(rx, 255, 5, 0, Math.PI * 2); const rg = ctx.createRadialGradient(rx, 255, 0, rx, 255, 5); rg.addColorStop(0, C.petals); rg.addColorStop(1, C.roseDeep); ctx.fillStyle = rg; ctx.fill(); });
      // top tier
      const ttG = ctx.createLinearGradient(120, 140, 260, 218); ttG.addColorStop(0, "#4a0e22"); ttG.addColorStop(0.5, "#8b1a35"); ttG.addColorStop(1, "#5a1228");
      ctx.beginPath(); ctx.ellipse(190, 148, 70, 13, 0, 0, Math.PI, Math.PI * 2); ctx.lineTo(120, 215); ctx.ellipse(190, 215, 70, 13, 0, Math.PI, 0); ctx.closePath(); ctx.fillStyle = ttG; ctx.fill();
      ctx.beginPath(); ctx.ellipse(190, 148, 70, 13, 0, 0, Math.PI * 2); const t3G = ctx.createRadialGradient(190, 148, 3, 190, 148, 70); t3G.addColorStop(0, "#ffd6e0"); t3G.addColorStop(1, "#a0243c"); ctx.fillStyle = t3G; ctx.fill();
      ctx.save(); ctx.font = "bold 26px serif"; ctx.fillStyle = C.goldLight; ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.shadowColor = C.gold; ctx.shadowBlur = 8; ctx.fillText("22", 190, 182); ctx.restore();
      // candle
      ctx.beginPath(); ctx.roundRect(185, 105, 10, 30, 3); const cg = ctx.createLinearGradient(185, 0, 195, 0); cg.addColorStop(0, C.goldLight); cg.addColorStop(1, C.gold); ctx.fillStyle = cg; ctx.fill();
      if (!blownRef.current) {
        const fl = Math.sin(t * 8) * 2; const fl2 = Math.cos(t * 12) * 1.5;
        ctx.save(); ctx.translate(190 + fl * 0.3, 105);
        ctx.beginPath(); ctx.moveTo(0, 0); ctx.bezierCurveTo(-8 + fl, -10, -5 + fl2, -22, 0, -28 + fl); ctx.bezierCurveTo(5 - fl2, -22, 8 - fl, -10, 0, 0);
        const fg = ctx.createRadialGradient(0, -14, 0, 0, -14, 15); fg.addColorStop(0, "rgba(255,240,100,0.95)"); fg.addColorStop(0.5, "rgba(255,140,40,0.8)"); fg.addColorStop(1, "rgba(200,50,30,0)"); ctx.fillStyle = fg; ctx.fill();
        ctx.beginPath(); ctx.moveTo(0, 0); ctx.bezierCurveTo(-4, -8, -3, -18, 0, -22); ctx.bezierCurveTo(3, -18, 4, -8, 0, 0); ctx.fillStyle = "rgba(255,255,200,0.9)"; ctx.fill();
        ctx.restore();
        const glG = ctx.createRadialGradient(190, 61, 0, 190, 61, 30); glG.addColorStop(0, "rgba(255,220,100,0.3)"); glG.addColorStop(1, "rgba(255,220,100,0)"); ctx.beginPath(); ctx.arc(190, 61, 30, 0, Math.PI * 2); ctx.fillStyle = glG; ctx.fill();
      }
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(raf);
  }, []);

  const handleClick = (e: React.MouseEvent) => {
    blownRef.current = true;
    setBlown(true);
    confetti({ particleCount: 160, spread: 120, origin: { x: e.clientX / window.innerWidth, y: e.clientY / window.innerHeight }, colors: [C.rose, C.gold, C.lavender, C.petals, "#fff"] });
  };

  return (
    <div onClick={handleClick} style={{ cursor: "pointer", position: "relative", display: "inline-block" }} title="Click to blow out the candle!">
      <motion.canvas ref={ref} width={380} height={420} animate={{ y: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 3.8, ease: "easeInOut" }} style={{ display: "block", maxWidth: "100%" }} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} />
      {blown && (
        <motion.div initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", fontFamily: "serif", fontSize: "1.5rem", color: C.goldLight, textAlign: "center", pointerEvents: "none", textShadow: `0 0 20px ${C.gold}` }}>
          🎉 Wish Made! 🌹
        </motion.div>
      )}
    </div>
  );
}

function MusicBar() {
  const [playing, setPlaying] = useState(false);
  const ctxRef = useRef<AudioContext | null>(null);
  const toggle = () => {
    if (!playing) {
      if (!ctxRef.current) {
        const ac = new (window.AudioContext || (window as any).webkitAudioContext)();
        ctxRef.current = ac;
        const gain = ac.createGain(); gain.gain.value = 0.04; gain.connect(ac.destination);
        const notes: [number, number][] = [[261.63,0.4],[261.63,0.2],[293.66,0.5],[261.63,0.5],[349.23,0.5],[329.63,0.9],[261.63,0.4],[261.63,0.2],[293.66,0.5],[261.63,0.5],[392.0,0.5],[349.23,0.9],[261.63,0.4],[261.63,0.2],[523.25,0.5],[440.0,0.5],[349.23,0.5],[329.63,0.5],[293.66,0.9],[466.16,0.4],[466.16,0.2],[440.0,0.5],[349.23,0.5],[392.0,0.5],[349.23,0.9]];
        let t = ac.currentTime + 0.1;
        notes.forEach(([freq, dur]) => { const osc = ac.createOscillator(); const g = ac.createGain(); osc.type = "sine"; osc.frequency.value = freq; g.gain.setValueAtTime(0.05, t); g.gain.exponentialRampToValueAtTime(0.001, t + dur); osc.connect(g); g.connect(gain); osc.start(t); osc.stop(t + dur + 0.05); t += dur + 0.05; });
      } else { ctxRef.current.resume(); }
    } else { ctxRef.current?.suspend(); }
    setPlaying(p => !p);
  };
  return (
    <motion.div onClick={toggle} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 2 }} whileHover={{ scale: 1.05 }} style={{ position: "fixed", bottom: "2rem", right: "2rem", zIndex: 1000, background: "rgba(26,10,13,0.85)", border: `1px solid rgba(212,168,67,0.3)`, borderRadius: 50, padding: "0.7rem 1.2rem", display: "flex", alignItems: "center", gap: "0.8rem", backdropFilter: "blur(20px)", cursor: "pointer" }}>
      <motion.span animate={playing ? { rotate: 360 } : { rotate: 0 }} transition={playing ? { repeat: Infinity, duration: 3, ease: "linear" } : {}} style={{ fontSize: "1.2rem", display: "inline-block" }}>🌹</motion.span>
      <span style={{ fontSize: "0.7rem", letterSpacing: "0.1em", color: "rgba(255,255,255,0.6)" }}>Birthday Melody</span>
      <div style={{ display: "flex", alignItems: "center", gap: 2, height: 16 }}>
        {[6, 10, 14, 8, 12].map((h, i) => (
          <motion.div key={i} animate={playing ? { scaleY: [0.4, 1, 0.4] } : { scaleY: 0.4 }} transition={playing ? { repeat: Infinity, duration: 0.8, delay: i * 0.15, ease: "easeInOut" } : {}} style={{ width: 2, height: h, background: C.gold, borderRadius: 1, transformOrigin: "bottom" }} />
        ))}
      </div>
    </motion.div>
  );
}

function Reveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  return (
    <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.15 }} transition={{ duration: 0.9, ease: "easeOut", delay }}>
      {children}
    </motion.div>
  );
}

function FloralDivider({ emoji = "🌸 🥀 🌸" }: { emoji?: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "1rem", padding: "2rem 0", opacity: 0.45, fontSize: "1.2rem", position: "relative", zIndex: 10 }}>
      <div style={{ height: 1, width: 80, background: `linear-gradient(to right, transparent, ${C.gold})` }} />
      <span>{emoji}</span>
      <div style={{ height: 1, width: 80, background: `linear-gradient(to left, transparent, ${C.gold})` }} />
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(2rem,5vw,3.5rem)", fontWeight: 700, background: `linear-gradient(135deg, ${C.goldLight}, ${C.rose})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text", marginBottom: "2.5rem" }}>
      {children}
    </h2>
  );
}

function PhotoWishShow() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setActive(i => (i + 1) % PHOTO_WISHES.length);
    }, 3600);
    return () => clearInterval(id);
  }, []);

  const item = PHOTO_WISHES[active];

  return (
    <div style={{ width: "100%", maxWidth: 980, margin: "0 auto", position: "relative" }}>
      <div style={{ position: "absolute", inset: "-3rem 10%", background: `radial-gradient(circle at 50% 35%, rgba(232,99,122,0.22), transparent 58%), radial-gradient(circle at 30% 70%, rgba(212,168,67,0.16), transparent 42%)`, filter: "blur(12px)", pointerEvents: "none" }} />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "2rem", alignItems: "center", position: "relative" }}>
        <div style={{ minHeight: 420, display: "grid", placeItems: "center", perspective: 1000 }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, scale: 0.62, rotateY: -18, y: 60 }}
              animate={{ opacity: 1, scale: 1, rotateY: 0, y: 0 }}
              exit={{ opacity: 0, scale: 0.72, rotateY: 18, y: -40 }}
              transition={{ duration: 0.9, ease: "easeOut" }}
              style={{ width: "min(78vw, 340px)", aspectRatio: "4 / 5", borderRadius: 24, padding: 10, background: `linear-gradient(145deg, rgba(255,245,224,0.95), rgba(232,99,122,0.28), rgba(212,168,67,0.7))`, boxShadow: "0 28px 90px rgba(0,0,0,0.45), 0 0 45px rgba(232,99,122,0.25)", position: "relative" }}
            >
              <motion.img
                src={item.url}
                alt={item.alt}
                animate={{ scale: [1, 1.04, 1], y: [0, -8, 0] }}
                transition={{ duration: 3.6, repeat: Infinity, ease: "easeInOut" }}
                style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: 18, display: "block", filter: "saturate(1.1) contrast(1.04)" }}
              />
              <motion.div
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35, duration: 0.7 }}
                style={{ position: "absolute", left: "50%", bottom: -22, transform: "translateX(-50%)", width: "86%", background: "rgba(26,10,13,0.9)", border: `1px solid rgba(212,168,67,0.35)`, borderRadius: 16, padding: "0.9rem 1rem", backdropFilter: "blur(18px)", boxShadow: "0 14px 35px rgba(0,0,0,0.35)" }}
              >
                <div style={{ fontSize: "0.65rem", letterSpacing: "0.22em", color: C.gold, textTransform: "uppercase", marginBottom: "0.35rem" }}>{item.tag}</div>
                <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.05rem", lineHeight: 1.35, color: "rgba(255,255,255,0.92)", fontStyle: "italic" }}>{item.wish}</div>
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>

        <div style={{ textAlign: "left", maxWidth: 430, justifySelf: "center" }}>
          <div style={{ color: C.gold, letterSpacing: "0.28em", textTransform: "uppercase", fontSize: "0.72rem", marginBottom: "1rem" }}>One by one wishes</div>
          <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(2.2rem,5vw,4rem)", lineHeight: 1, margin: 0, color: "#fff5e0" }}>A little wish with every photo</h3>
          <p style={{ color: "rgba(255,255,255,0.58)", lineHeight: 1.8, marginTop: "1.2rem", fontSize: "0.98rem" }}>
            Each photo pops up softly, floats for a moment, and reveals a birthday wish before the next memory arrives.
          </p>
          <div style={{ display: "flex", gap: 8, marginTop: "1.6rem", flexWrap: "wrap" }}>
            {PHOTO_WISHES.map((_, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                aria-label={`Show wish ${i + 1}`}
                style={{ width: i === active ? 34 : 10, height: 10, borderRadius: 999, border: 0, cursor: "pointer", background: i === active ? `linear-gradient(90deg, ${C.goldLight}, ${C.rose})` : "rgba(255,255,255,0.22)", transition: "all 0.3s ease" }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const twText = useTypewriter();
  const countdown = useCountdown();
  const { scrollY } = useScroll();
  const heroNameY = useTransform(scrollY, [0, 600], [0, 150]);

  return (
    <div style={{ background: C.dark, color: "#fff", fontFamily: "'Inter', sans-serif", overflowX: "hidden", minHeight: "100vh" }}>
      <StarsCanvas />
      <PetalsCanvas />
      <FireworksCanvas />
      <MusicBar />

      {/* ── HERO ── */}
      <section style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "2rem", position: "relative", zIndex: 10 }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 1 }} style={{ fontSize: "0.75rem", letterSpacing: "0.35em", color: C.gold, textTransform: "uppercase" }}>
          A special celebration for
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 1 }}
          style={{
            y: heroNameY,
            fontFamily: "'Playfair Display', serif",
            fontSize: "clamp(5rem,14vw,12rem)",
            fontWeight: 900,
            lineHeight: 0.9,
            background: `linear-gradient(135deg, ${C.goldLight} 0%, ${C.rose} 40%, ${C.lavender} 70%, ${C.goldLight} 100%)`,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            filter: "drop-shadow(0 0 40px rgba(232,99,122,0.4))",
          } as any}
        >
          Isha
        </motion.h1>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9, duration: 1 }} style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(1.4rem,3vw,2.2rem)", fontStyle: "italic", color: C.petals, marginTop: "0.5rem" }}>
          turns twenty-two 🌹
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.1, duration: 1 }} style={{ fontSize: "0.8rem", letterSpacing: "0.2em", color: "rgba(255,255,255,0.45)", marginTop: "0.4rem" }}>
          A journey traveller. A soul that blooms.
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.8 }} style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(1rem,2vw,1.4rem)", color: C.petals, fontStyle: "italic", minHeight: "2em", margin: "1rem 0" }}>
          {twText}
          <motion.span animate={{ opacity: [1, 0, 1] }} transition={{ repeat: Infinity, duration: 0.8 }} style={{ display: "inline-block", width: 2, height: "1.2em", background: C.gold, verticalAlign: "bottom", marginLeft: 2 }} />
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2 }} style={{ position: "absolute", bottom: "2.5rem", left: "50%", transform: "translateX(-50%)", display: "flex", flexDirection: "column", alignItems: "center", gap: "0.5rem" }}>
          <span style={{ fontSize: "0.65rem", letterSpacing: "0.3em", color: "rgba(255,255,255,0.35)", textTransform: "uppercase" }}>Scroll to explore</span>
          <motion.div animate={{ scaleY: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }} style={{ width: 1, height: 50, background: `linear-gradient(to bottom, ${C.gold}, transparent)`, transformOrigin: "top" }} />
        </motion.div>
      </section>

      <FloralDivider emoji="🌸 🥀 🌸" />

      {/* ── CAKE ── */}
      <section style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "4rem 2rem", textAlign: "center", position: "relative", zIndex: 10 }}>
        <Reveal><SectionTitle>Make a Wish! 🕯️</SectionTitle></Reveal>
        <Reveal delay={0.1}><p style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.8rem", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: "2rem" }}>Click the cake to celebrate</p></Reveal>
        <Reveal delay={0.2}><CakeCanvas /></Reveal>
        <Reveal delay={0.3}><p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.1rem", fontStyle: "italic", color: C.petals, marginTop: "1rem" }}>Every rose that bloomed today did so for you 🌹</p></Reveal>
      </section>

      <FloralDivider emoji="🌹 📸 🌹" />

      {/* ── PHOTO WISHES ── */}
      <section style={{ minHeight: "85vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "4rem 2rem", textAlign: "center", position: "relative", zIndex: 10 }}>
        <Reveal><SectionTitle>Photo Wishes for Isha</SectionTitle></Reveal>
        <Reveal delay={0.15}><PhotoWishShow /></Reveal>
      </section>

      <FloralDivider emoji="✈️ 🌍 ✈️" />

      {/* ── COUNTDOWN ── */}
      <section style={{ minHeight: "60vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "4rem 2rem", textAlign: "center", position: "relative", zIndex: 10 }}>
        <Reveal><SectionTitle>Your Next Adventure Awaits</SectionTitle></Reveal>
        <Reveal delay={0.1}><p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", color: "rgba(255,255,255,0.5)", fontSize: "1rem", marginBottom: "2rem" }}>Just like the wanderer you are — always counting down to the next destination 🗺️</p></Reveal>
        <Reveal delay={0.2}>
          {countdown.isToday ? (
            <motion.p animate={{ scale: [1, 1.05, 1] }} transition={{ repeat: Infinity, duration: 1.5 }} style={{ fontSize: "2rem", color: C.gold }}>🎉 TODAY IS THE DAY! Happy Birthday Isha! 🎉</motion.p>
          ) : (
            <>
              <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap", justifyContent: "center" }}>
                {[{ label: "Days", val: countdown.days }, { label: "Hours", val: countdown.hours }, { label: "Minutes", val: countdown.mins }, { label: "Seconds", val: countdown.secs }].map(({ label, val }) => (
                  <motion.div key={label} whileHover={{ scale: 1.05 }} style={{ background: "rgba(255,255,255,0.03)", border: `1px solid rgba(212,168,67,0.2)`, borderRadius: 16, padding: "1.5rem 2rem", minWidth: 100, backdropFilter: "blur(10px)" }}>
                    <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "4rem", letterSpacing: "0.06em", background: `linear-gradient(160deg, #fff5e0 0%, ${C.goldLight} 40%, ${C.rose} 100%)`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text", display: "block", lineHeight: 1 }}>{String(val).padStart(2, "0")}</span>
                    <span style={{ fontSize: "0.65rem", letterSpacing: "0.3em", color: "rgba(255,255,255,0.4)", textTransform: "uppercase", display: "block", marginTop: "0.4rem" }}>{label}</span>
                  </motion.div>
                ))}
              </div>
              <p style={{ marginTop: "1.5rem", fontSize: "0.85rem", color: C.gold, letterSpacing: "0.1em" }}>
                {countdown.days === 0 ? "🎉 Her birthday is TODAY!" : countdown.days === 1 ? "Just 1 day left! 🌹" : `${countdown.days} days until the magic begins ✨`}
              </p>
            </>
          )}
        </Reveal>
      </section>

      <FloralDivider emoji="🌹 💌 🌹" />

      {/* ── MESSAGE ── */}
      <section style={{ padding: "4rem 2rem", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", position: "relative", zIndex: 10 }}>
        <Reveal><SectionTitle>A Letter to Isha 💌</SectionTitle></Reveal>
        <Reveal delay={0.1}>
          <motion.div whileHover={{ borderColor: C.rose }} style={{ background: "rgba(255,255,255,0.03)", border: `1px solid rgba(232,99,122,0.2)`, borderRadius: 24, padding: "3rem", maxWidth: 860, backdropFilter: "blur(20px)", position: "relative", overflow: "hidden", transition: "border-color 0.3s" }}>
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "10rem", color: "rgba(212,168,67,0.07)", position: "absolute", top: "-1rem", left: "1rem", lineHeight: 1, pointerEvents: "none" }}>"</div>
            <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(1.1rem,2.2vw,1.55rem)", fontWeight: 300, lineHeight: 1.9, color: "rgba(255,255,255,0.85)", fontStyle: "italic", position: "relative", zIndex: 1 }}>
              Dear Isha,<br /><br />
              Twenty-two years ago, the world gained someone who would make it immeasurably brighter.
              You carry within you a spirit that refuses to stay still — always chasing sunsets in cities you've never seen,
              finding magic in cobblestone streets, and collecting memories from corners of the world most people only dream of.<br /><br />
              On this day that belongs entirely to you, I hope you feel every ounce of the joy you so freely give to others.
              May this year bring you the most breathtaking views, the most unexpected adventures, and the most beautiful moments —
              the kind that make your eyes light up the way only yours do.<br /><br />
              The world is a map, and you, Isha, are the most wonderful explorer of it. Here's to 22 — may it be your most dazzling chapter yet.<br /><br />
              With all my love,
            </p>
            <div style={{ marginTop: "2rem", fontFamily: "'Playfair Display', serif", fontSize: "1.1rem", color: C.gold }}>— Arup 🌹</div>
          </motion.div>
        </Reveal>
      </section>

      <FloralDivider emoji="📸 🌸 📸" />

      {/* ── GALLERY ── */}
      <section style={{ padding: "4rem 2rem", textAlign: "center", position: "relative", zIndex: 10 }}>
        <Reveal><SectionTitle>Gallery of You 📸</SectionTitle></Reveal>
        <Reveal delay={0.1}><p style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.35)", marginBottom: "1.5rem", letterSpacing: "0.1em" }}>Roses, adventures & beautiful moments 🌹</p></Reveal>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "1rem", maxWidth: 1000, margin: "0 auto" }}>
          {GALLERY.map((img, i) => (
            <Reveal key={i} delay={i * 0.08}>
              <motion.div whileHover={{ scale: 1.04, y: -4, boxShadow: `0 10px 40px rgba(232,99,122,0.35)` }} style={{ aspectRatio: "1", borderRadius: 16, overflow: "hidden", border: `1px solid rgba(232,99,122,0.15)`, cursor: "pointer", background: C.dark2 }}>
                <img src={img.url} alt={img.alt} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
              </motion.div>
            </Reveal>
          ))}
        </div>
      </section>

      <FloralDivider emoji="🌸 🌹 🌸" />

      {/* ── FOOTER ── */}
      <footer style={{ textAlign: "center", padding: "3rem 2rem", position: "relative", zIndex: 10 }}>
        <p style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.4rem", color: C.rose, marginBottom: "1rem" }}>Happy 22nd Birthday, Isha 🌹</p>
        <p style={{ fontSize: "0.7rem", letterSpacing: "0.2em", color: "rgba(255,255,255,0.2)" }}>Made with <span style={{ color: C.rose }}>♥</span> — click anywhere to celebrate</p>
      </footer>
    </div>
  );
}
