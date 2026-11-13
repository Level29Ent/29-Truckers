import { regionAt, type Career } from "./expansion";
export function drawWorldDetails(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  world: { x: number; y: number; heading: number; speed: number },
  career: Career,
  elapsed: number,
  roads: { x: number; y: number }[][],
) {
  const night = career.hour < 6 || career.hour >= 19,
    desert = world.x < -52,
    coast = world.y > 18;
  const project = (x: number, y: number) => {
    const dx = x - world.x,
      dy = y - world.y,
      f = dx * Math.sin(world.heading) + dy * Math.cos(world.heading),
      side = dx * Math.cos(world.heading) - dy * Math.sin(world.heading);
    if (f < 1 || f > 100) return null;
    const scale = 340 / f;
    return { x: w / 2 + side * scale, y: h * 0.37 + 2.15 * scale, k: scale, f };
  };
  // Stable world-space scenery: passing a tree moves it behind the truck rather than respawning it.
  const objects: { x: number; y: number; seed: number }[] = [];
  for (let gx = Math.floor(world.x / 8) - 12; gx <= Math.floor(world.x / 8) + 12; gx++)
    for (let gy = Math.floor(world.y / 8) - 12; gy <= Math.floor(world.y / 8) + 12; gy++) {
      const seed = Math.abs(Math.sin(gx * 127.1 + gy * 311.7));
      objects.push({ x: gx * 8 + seed * 3, y: gy * 8 + seed * 2, seed });
    }
  objects
    .filter(
      (o) =>
        !roads.some(([a, b]) => {
          const dx = b.x - a.x,
            dy = b.y - a.y,
            t = Math.max(
              0,
              Math.min(1, ((o.x - a.x) * dx + (o.y - a.y) * dy) / (dx * dx + dy * dy)),
            );
          return Math.hypot(o.x - a.x - t * dx, o.y - a.y - t * dy) < 2.5;
        }),
    )
    .map((o) => ({ ...o, p: project(o.x, o.y) }))
    .filter((o) => o.p)
    .sort((a, b) => b.p!.f - a.p!.f)
    .forEach(({ p, seed }) => {
      if (!p || p.x < -80 || p.x > w + 80) return;
      const k = p.k;
      if (seed > 0.86) {
        ctx.fillStyle = desert ? "#947355" : "#515d58";
        ctx.fillRect(p.x, p.y - k * 1.4, k * 1.4, k * 1.4);
        ctx.fillStyle = "#a9bfc1";
        ctx.fillRect(p.x + k * 0.2, p.y - k * 1.15, k * 0.5, k * 0.3);
        if (night) {
          ctx.fillStyle = "#e6c477";
          ctx.fillRect(p.x + k * 0.85, p.y - k * 0.8, k * 0.25, k * 0.2);
        }
      } else {
        ctx.strokeStyle = desert ? "#7b8051" : "#514c38";
        ctx.lineWidth = Math.max(1, k * 0.12);
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(p.x, p.y - k * (coast ? 2.8 : 2));
        ctx.stroke();
        ctx.fillStyle = desert ? "#6c7950" : coast ? "#4b7050" : "#3f5d45";
        ctx.beginPath();
        if (desert) {
          ctx.ellipse(p.x, p.y - k * 1.3, k * 0.25, k * 0.8, 0, 0, Math.PI * 2);
        } else {
          ctx.moveTo(p.x, p.y - k * 3);
          ctx.lineTo(p.x - k * 0.8, p.y - k * 0.7);
          ctx.lineTo(p.x + k * 0.8, p.y - k * 0.7);
        }
        ctx.fill();
      }
    });
  if (night) {
    ctx.fillStyle = "#071429a6";
    ctx.fillRect(0, 0, w, h);
    const beam = ctx.createRadialGradient(w * 0.5, h * 0.9, 5, w * 0.5, h * 0.9, w * 0.45);
    beam.addColorStop(0, "#ffe1a348");
    beam.addColorStop(1, "#ffe1a300");
    ctx.fillStyle = beam;
    ctx.fillRect(0, h * 0.38, w, h * 0.62);
    ctx.fillStyle = "#e4e7d2";
    ctx.beginPath();
    ctx.arc(w * 0.72, h * 0.13, 12, 0, Math.PI * 2);
    ctx.fill();
  }
  if (career.weather === "Fog") {
    const fog = ctx.createLinearGradient(0, h * 0.2, 0, h);
    fog.addColorStop(0, "#d1d9d8aa");
    fog.addColorStop(1, "#becdcc0c");
    ctx.fillStyle = fog;
    ctx.fillRect(0, 0, w, h);
  }
  if (career.weather === "Rain") {
    ctx.fillStyle = "#1c31404a";
    ctx.fillRect(0, 0, w, h);
    ctx.strokeStyle = "#c9d9e366";
    ctx.lineWidth = 1;
    for (let i = 0; i < 70; i++) {
      const x = (i * 97 + elapsed * 50) % w,
        y = (i * 173 + elapsed * 340) % h;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x - 5, y + 18);
      ctx.stroke();
    }
  }
  ctx.font = "600 10px system-ui";
  ctx.textAlign = "left";
  ctx.fillStyle = "#edf2d9";
  ctx.fillText(regionAt(world.x, world.y).toUpperCase(), 18, h * 0.48);
}
