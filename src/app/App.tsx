import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useScroll, useTransform } from "motion/react";
import confetti from "canvas-confetti";
import { PHOTOS, HAS_REAL_PHOTOS } from "./photos";
import { WISHES } from "./wishes";
import { TRACKS, HAS_LOCAL_MUSIC } from "./music";
import { REASONS, FINAL_REASON_MESSAGE } from "./reasons";

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

// Real photos (dropped into src/photos/) when present, else stock placeholders.
const FALLBACK_PHOTOS = GALLERY.map((g) => g.url);
const SHOW_PHOTOS = HAS_REAL_PHOTOS ? PHOTOS : FALLBACK_PHOTOS;

// Each photo paired with a heartfelt wish, in order (wishes loop if fewer than photos).
const PHOTO_WISHES = SHOW_PHOTOS.map((url, i) => ({
  url,
  alt: `Isha — photo ${i + 1}`,
  ...WISHES[i % WISHES.length],
}));

const PHRASES = [
  "Happy 21st Birthday, Isha! 🎉",
  "The most beautiful soul 🌸",
  "May all your wishes come true ✨",
  "Today is all about you 🎂",
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

// Her birth date — June 12, 2005 (turns 21 on June 12, 2026).
const BIRTH = new Date(2005, 5, 12);

// Live age ticker: years / days / hours / mins / secs since birth.
function useAge() {
  const [age, setAge] = useState({ years: 0, days: 0, hours: 0, mins: 0, secs: 0 });
  useEffect(() => {
    const calc = () => {
      const now = new Date();
      let years = now.getFullYear() - BIRTH.getFullYear();
      let anniv = new Date(now.getFullYear(), BIRTH.getMonth(), BIRTH.getDate());
      if (now < anniv) { years -= 1; anniv = new Date(now.getFullYear() - 1, BIRTH.getMonth(), BIRTH.getDate()); }
      let diff = now.getTime() - anniv.getTime();
      const days = Math.floor(diff / 86400000); diff -= days * 86400000;
      const hours = Math.floor(diff / 3600000); diff -= hours * 3600000;
      const mins = Math.floor(diff / 60000); diff -= mins * 60000;
      const secs = Math.floor(diff / 1000);
      setAge({ years, days, hours, mins, secs });
    };
    calc();
    const id = setInterval(calc, 1000);
    return () => clearInterval(id);
  }, []);
  return age;
}

// Full-screen gate: the site stays hidden behind a countdown until her
// birthday (June 12, midnight). Then a button reveals the surprise.
// Add ?preview to the URL to bypass while building.
function gateTarget() { const n = new Date(); return new Date(n.getFullYear(), 5, 12); }
function isUnlockedNow() {
  if (typeof window !== "undefined" && window.location.search.includes("preview")) return true;
  return new Date() >= gateTarget();
}

function CountdownGate({ onEnter }: { onEnter: () => void }) {
  const [left, setLeft] = useState({ days: 0, hours: 0, mins: 0, secs: 0, done: false });
  useEffect(() => {
    const calc = () => {
      let diff = gateTarget().getTime() - Date.now();
      if (diff <= 0) { setLeft(l => l.done ? l : { days: 0, hours: 0, mins: 0, secs: 0, done: true }); return; }
      const days = Math.floor(diff / 86400000); diff -= days * 86400000;
      const hours = Math.floor(diff / 3600000); diff -= hours * 3600000;
      const mins = Math.floor(diff / 60000); diff -= mins * 60000;
      setLeft({ days, hours, mins, secs: Math.floor(diff / 1000), done: false });
    };
    calc();
    const id = setInterval(calc, 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (left.done) confetti({ particleCount: 180, spread: 110, origin: { y: 0.6 }, colors: ["#e8637a", "#f5d78e", "#d4a843", "#f9c0cb"] });
  }, [left.done]);

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 5000, background: C.dark, color: "#fff", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "2rem", fontFamily: "'Inter', sans-serif" }}>
      <StarsCanvas />
      <PetalsCanvas />
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }} style={{ position: "relative", zIndex: 10 }}>
        <div style={{ fontSize: "0.7rem", letterSpacing: "0.35em", color: C.gold, textTransform: "uppercase", marginBottom: "1rem" }}>A surprise is blooming for</div>
        <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(3rem,10vw,6rem)", fontWeight: 900, background: `linear-gradient(160deg, #fff5e0 0%, ${C.goldLight} 40%, ${C.rose} 100%)`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text", lineHeight: 1.1, marginBottom: "2rem" }}>Isha 🌹</div>
        {!left.done ? (
          <>
            <div style={{ display: "flex", gap: "0.8rem", flexWrap: "wrap", justifyContent: "center" }}>
              {[{ label: "Days", val: left.days }, { label: "Hours", val: left.hours }, { label: "Minutes", val: left.mins }, { label: "Seconds", val: left.secs }].map(({ label, val }) => (
                <div key={label} style={{ background: "rgba(255,255,255,0.03)", border: `1px solid rgba(212,168,67,0.25)`, borderRadius: 16, padding: "1.2rem 1.4rem", minWidth: 86, backdropFilter: "blur(10px)" }}>
                  <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "3.2rem", letterSpacing: "0.06em", background: `linear-gradient(160deg, #fff5e0 0%, ${C.goldLight} 40%, ${C.rose} 100%)`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text", display: "block", lineHeight: 1 }}>{String(val).padStart(2, "0")}</span>
                  <span style={{ fontSize: "0.6rem", letterSpacing: "0.3em", color: "rgba(255,255,255,0.4)", textTransform: "uppercase", display: "block", marginTop: "0.35rem" }}>{label}</span>
                </div>
              ))}
            </div>
            <p style={{ marginTop: "1.8rem", fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontSize: "1.05rem", color: "rgba(255,255,255,0.5)" }}>Something magical opens when the timer ends… ✨</p>
          </>
        ) : (
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.7 }}>
            <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontSize: "1.3rem", color: C.petals, marginBottom: "1.6rem" }}>It's time… Happy 21st Birthday! 🎂</p>
            <motion.button onClick={onEnter} whileTap={{ scale: 0.92 }} animate={{ scale: [1, 1.06, 1] }} transition={{ repeat: Infinity, duration: 1.4 }} style={{ background: `radial-gradient(circle at 35% 30%, ${C.rose}, ${C.roseDeep})`, border: `2px solid rgba(245,215,142,0.5)`, borderRadius: 999, padding: "1.1rem 2.6rem", color: "#fff5e0", fontSize: "1.05rem", letterSpacing: "0.08em", cursor: "pointer", boxShadow: `0 0 45px rgba(232,99,122,0.5)` }}>
              Open Your Surprise 🎁
            </motion.button>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
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
      ctx.save(); ctx.font = "bold 26px serif"; ctx.fillStyle = C.goldLight; ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.shadowColor = C.gold; ctx.shadowBlur = 8; ctx.fillText("21", 190, 182); ctx.restore();
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

// Spotify fallback playlist (used only when src/music/ has no audio files).
const TRACK_IDS = ["2pW5kNCx133MWWirxegvng", "0uROb6x5IunKokDggpmwKz"];

// Shared floating button look (🌹 + "Birthday Melody" + equalizer).
function MusicButton({ playing, ready, onToggle }: { playing: boolean; ready: boolean; onToggle: (e: React.MouseEvent) => void }) {
  return (
    <motion.div onClick={onToggle} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 2 }} whileHover={{ scale: 1.05 }} title={ready ? (playing ? "Pause music" : "Play birthday music") : "Loading music…"} style={{ position: "fixed", bottom: "2rem", right: "2rem", zIndex: 1000, background: "rgba(26,10,13,0.85)", border: `1px solid rgba(212,168,67,0.3)`, borderRadius: 50, padding: "0.7rem 1.2rem", display: "flex", alignItems: "center", gap: "0.8rem", backdropFilter: "blur(20px)", cursor: "pointer" }}>
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

// Plays the audio files dropped into src/music/ — one after another, looping.
function LocalMusicBar() {
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const idxRef = useRef(0);

  useEffect(() => {
    const audio = new Audio(TRACKS[0]);
    audio.volume = 0.7;
    audioRef.current = audio;
    const onEnded = () => {
      idxRef.current = (idxRef.current + 1) % TRACKS.length;
      audio.src = TRACKS[idxRef.current];
      audio.play().catch(() => {});
    };
    const onPlay = () => { setPlaying(true); startedRef.current = true; };
    const onPause = () => setPlaying(false);
    audio.addEventListener("ended", onEnded);
    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPause);
    // Try to start the moment the site opens; if the browser blocks
    // autoplay with sound, the first-tap fallback below takes over.
    audio.play().catch(() => {});
    return () => {
      audio.pause();
      audio.removeEventListener("ended", onEnded);
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("pause", onPause);
    };
  }, []);

  // Fallback: if the browser blocked autoplay, start on the first
  // tap/click anywhere. Disarms itself once playback has begun, so it
  // never overrides Isha pausing with the 🌹 button.
  const startedRef = useRef(false);
  useEffect(() => {
    const start = () => {
      if (startedRef.current) {
        window.removeEventListener("pointerdown", start);
        return;
      }
      audioRef.current?.play().catch(() => {});
      window.removeEventListener("pointerdown", start);
    };
    window.addEventListener("pointerdown", start);
    return () => window.removeEventListener("pointerdown", start);
  }, []);

  const toggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    const a = audioRef.current;
    if (!a) return;
    if (a.paused) a.play().catch(() => {});
    else a.pause();
  };

  return <MusicButton playing={playing} ready onToggle={toggle} />;
}

// Fallback: plays the two Spotify tracks one after another, looping.
function SpotifyMusicBar() {
  const [playing, setPlaying] = useState(false);
  const [ready, setReady] = useState(false);
  const controllerRef = useRef<any>(null);
  const idxRef = useRef(0);
  const advancingRef = useRef(false);

  useEffect(() => {
    (window as any).onSpotifyIframeApiReady = (IFrameAPI: any) => {
      const el = document.getElementById("spotify-embed-host");
      if (!el) return;
      IFrameAPI.createController(
        el,
        { uri: `spotify:track:${TRACK_IDS[0]}`, width: 300, height: 80 },
        (controller: any) => {
          controllerRef.current = controller;
          setReady(true);
          controller.addListener("playback_update", (e: any) => {
            const d = e?.data || {};
            if (typeof d.isPaused === "boolean") setPlaying(!d.isPaused);
            if (d.duration > 0 && d.position >= d.duration - 800 && !advancingRef.current) {
              advancingRef.current = true;
              idxRef.current = (idxRef.current + 1) % TRACK_IDS.length;
              controller.loadUri(`spotify:track:${TRACK_IDS[idxRef.current]}`);
              controller.play();
              setTimeout(() => (advancingRef.current = false), 2000);
            }
          });
        }
      );
    };

    const SID = "spotify-iframe-api";
    if (!document.getElementById(SID)) {
      const s = document.createElement("script");
      s.id = SID;
      s.async = true;
      s.src = "https://open.spotify.com/embed/iframe-api/v1";
      document.body.appendChild(s);
    }
  }, []);

  useEffect(() => {
    const start = () => {
      if (controllerRef.current) {
        controllerRef.current.play();
        window.removeEventListener("pointerdown", start);
      }
    };
    window.addEventListener("pointerdown", start);
    return () => window.removeEventListener("pointerdown", start);
  }, []);

  const toggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    const c = controllerRef.current;
    if (!c) return;
    if (playing) c.pause();
    else c.play();
  };

  return (
    <>
      {/* Hidden Spotify engine — rendered (not display:none) so audio keeps playing */}
      <div aria-hidden style={{ position: "fixed", left: 12, bottom: -140, width: 300, height: 80, opacity: 0, pointerEvents: "none", zIndex: -1 }}>
        <div id="spotify-embed-host" />
      </div>
      <MusicButton playing={playing} ready={ready} onToggle={toggle} />
    </>
  );
}

// Uses your own audio files if you dropped any into src/music/, else Spotify.
function MusicBar() {
  return HAS_LOCAL_MUSIC ? <LocalMusicBar /> : <SpotifyMusicBar />;
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

const SLIDE_MS = 5200;

function PhotoWishShow() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const count = PHOTO_WISHES.length;

  const go = (dir: number) => setActive((i) => (i + dir + count) % count);

  useEffect(() => {
    if (paused) return;
    const id = setTimeout(() => setActive((i) => (i + 1) % count), SLIDE_MS);
    return () => clearTimeout(id);
  }, [active, paused, count]);

  const item = PHOTO_WISHES[active];

  return (
    <div
      style={{ width: "100%", maxWidth: 720, margin: "0 auto", position: "relative" }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* counter */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.6rem", marginBottom: "1.6rem", color: C.gold, letterSpacing: "0.28em", textTransform: "uppercase", fontSize: "0.7rem" }}>
        <span style={{ color: "#fff5e0" }}>{String(active + 1).padStart(2, "0")}</span>
        <span style={{ width: 26, height: 1, background: "rgba(212,168,67,0.5)" }} />
        <span style={{ opacity: 0.7 }}>{String(count).padStart(2, "0")}</span>
      </div>

      {/* stage */}
      <div style={{ position: "relative", minHeight: 560, display: "grid", placeItems: "center", perspective: 1200 }}>
        {/* soft bloom that re-pulses on each photo */}
        <motion.div
          key={`glow-${active}`}
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.1, ease: "easeOut" }}
          style={{ position: "absolute", width: 520, height: 520, borderRadius: "50%", background: `radial-gradient(circle, rgba(232,99,122,0.35), rgba(212,168,67,0.14) 45%, transparent 70%)`, filter: "blur(28px)", pointerEvents: "none", top: "8%" }}
        />

        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, scale: 0.45, rotateY: -28, y: 80 }}
            animate={{ opacity: 1, scale: 1, rotateY: 0, y: 0 }}
            exit={{ opacity: 0, scale: 0.6, rotateY: 26, y: -60 }}
            transition={{ type: "spring", stiffness: 90, damping: 16, mass: 0.9 }}
            style={{ position: "relative", display: "flex", flexDirection: "column", alignItems: "center", transformStyle: "preserve-3d" }}
          >
            {/* photo frame — gently floats */}
            <motion.div
              animate={{ y: [0, -12, 0] }}
              transition={{ duration: 4.2, repeat: Infinity, ease: "easeInOut" }}
              style={{ width: "min(80vw, 340px)", aspectRatio: "4 / 5", borderRadius: 26, padding: 10, background: `linear-gradient(145deg, rgba(255,245,224,0.95), rgba(232,99,122,0.3), rgba(212,168,67,0.75))`, boxShadow: "0 34px 100px rgba(0,0,0,0.5), 0 0 55px rgba(232,99,122,0.3)", position: "relative", overflow: "hidden" }}
            >
              {/* Ken-Burns slow zoom */}
              <motion.img
                src={item.url}
                alt={item.alt}
                initial={{ scale: 1.12 }}
                animate={{ scale: 1 }}
                transition={{ duration: SLIDE_MS / 1000 + 1, ease: "easeOut" }}
                style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: 18, display: "block", filter: "saturate(1.08) contrast(1.04)" }}
              />
              {/* sweeping shine */}
              <motion.div
                key={`shine-${active}`}
                initial={{ x: "-120%" }}
                animate={{ x: "160%" }}
                transition={{ duration: 1.5, ease: "easeInOut", delay: 0.4 }}
                style={{ position: "absolute", top: 10, bottom: 10, left: 10, width: "45%", background: "linear-gradient(105deg, transparent, rgba(255,255,255,0.35), transparent)", pointerEvents: "none", borderRadius: 18 }}
              />
            </motion.div>

            {/* wish card */}
            <motion.div
              initial={{ opacity: 0, y: 26 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45, duration: 0.8, ease: "easeOut" }}
              style={{ marginTop: "1.4rem", width: "min(88vw, 440px)", background: "rgba(26,10,13,0.88)", border: `1px solid rgba(212,168,67,0.35)`, borderRadius: 18, padding: "1.3rem 1.5rem", backdropFilter: "blur(18px)", boxShadow: "0 18px 45px rgba(0,0,0,0.4)", textAlign: "center" }}
            >
              <div style={{ fontSize: "0.62rem", letterSpacing: "0.26em", color: C.gold, textTransform: "uppercase", marginBottom: "0.5rem" }}>{item.tag}</div>
              <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.25rem", color: "#fff5e0", marginBottom: "0.55rem" }}>{item.title}</div>
              <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.15rem", lineHeight: 1.5, color: "rgba(255,255,255,0.9)", fontStyle: "italic" }}>{item.text}</div>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* progress bar — refills each slide */}
      <div style={{ width: "min(88vw, 440px)", height: 3, margin: "1.6rem auto 0", background: "rgba(255,255,255,0.1)", borderRadius: 999, overflow: "hidden" }}>
        <motion.div
          key={`bar-${active}-${paused}`}
          initial={{ width: "0%" }}
          animate={{ width: paused ? "0%" : "100%" }}
          transition={{ duration: paused ? 0 : SLIDE_MS / 1000, ease: "linear" }}
          style={{ height: "100%", background: `linear-gradient(90deg, ${C.goldLight}, ${C.rose})`, borderRadius: 999 }}
        />
      </div>

      {/* controls + dots */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "1rem", marginTop: "1.3rem", flexWrap: "wrap" }}>
        <button onClick={() => go(-1)} aria-label="Previous photo" style={navBtn}>‹</button>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "center" }}>
          {PHOTO_WISHES.map((_, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              aria-label={`Show photo ${i + 1}`}
              style={{ width: i === active ? 30 : 10, height: 10, borderRadius: 999, border: 0, cursor: "pointer", background: i === active ? `linear-gradient(90deg, ${C.goldLight}, ${C.rose})` : "rgba(255,255,255,0.22)", transition: "all 0.3s ease", padding: 0 }}
            />
          ))}
        </div>
        <button onClick={() => go(1)} aria-label="Next photo" style={navBtn}>›</button>
      </div>
    </div>
  );
}

// ── HERO POLAROIDS ──────────────────────────────────────────
// Her 4 best photos hanging from a golden string under the hero
// name — each with a little compliment, like a memory wall.
const POLAROID_NOTES = [
  { title: "That Smile", note: "One smile, and the whole day feels lighter ✨" },
  { title: "Pure Grace", note: "Effortlessly elegant, always 👑" },
  { title: "Those Eyes", note: "Holding little galaxies inside 🌙" },
  { title: "Golden Heart", note: "The kindest soul in every room 💛" },
];

function HeroPolaroids() {
  const pics = PHOTOS.slice(0, 4);
  if (pics.length === 0) return null;
  const tilts = [-5, 3, -3, 5];
  const drops = [8, 34, 20, 0]; // vertical offsets so cards follow the string's curve
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.6, duration: 1 }} style={{ position: "relative", width: "min(96vw, 1080px)", margin: "2.5rem auto 3.5rem" }}>
      {/* golden string */}
      <svg viewBox="0 0 1080 110" preserveAspectRatio="none" style={{ position: "absolute", top: -6, left: 0, width: "100%", height: 110, pointerEvents: "none", overflow: "visible" }}>
        <path d="M0,18 Q270,92 540,58 T1080,26" fill="none" stroke="rgba(212,168,67,0.5)" strokeWidth="1.5" strokeDasharray="none" />
      </svg>

      <div style={{ display: "flex", justifyContent: "center", alignItems: "flex-start", gap: "clamp(0.7rem, 2.4vw, 1.8rem)", flexWrap: "wrap", paddingTop: 26 }}>
        {pics.map((src, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: -36, rotate: tilts[i] * 2.2 }}
            animate={{ opacity: 1, y: drops[i], rotate: [tilts[i] - 1.2, tilts[i] + 1.2, tilts[i] - 1.2] }}
            transition={{ delay: 1.8 + i * 0.18, duration: 0.9, ease: "easeOut", rotate: { repeat: Infinity, duration: 4.5 + i, ease: "easeInOut", delay: 2.8 } }}
            whileHover={{ y: drops[i] - 10, rotate: 0, scale: 1.05, zIndex: 20 }}
            style={{ position: "relative", transformOrigin: "top center", background: "linear-gradient(170deg, #fffaf2, #f7ecdd)", borderRadius: 14, padding: "0.55rem 0.55rem 0.8rem", width: "clamp(150px, 21vw, 215px)", boxShadow: "0 22px 45px rgba(0,0,0,0.45), 0 0 30px rgba(212,168,67,0.12)" }}
          >
            {/* golden clip pinning the card to the string */}
            <div style={{ position: "absolute", top: -16, left: "50%", transform: "translateX(-50%)", width: 26, height: 24, background: `linear-gradient(160deg, ${C.goldLight}, ${C.gold})`, borderRadius: "6px 6px 4px 4px", boxShadow: "0 3px 8px rgba(0,0,0,0.35)" }}>
              <div style={{ position: "absolute", top: 5, left: "50%", transform: "translateX(-50%)", width: 8, height: 8, borderRadius: "50%", background: C.dark }} />
            </div>

            <div style={{ borderRadius: 9, overflow: "hidden", aspectRatio: "4 / 5", background: "#e9dcc8" }}>
              <img src={src} alt={POLAROID_NOTES[i % POLAROID_NOTES.length].title} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
            </div>
            <div style={{ textAlign: "left", padding: "0.55rem 0.3rem 0" }}>
              <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "0.92rem", fontWeight: 700, color: "#3a2228" }}>{POLAROID_NOTES[i % POLAROID_NOTES.length].title}</div>
              <div style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontSize: "0.8rem", lineHeight: 1.35, color: "#7a5a60", marginTop: 2 }}>{POLAROID_NOTES[i % POLAROID_NOTES.length].note}</div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

// ── 21 REASONS I ADORE YOU ──────────────────────────────────
// Tap the heart → a new reason pops up with floating hearts.
// Reaching 21/21 triggers the grand finale message + confetti.
function ReasonsSection() {
  const [count, setCount] = useState(0); // how many reasons revealed so far
  const [hearts, setHearts] = useState<{ id: number; x: number; emoji: string; drift: number }[]>([]);
  const heartId = useRef(0);
  const done = count >= REASONS.length;

  const tap = () => {
    if (done) return;
    const next = count + 1;
    setCount(next);
    // spawn a little burst of floating hearts at random positions
    const emojis = ["💖", "💝", "💗", "🌹", "✨", "💛"];
    const burst = Array.from({ length: 5 }, () => ({
      id: ++heartId.current,
      x: 10 + Math.random() * 80, // % across the card
      emoji: emojis[Math.floor(Math.random() * emojis.length)],
      drift: (Math.random() - 0.5) * 60,
    }));
    setHearts(h => [...h.slice(-20), ...burst]);
    if (next === REASONS.length) {
      confetti({ particleCount: 160, spread: 100, origin: { y: 0.6 }, colors: ["#e8637a", "#f5d78e", "#d4a843", "#f9c0cb"] });
    }
  };

  return (
    <div style={{ position: "relative", width: "min(92vw, 560px)", margin: "0 auto", textAlign: "center" }}>
      {/* floating hearts layer */}
      <div style={{ position: "absolute", inset: 0, overflow: "visible", pointerEvents: "none", zIndex: 5 }}>
        <AnimatePresence>
          {hearts.map(h => (
            <motion.span
              key={h.id}
              initial={{ opacity: 0, y: 40, x: 0, scale: 0.4 }}
              animate={{ opacity: [0, 1, 1, 0], y: -160, x: h.drift, scale: 1.1, rotate: h.drift }}
              exit={{ opacity: 0 }}
              transition={{ duration: 2.2, ease: "easeOut" }}
              onAnimationComplete={() => setHearts(hs => hs.filter(x => x.id !== h.id))}
              style={{ position: "absolute", left: `${h.x}%`, bottom: "30%", fontSize: "1.5rem" }}
            >
              {h.emoji}
            </motion.span>
          ))}
        </AnimatePresence>
      </div>

      {/* counter — same style as the countdown numbers */}
      <motion.div whileHover={{ scale: 1.05 }} style={{ display: "inline-block", background: "rgba(255,255,255,0.03)", border: `1px solid rgba(212,168,67,0.2)`, borderRadius: 16, padding: "1.2rem 2rem", minWidth: 150, backdropFilter: "blur(10px)", marginBottom: "1.6rem" }}>
        <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "4rem", letterSpacing: "0.06em", background: `linear-gradient(160deg, #fff5e0 0%, ${C.goldLight} 40%, ${C.rose} 100%)`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text", display: "block", lineHeight: 1 }}>
          {String(count).padStart(2, "0")}<span style={{ fontSize: "2.2rem", margin: "0 0.25rem" }}>/</span>{REASONS.length}
        </span>
        <span style={{ fontSize: "0.65rem", letterSpacing: "0.3em", color: "rgba(255,255,255,0.4)", textTransform: "uppercase", display: "block", marginTop: "0.4rem" }}>reasons discovered</span>
      </motion.div>

      {/* progress trail of tiny hearts */}
      <div style={{ display: "flex", justifyContent: "center", gap: 5, flexWrap: "wrap", marginBottom: "1.6rem", maxWidth: 420, marginLeft: "auto", marginRight: "auto" }}>
        {REASONS.map((_, i) => (
          <motion.span key={i} animate={i < count ? { scale: [0, 1.4, 1], opacity: 1 } : { scale: 1, opacity: 0.18 }} transition={{ duration: 0.4 }} style={{ fontSize: "0.8rem" }}>
            {i < count ? "💖" : "🤍"}
          </motion.span>
        ))}
      </div>

      {/* reason card */}
      <div style={{ minHeight: 120, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "1.6rem" }}>
        <AnimatePresence mode="wait">
          {count === 0 ? (
            <motion.p key="intro" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, y: -16 }} style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontSize: "1.15rem", color: "rgba(255,255,255,0.5)" }}>
              21 years. 21 reasons. Tap the heart to discover them… 💗
            </motion.p>
          ) : (
            <motion.div
              key={`reason-${count}`}
              initial={{ opacity: 0, y: 24, scale: 0.92 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -16, scale: 0.96 }}
              transition={{ duration: 0.45, ease: "easeOut" }}
              style={{ background: "rgba(26,10,13,0.88)", border: `1px solid rgba(232,99,122,0.35)`, borderRadius: 18, padding: "1.4rem 1.6rem", backdropFilter: "blur(18px)", boxShadow: "0 16px 40px rgba(0,0,0,0.35)", maxWidth: 460 }}
            >
              <div style={{ fontSize: "0.6rem", letterSpacing: "0.28em", color: C.rose, textTransform: "uppercase", marginBottom: "0.5rem" }}>Reason {String(count).padStart(2, "0")}</div>
              <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.3rem", fontStyle: "italic", lineHeight: 1.5, color: "rgba(255,255,255,0.92)" }}>{REASONS[count - 1]}</div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* the heart button / finale */}
      {!done ? (
        <motion.button
          onClick={tap}
          whileTap={{ scale: 0.85 }}
          animate={{ scale: [1, 1.07, 1] }}
          transition={{ repeat: Infinity, duration: 1.2, ease: "easeInOut" }}
          aria-label="Reveal the next reason"
          style={{ background: `radial-gradient(circle at 35% 30%, ${C.rose}, ${C.roseDeep})`, border: `2px solid rgba(245,215,142,0.5)`, borderRadius: "50%", width: 96, height: 96, fontSize: "2.4rem", cursor: "pointer", boxShadow: `0 0 40px rgba(232,99,122,0.45), 0 14px 30px rgba(0,0,0,0.4)`, display: "inline-grid", placeItems: "center" }}
        >
          💖
        </motion.button>
      ) : (
        <motion.div initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, ease: "easeOut" }} style={{ background: "rgba(26,10,13,0.9)", border: `1.5px solid ${C.gold}`, borderRadius: 22, padding: "1.8rem 1.8rem", boxShadow: `0 0 60px rgba(212,168,67,0.35)`, maxWidth: 480, margin: "0 auto" }}>
          <motion.div animate={{ scale: [1, 1.15, 1] }} transition={{ repeat: Infinity, duration: 1.4 }} style={{ fontSize: "2rem", marginBottom: "0.6rem" }}>💝</motion.div>
          <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.35rem", color: "#fff5e0", lineHeight: 1.5 }}>{FINAL_REASON_MESSAGE}</div>
        </motion.div>
      )}

      {!done && count > 0 && (
        <p style={{ marginTop: "1rem", fontSize: "0.7rem", letterSpacing: "0.2em", color: "rgba(255,255,255,0.3)", textTransform: "uppercase" }}>keep tapping… {REASONS.length - count} to go</p>
      )}
    </div>
  );
}

const navBtn: React.CSSProperties = {
  width: 40,
  height: 40,
  borderRadius: "50%",
  border: "1px solid rgba(212,168,67,0.35)",
  background: "rgba(255,255,255,0.04)",
  color: C.goldLight,
  fontSize: "1.4rem",
  lineHeight: 1,
  cursor: "pointer",
  display: "grid",
  placeItems: "center",
  backdropFilter: "blur(10px)",
};

export default function App() {
  const twText = useTypewriter();
  const age = useAge();
  const { scrollY } = useScroll();
  const heroNameY = useTransform(scrollY, [0, 600], [0, 150]);
  const [unlocked, setUnlocked] = useState(isUnlockedNow);

  if (!unlocked) return <CountdownGate onEnter={() => setUnlocked(true)} />;

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
          turns twenty-one 🌹
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.1, duration: 1 }} style={{ fontSize: "0.8rem", letterSpacing: "0.2em", color: "rgba(255,255,255,0.45)", marginTop: "0.4rem" }}>
          A beautiful soul. A heart that blooms.
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.8 }} style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(1rem,2vw,1.4rem)", color: C.petals, fontStyle: "italic", minHeight: "2em", margin: "1rem 0" }}>
          {twText}
          <motion.span animate={{ opacity: [1, 0, 1] }} transition={{ repeat: Infinity, duration: 0.8 }} style={{ display: "inline-block", width: 2, height: "1.2em", background: C.gold, verticalAlign: "bottom", marginLeft: 2 }} />
        </motion.div>

        <HeroPolaroids />

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2 }} style={{ position: "absolute", bottom: "2.5rem", left: "50%", transform: "translateX(-50%)", display: "flex", flexDirection: "column", alignItems: "center", gap: "0.5rem" }}>
          <span style={{ fontSize: "0.65rem", letterSpacing: "0.3em", color: "rgba(255,255,255,0.35)", textTransform: "uppercase" }}>Scroll to explore</span>
          <motion.div animate={{ scaleY: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }} style={{ width: 1, height: 50, background: `linear-gradient(to bottom, ${C.gold}, transparent)`, transformOrigin: "top" }} />
        </motion.div>
      </section>

      <FloralDivider emoji="🌸 🥀 🌸" />

      {/* ── AGE TICKER ── */}
      <section style={{ minHeight: "60vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "4rem 2rem", textAlign: "center", position: "relative", zIndex: 10 }}>
        <Reveal><SectionTitle>Every Second of You ✨</SectionTitle></Reveal>
        <Reveal delay={0.1}><p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", color: "rgba(255,255,255,0.5)", fontSize: "1rem", marginBottom: "2rem" }}>This is exactly how long the world has been lucky to have you 🌹</p></Reveal>
        <Reveal delay={0.2}>
          <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap", justifyContent: "center" }}>
            {[{ label: "Years", val: age.years }, { label: "Days", val: age.days }, { label: "Hours", val: age.hours }, { label: "Minutes", val: age.mins }, { label: "Seconds", val: age.secs }].map(({ label, val }) => (
              <motion.div key={label} whileHover={{ scale: 1.05 }} style={{ background: "rgba(255,255,255,0.03)", border: `1px solid rgba(212,168,67,0.2)`, borderRadius: 16, padding: "1.5rem 2rem", minWidth: 100, backdropFilter: "blur(10px)" }}>
                <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "4rem", letterSpacing: "0.06em", background: `linear-gradient(160deg, #fff5e0 0%, ${C.goldLight} 40%, ${C.rose} 100%)`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text", display: "block", lineHeight: 1 }}>{String(val).padStart(2, "0")}</span>
                <span style={{ fontSize: "0.65rem", letterSpacing: "0.3em", color: "rgba(255,255,255,0.4)", textTransform: "uppercase", display: "block", marginTop: "0.4rem" }}>{label}</span>
              </motion.div>
            ))}
          </div>
          <p style={{ marginTop: "1.5rem", fontSize: "0.85rem", color: C.gold, letterSpacing: "0.1em" }}>…and every single one of them made the world better ✨</p>
        </Reveal>
      </section>

      <FloralDivider emoji="🎂 🎈 🎂" />

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

      <FloralDivider emoji="💖 🌹 💖" />

      {/* ── 22 REASONS ── */}
      <section style={{ minHeight: "85vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "4rem 2rem", textAlign: "center", position: "relative", zIndex: 10 }}>
        <Reveal><SectionTitle>21 Reasons I Adore You 💖</SectionTitle></Reveal>
        <Reveal delay={0.1}><p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", color: "rgba(255,255,255,0.5)", fontSize: "1rem", marginBottom: "2.2rem" }}>One for every beautiful year of you</p></Reveal>
        <Reveal delay={0.2}><ReasonsSection /></Reveal>
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
              Twenty-one years ago, the world gained someone who would make it immeasurably brighter.
              You carry within you a warmth and a kindness that touch everyone lucky enough to know you —
              the kind of soul that turns ordinary days into something worth remembering.<br /><br />
              On this day that belongs entirely to you, I hope you feel every ounce of the joy you so freely give to others.
              May this year bring you endless laughter, good health, sweet little surprises, and a thousand beautiful moments —
              the kind that make your eyes light up the way only yours do.<br /><br />
              You deserve all the happiness in the world, Isha. Here's to 21 — may it be your most dazzling year yet.<br /><br />
              Happy Birthday, with all my love,
            </p>
            <div style={{ marginTop: "2rem", fontFamily: "'Playfair Display', serif", fontSize: "1.1rem", color: C.gold }}>— Arup 🌹</div>
          </motion.div>
        </Reveal>
      </section>

      <FloralDivider emoji="📸 🌸 📸" />

      {/* ── GALLERY ── */}
      <section style={{ padding: "4rem 2rem", textAlign: "center", position: "relative", zIndex: 10 }}>
        <Reveal><SectionTitle>Gallery of You 📸</SectionTitle></Reveal>
        <Reveal delay={0.1}><p style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.35)", marginBottom: "1.5rem", letterSpacing: "0.1em" }}>Roses, smiles & beautiful birthday moments 🌹</p></Reveal>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "1rem", maxWidth: 1000, margin: "0 auto" }}>
          {SHOW_PHOTOS.map((url, i) => (
            <Reveal key={i} delay={i * 0.08}>
              <motion.div whileHover={{ scale: 1.04, y: -4, boxShadow: `0 10px 40px rgba(232,99,122,0.35)` }} style={{ aspectRatio: "1", borderRadius: 16, overflow: "hidden", border: `1px solid rgba(232,99,122,0.15)`, cursor: "pointer", background: C.dark2 }}>
                <img src={url} alt={`Isha — photo ${i + 1}`} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
              </motion.div>
            </Reveal>
          ))}
        </div>
      </section>

      <FloralDivider emoji="🌸 🌹 🌸" />

      {/* ── FOOTER ── */}
      <footer style={{ textAlign: "center", padding: "3rem 2rem", position: "relative", zIndex: 10 }}>
        <p style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.4rem", color: C.rose, marginBottom: "1rem" }}>Happy 21st Birthday, Isha 🌹</p>
        <p style={{ fontSize: "0.7rem", letterSpacing: "0.2em", color: "rgba(255,255,255,0.2)" }}>Made with <span style={{ color: C.rose }}>♥</span> — click anywhere to celebrate</p>
      </footer>
    </div>
  );
}
