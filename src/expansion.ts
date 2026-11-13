export type Weather = "Clear" | "Rain" | "Fog";
export type Career = {
  deliveries: number;
  earnings: number;
  condition: number;
  engine: number;
  economy: number;
  hour: number;
  weather: Weather;
  claimed: number[];
};
export const defaultCareer: Career = {
  deliveries: 0,
  earnings: 0,
  condition: 100,
  engine: 0,
  economy: 0,
  hour: 8,
  weather: "Clear",
  claimed: [],
};
export const milestones = [
  { goal: 1, reward: 2500, name: "First haul" },
  { goal: 3, reward: 6000, name: "Reliable carrier" },
  { goal: 10, reward: 20000, name: "Highway veteran" },
];
export function serviceCost(kind: "fuel" | "repair", fuel: number, condition: number) {
  return kind === "fuel" ? Math.ceil((100 - fuel) * 24) : Math.ceil((100 - condition) * 35);
}
export function upgradeCost(level: number) {
  return 4500 * (level + 1);
}
export function regionAt(x: number, y: number) {
  return x < -52
    ? "Desert country"
    : y > 18
      ? "Coastal wetlands"
      : y < -18
        ? "Pine highlands"
        : "Gulf lowlands";
}
export function advanceCareer(c: Career, speed: number, seconds: number): Career {
  return {
    ...c,
    hour: (c.hour + seconds / 60) % 24,
    condition: Math.max(0, c.condition - speed * seconds * 0.00006),
  };
}
export function deliveryReward(pay: number, condition: number) {
  return Math.round(pay * (0.8 + (0.2 * Math.max(0, Math.min(100, condition))) / 100));
}
export const SAVE_KEY = "29-truckers-career-v1";
export type Save = {
  money: number;
  fuel: number;
  progress: number;
  jobIndex: number;
  company: string;
  accent: string;
  position: { x: number; y: number; heading: number };
  career: Career;
  routePaid: boolean;
};
export function loadSave(): Save | null {
  try {
    const s = JSON.parse(localStorage.getItem(SAVE_KEY) || "null");
    if (
      !s ||
      ![
        s.money,
        s.fuel,
        s.progress,
        s.jobIndex,
        s.position?.x,
        s.position?.y,
        s.position?.heading,
      ].every(Number.isFinite)
    )
      return null;
    if (
      !Number.isInteger(s.jobIndex) ||
      s.jobIndex < 0 ||
      s.jobIndex >= 12 ||
      s.money < 0 ||
      s.fuel < 0 ||
      s.fuel > 100 ||
      s.progress < 0 ||
      s.progress > 100
    )
      return null;
    const c = { ...defaultCareer, ...s.career };
    if (
      ![c.deliveries, c.earnings, c.condition, c.engine, c.economy, c.hour].every(Number.isFinite)
    )
      return null;
    c.condition = Math.max(0, Math.min(100, c.condition));
    c.engine = Math.max(0, Math.min(3, Math.floor(c.engine)));
    c.economy = Math.max(0, Math.min(3, Math.floor(c.economy)));
    c.claimed = Array.isArray(c.claimed) ? c.claimed : [];
    c.weather = ["Clear", "Rain", "Fog"].includes(c.weather) ? c.weather : "Clear";
    return {
      ...s,
      company: typeof s.company === "string" ? s.company.slice(0, 60) : "Gulf Coast Logistics",
      accent: /^#[0-9a-f]{6}$/i.test(s.accent) ? s.accent : "#f7b500",
      career: c,
    };
  } catch {
    return null;
  }
}
