import { useEffect, useRef } from "react";
import confetti from "canvas-confetti";

export function ConfettiButton({ children, className }: { children: React.ReactNode; className?: string }) {
  const buttonRef = useRef<HTMLButtonElement>(null);

  const fire = () => {
    const rect = buttonRef.current?.getBoundingClientRect();
    const x = rect ? (rect.left + rect.width / 2) / window.innerWidth : 0.5;
    const y = rect ? (rect.top + rect.height / 2) / window.innerHeight : 0.5;
    confetti({
      particleCount: 120,
      spread: 100,
      origin: { x, y },
      colors: ["#ff6bba", "#ffd700", "#7c3aed", "#00e5ff", "#ff4500", "#39ff14"],
      startVelocity: 35,
    });
  };

  return (
    <button ref={buttonRef} onClick={fire} className={className}>
      {children}
    </button>
  );
}

export function AutoConfetti() {
  useEffect(() => {
    const duration = 3000;
    const end = Date.now() + duration;
    const frame = () => {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ["#ff6bba", "#ffd700", "#7c3aed"],
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ["#00e5ff", "#ff4500", "#39ff14"],
      });
      if (Date.now() < end) requestAnimationFrame(frame);
    };
    frame();
  }, []);

  return null;
}
