import { useEffect, useMemo, useRef, useState } from "react";

import {
  defaultCareer,
  loadSave,
  SAVE_KEY,
  serviceCost,
  upgradeCost,
  advanceCareer,
  deliveryReward,
  milestones,
  regionAt,
  type Career,
} from "./expansion";
import { drawWorldDetails } from "./WorldDetails";
const initialSave = loadSave();

type IconName =
  | "grid"
  | "map"
  | "truck"
  | "users"
  | "garage"
  | "settings"
  | "bell"
  | "clock"
  | "fuel"
  | "pin"
  | "arrow"
  | "play"
  | "pause"
  | "chevron"
  | "dollar"
  | "briefcase"
  | "building"
  | "shield"
  | "x"
  | "check";

const paths: Record<IconName, React.ReactNode> = {
  grid: (
    <>
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
    </>
  ),
  map: (
    <>
      <path d="m3 6 5-3 8 3 5-3v15l-5 3-8-3-5 3Z" />
      <path d="M8 3v15M16 6v15" />
    </>
  ),
  truck: (
    <>
      <path d="M3 6h11v10H3zM14 10h4l3 3v3h-7z" />
      <circle cx="7" cy="18" r="2" />
      <circle cx="18" cy="18" r="2" />
    </>
  ),
  users: (
    <>
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
    </>
  ),
  garage: (
    <>
      <path d="m3 10 9-7 9 7v11H3Z" />
      <path d="M7 21v-7h10v7M7 17h10" />
    </>
  ),
  settings: (
    <>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.7 1.7 0 0 0 .34 1.88l.06.06-2.83 2.83-.06-.06A1.7 1.7 0 0 0 15 19.4a1.7 1.7 0 0 0-1 .6 1.7 1.7 0 0 0-.4 1.1V21H9.6v-.09A1.7 1.7 0 0 0 8.5 19.4a1.7 1.7 0 0 0-1.88.34l-.06.06-2.83-2.83.06-.06A1.7 1.7 0 0 0 4.6 15a1.7 1.7 0 0 0-1.51-1H3v-4h.09A1.7 1.7 0 0 0 4.6 9a1.7 1.7 0 0 0-.34-1.88l-.06-.06 2.83-2.83.06.06A1.7 1.7 0 0 0 9 4.6a1.7 1.7 0 0 0 1-.6 1.7 1.7 0 0 0 .4-1.1V3h4v.09A1.7 1.7 0 0 0 15.5 4.6a1.7 1.7 0 0 0 1.88-.34l.06-.06 2.83 2.83-.06.06A1.7 1.7 0 0 0 19.4 9a1.7 1.7 0 0 0 1.51 1H21v4h-.09A1.7 1.7 0 0 0 19.4 15Z" />
    </>
  ),
  bell: (
    <>
      <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </>
  ),
  fuel: (
    <>
      <path d="M4 21V4h10v17M2 21h14M7 8h4M14 7h3l3 3v8a2 2 0 0 1-4 0v-5h-2" />
      <path d="m17 7 2-2" />
    </>
  ),
  pin: (
    <>
      <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" />
      <circle cx="12" cy="10" r="2" />
    </>
  ),
  arrow: (
    <>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </>
  ),
  play: <path d="m8 5 11 7-11 7Z" />,
  pause: (
    <>
      <path d="M9 5v14M15 5v14" />
    </>
  ),
  chevron: <path d="m9 18 6-6-6-6" />,
  dollar: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M16 8.5c-.8-1-2-1.5-4-1.5-2.2 0-4 1.1-4 2.7 0 4.3 8 1.8 8 5.4 0 1.6-1.8 2.9-4 2.9-2 0-3.3-.6-4.2-1.7M12 5v14" />
    </>
  ),
  briefcase: (
    <>
      <rect x="3" y="7" width="18" height="13" rx="2" />
      <path d="M8 7V4h8v3M3 12h18M10 12v2h4v-2" />
    </>
  ),
  building: (
    <>
      <path d="M4 21V5l8-3 8 3v16M8 8h2M14 8h2M8 12h2M14 12h2M9 21v-5h6v5" />
    </>
  ),
  shield: (
    <>
      <path d="M12 22s8-3 8-10V5l-8-3-8 3v7c0 7 8 10 8 10Z" />
      <path d="m9 12 2 2 4-4" />
    </>
  ),
  x: (
    <>
      <path d="m6 6 12 12M18 6 6 18" />
    </>
  ),
  check: <path d="m5 12 4 4L19 6" />,
};

function Icon({ name, size = 20 }: { name: IconName; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths[name]}
    </svg>
  );
}

type WorldState = {
  x: number;
  y: number;
  heading: number;
  speed: number;
  steering: number;
  environment?: Career;
};

const cities = [
  { name: "New Orleans", short: "NOLA", x: 0, y: 5, color: "#ffb800", major: true },
  { name: "Houston", short: "HTX", x: -45, y: 12, color: "#e25139", major: true },
  { name: "Los Angeles", short: "LA", x: -90, y: -25, color: "#36a3ff", major: true },
  { name: "Miami", short: "MIA", x: 70, y: 38, color: "#1fd6a2", major: true },
  { name: "Atlanta", short: "ATL", x: 38, y: -38, color: "#b47cff", major: true },
  { name: "Desert Springs", short: "DSP", x: -68, y: -5, color: "#d9a35f", major: false },
  { name: "Bayou Vista", short: "BYV", x: -20, y: 8, color: "#75b99b", major: false },
  { name: "Palm Coast", short: "PLC", x: 48, y: 20, color: "#62b9cc", major: false },
];

const roadLinks = [
  [2, 5],
  [5, 1],
  [1, 6],
  [6, 0],
  [0, 7],
  [7, 3],
  [0, 4],
  [4, 3],
  [6, 4],
];

const jobs = [
  {
    from: "New Orleans",
    to: "Houston",
    cargo: "Industrial parts",
    pay: 12840,
    miles: 348,
    time: "5h 18m",
  },
  {
    from: "Houston",
    to: "Los Angeles",
    cargo: "Electronics",
    pay: 38200,
    miles: 1547,
    time: "23h 40m",
  },
  {
    from: "Miami",
    to: "New Orleans",
    cargo: "Fresh produce",
    pay: 26750,
    miles: 864,
    time: "12h 55m",
  },
  {
    from: "New Orleans",
    to: "Atlanta",
    cargo: "Construction steel",
    pay: 18400,
    miles: 470,
    time: "7h 10m",
  },
  {
    from: "Los Angeles",
    to: "Desert Springs",
    cargo: "Solar equipment",
    pay: 9200,
    miles: 182,
    time: "3h 05m",
  },
  {
    from: "Bayou Vista",
    to: "Palm Coast",
    cargo: "Marine supplies",
    pay: 14650,
    miles: 396,
    time: "6h 20m",
  },
  {
    from: "Palm Coast",
    to: "Miami",
    cargo: "Resort furnishings",
    pay: 11750,
    miles: 246,
    time: "4h 15m",
  },
  {
    from: "Atlanta",
    to: "Miami",
    cargo: "Express parcels",
    pay: 22100,
    miles: 662,
    time: "9h 48m",
  },
];

jobs.push(
  {
    from: "Houston",
    to: "Bayou Vista",
    cargo: "Refrigerated seafood",
    pay: 7400,
    miles: 120,
    time: "2h 10m",
  },
  {
    from: "Atlanta",
    to: "New Orleans",
    cargo: "Medical equipment",
    pay: 21500,
    miles: 470,
    time: "7h 10m",
  },
  {
    from: "Desert Springs",
    to: "Houston",
    cargo: "Wind turbine components",
    pay: 16900,
    miles: 310,
    time: "5h 00m",
  },
  {
    from: "Miami",
    to: "Palm Coast",
    cargo: "Emergency relief supplies",
    pay: 13800,
    miles: 246,
    time: "4h 15m",
  },
);

function WorldCanvas({
  worldRef,
  color,
}: {
  worldRef: React.RefObject<WorldState>;
  color: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;
    let frame = 0;
    let animation = 0;

    const project = (wx: number, wy: number, width: number, height: number) => {
      const world = worldRef.current;
      const dx = wx - world.x;
      const dy = wy - world.y;
      const forward = dx * Math.sin(world.heading) + dy * Math.cos(world.heading);
      const side = dx * Math.cos(world.heading) - dy * Math.sin(world.heading);
      if (forward < 0.8) return null;
      const scale = Math.min(850, 340 / forward);
      return { x: width / 2 + side * scale, y: height * 0.37 + 2.15 * scale, scale, forward };
    };

    const draw = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      if (canvas.width !== rect.width * dpr || canvas.height !== rect.height * dpr) {
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
      }
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      const width = rect.width;
      const height = rect.height;
      const horizon = height * 0.37;
      const world = worldRef.current;

      const sky = context.createLinearGradient(0, 0, 0, horizon);
      sky.addColorStop(0, "#718d9a");
      sky.addColorStop(0.72, "#c6c6b2");
      sky.addColorStop(1, "#e3c98e");
      context.fillStyle = sky;
      context.fillRect(0, 0, width, horizon);
      const sun = context.createRadialGradient(
        width * 0.76,
        height * 0.13,
        2,
        width * 0.76,
        height * 0.13,
        58,
      );
      sun.addColorStop(0, "rgba(255,243,190,.9)");
      sun.addColorStop(1, "rgba(255,205,105,0)");
      context.fillStyle = sun;
      context.fillRect(0, 0, width, horizon);

      const ground = context.createLinearGradient(0, horizon, 0, height);
      ground.addColorStop(0, "#66705c");
      ground.addColorStop(1, "#252c27");
      context.fillStyle = ground;
      context.fillRect(0, horizon, width, height - horizon);

      context.strokeStyle = "rgba(194,202,174,.14)";
      context.lineWidth = 1;
      for (let i = 1; i < 10; i++) {
        const y = horizon + (height - horizon) * Math.pow(i / 10, 2.15);
        context.beginPath();
        context.moveTo(0, y);
        context.lineTo(width, y);
        context.stroke();
      }

      const roadPieces: {
        points: { x: number; y: number; scale: number }[];
        distance: number;
        center: { x: number; y: number }[];
      }[] = [];
      roadLinks.forEach(([fromIndex, toIndex]) => {
        const from = cities[fromIndex];
        const to = cities[toIndex];
        const dx = to.x - from.x;
        const dy = to.y - from.y;
        const length = Math.hypot(dx, dy);
        const normalX = (-dy / length) * 1.25;
        const normalY = (dx / length) * 1.25;
        const steps = Math.ceil(length / 3);
        for (let step = 0; step < steps; step++) {
          const a = step / steps;
          const b = (step + 1) / steps;
          const ax = from.x + dx * a;
          const ay = from.y + dy * a;
          const bx = from.x + dx * b;
          const by = from.y + dy * b;
          const p1 = project(ax + normalX, ay + normalY, width, height);
          const p2 = project(ax - normalX, ay - normalY, width, height);
          const p3 = project(bx - normalX, by - normalY, width, height);
          const p4 = project(bx + normalX, by + normalY, width, height);
          const ca = project(ax, ay, width, height);
          const cb = project(bx, by, width, height);
          if (p1 && p2 && p3 && p4 && ca && cb) {
            roadPieces.push({
              points: [p1, p2, p3, p4],
              center: [ca, cb],
              distance: (p1.forward + p3.forward) / 2,
            });
          }
        }
      });
      roadPieces.sort((a, b) => b.distance - a.distance);
      roadPieces.forEach((piece) => {
        context.beginPath();
        context.moveTo(piece.points[0].x, piece.points[0].y);
        piece.points.slice(1).forEach((point) => context.lineTo(point.x, point.y));
        context.closePath();
        context.fillStyle = "#2d3234";
        context.fill();
        context.strokeStyle = "#d6c98f";
        context.lineWidth = Math.max(0.6, piece.points[0].scale * 0.012);
        context.stroke();
        context.beginPath();
        context.moveTo(piece.center[0].x, piece.center[0].y);
        context.lineTo(piece.center[1].x, piece.center[1].y);
        context.strokeStyle = piece.distance % 6 > 3 ? "#d9d3b5" : "rgba(217,211,181,.15)";
        context.stroke();
      });

      for (let index = 0; index < 4; index++) {
        const distance = 14 + ((frame * Math.max(world.speed, 8) * 0.002 + index * 23) % 82);
        const side = index % 2 === 0 ? -0.72 : 0.72;
        const trafficX =
          world.x + Math.sin(world.heading) * distance + Math.cos(world.heading) * side;
        const trafficY =
          world.y + Math.cos(world.heading) * distance - Math.sin(world.heading) * side;
        const point = project(trafficX, trafficY, width, height);
        if (!point) continue;
        const carWidth = Math.max(3, Math.min(24, point.scale * 0.55));
        const carHeight = carWidth * 0.7;
        context.fillStyle = index % 3 === 0 ? "#b7c1c4" : index % 3 === 1 ? "#8a302b" : "#253b4b";
        context.fillRect(point.x - carWidth / 2, point.y - carHeight, carWidth, carHeight);
        context.fillStyle = "#d94e3d";
        context.fillRect(point.x - carWidth * 0.35, point.y - carHeight * 0.24, carWidth * 0.18, 2);
        context.fillRect(point.x + carWidth * 0.17, point.y - carHeight * 0.24, carWidth * 0.18, 2);
      }

      cities
        .map((city) => ({ city, point: project(city.x, city.y, width, height) }))
        .filter((entry) => entry.point && entry.point.forward < 90)
        .sort((a, b) => (b.point?.forward || 0) - (a.point?.forward || 0))
        .forEach(({ city, point }) => {
          if (!point) return;
          const size = Math.max(
            2,
            Math.min(city.major ? 45 : 27, point.scale * (city.major ? 0.34 : 0.22)),
          );
          const buildings = city.major ? 7 : 4;
          for (let i = 0; i < buildings; i++) {
            const buildingHeight = size * (0.7 + ((i * 7) % 5) * 0.2);
            const buildingWidth = size * 0.3;
            const x = point.x + (i - buildings / 2) * buildingWidth * 0.9;
            context.fillStyle = i % 2 ? "#313d40" : "#263235";
            context.fillRect(x, point.y - buildingHeight, buildingWidth, buildingHeight);
            context.fillStyle = "rgba(255,203,103,.42)";
            context.fillRect(x + buildingWidth * 0.25, point.y - buildingHeight * 0.78, 2, 2);
          }
          context.fillStyle = city.color;
          context.beginPath();
          context.arc(point.x, point.y - size * 1.7, city.major ? 4 : 3, 0, Math.PI * 2);
          context.fill();
          context.fillStyle = "#f3f6f6";
          context.font = `${city.major ? "700 10px" : "600 8px"} Inter`;
          context.textAlign = "center";
          context.fillText(city.short, point.x, point.y - size * 1.7 - 8);
        });

      const motion = (frame * world.speed * 0.018) % 80;
      context.strokeStyle = color;
      context.globalAlpha = 0.24;
      context.lineWidth = 1;
      for (let i = 0; i < 8; i++) {
        const x = ((i * 137 + motion * 3) % (width + 140)) - 70;
        context.beginPath();
        context.moveTo(width / 2 + (x - width / 2) * 0.22, horizon + 8);
        context.lineTo(x, height);
        context.stroke();
      }
      context.globalAlpha = 1;
      drawWorldDetails(
        context,
        width,
        height,
        world,
        world.environment || defaultCareer,
        frame / 60,
        roadLinks.map(([a, b]) => [cities[a], cities[b]]),
      );
      frame += 1;
      animation = requestAnimationFrame(draw);
    };
    animation = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animation);
  }, [color, worldRef]);

  return (
    <canvas
      ref={canvasRef}
      className="world-canvas"
      aria-label="Driveable perspective highway environment"
    />
  );
}

function TruckScene({
  moving,
  color,
  speed,
  steering,
  laneOffset,
  worldRef,
  destination,
  destinationMiles,
  cameraMode,
  gear,
  rpm,
  fuel,
}: {
  moving: boolean;
  color: string;
  speed: number;
  steering: number;
  laneOffset: number;
  worldRef: React.RefObject<WorldState>;
  destination: (typeof cities)[number];
  destinationMiles: number;
  cameraMode: "cockpit" | "hood" | "chase";
  gear: string;
  rpm: number;
  fuel: number;
}) {
  return (
    <div
      className={`truck-scene fpv-scene camera-${cameraMode} ${moving && speed > 0 ? "moving" : ""}`}
      style={
        {
          "--steer": `${steering * 22}deg`,
          "--lane": `${laneOffset}px`,
          "--road-speed": `${Math.max(0.3, 1.35 - speed / 78)}s`,
        } as React.CSSProperties
      }
    >
      <div className="fpv-world">
        <WorldCanvas worldRef={worldRef} color={color} />
        <div className="fpv-sky" />
        <div className="fpv-city left-city">
          <i />
          <i />
          <i />
          <i />
        </div>
        <div className="fpv-city right-city">
          <i />
          <i />
          <i />
          <i />
        </div>
        <div className="fpv-road">
          <span className="road-edge left" />
          <span className="road-edge right" />
          <div className="lane-markers left">
            <i />
            <i />
            <i />
            <i />
            <i />
          </div>
          <div className="lane-markers right">
            <i />
            <i />
            <i />
            <i />
            <i />
          </div>
          <div className="traffic-car">
            <i />
            <b />
          </div>
        </div>
        <div className="highway-sign">
          <small>INTERSTATE 10</small>
          <b>HOUSTON</b>
          <span>284 MILES</span>
        </div>
        <div className="road-lights left-lights">
          <i />
          <i />
          <i />
        </div>
        <div className="road-lights right-lights">
          <i />
          <i />
          <i />
        </div>
      </div>

      <div className="windshield-frame">
        <span className="roof-frame" />
        <span className="pillar left" />
        <span className="pillar right" />
        <span className="windshield-shade" />
      </div>

      <div className="side-mirror left-mirror">
        <div>
          <span />
        </div>
        <i />
      </div>
      <div className="side-mirror right-mirror">
        <div>
          <span />
        </div>
        <i />
      </div>

      <div className="cab-dashboard">
        <div className="dash-top" />
        <div className="gauge-cluster">
          <div className="dash-gauge rpm">
            <span>RPM</span>
            <b>{rpm}</b>
            <i />
          </div>
          <div className="dash-screen">
            <small>{moving ? "DRIVE" : "PARK"}</small>
            <b>{moving ? Math.round(speed) : "0"}</b>
            <span>MPH</span>
          </div>
          <div className="dash-gauge fuel-gauge">
            <span>GEAR</span>
            <b>{gear}</b>
            <i />
          </div>
        </div>
        <div className="dash-nav">
          <span style={{ color }}>
            <Icon name="arrow" size={18} />
          </span>
          <div>
            <small>DESTINATION</small>
            <b>{destination.short}</b>
            <em>{destinationMiles} mi</em>
          </div>
        </div>
        <div className="dash-controls">
          <i />
          <i />
          <i />
          <i />
          <i />
        </div>
      </div>

      <div className="steering-column" />
      <div className="steering-wheel">
        <span className="wheel-rim" />
        <i className="wheel-spoke one" />
        <i className="wheel-spoke two" />
        <i className="wheel-spoke three" />
        <b style={{ borderColor: color }}>GC</b>
      </div>
      <div className="driver-hand left-hand" />
      <div className="driver-hand right-hand" />
      <div className="chase-truck">
        <div className="chase-trailer">
          <span style={{ background: color }} />
        </div>
        <div className="chase-cab">
          <i />
          <b style={{ background: color }} />
        </div>
        <i className="chase-wheel left-wheel" />
        <i className="chase-wheel right-wheel" />
      </div>
      <div className="hood-bonnet" style={{ borderBottomColor: color }} />
      <div className="windshield-glare" />
    </div>
  );
}

function App() {
  const [career, setCareer] = useState<Career>(initialSave?.career || defaultCareer);
  const [showExpansion, setShowExpansion] = useState(false);
  const [routePaid, setRoutePaid] = useState(initialSave?.routePaid || false);
  const [saveError, setSaveError] = useState(false);
  const weatherClock = useRef(0);
  const live = useRef({ fuel: initialSave?.fuel ?? 72, career });
  const [activeNav, setActiveNav] = useState("Command");
  const [moving, setMoving] = useState(false);
  const [speed, setSpeed] = useState(0);
  const [progress, setProgress] = useState(initialSave?.progress ?? 38);
  const [money, setMoney] = useState(initialSave?.money ?? 128450);
  const [jobIndex, setJobIndex] = useState(initialSave?.jobIndex ?? 0);
  const [destination, setDestination] = useState(
    cities.find((c) => c.name === jobs[initialSave?.jobIndex ?? 0].to) || cities[1],
  );
  const [showJobs, setShowJobs] = useState(false);
  const [showCustomize, setShowCustomize] = useState(false);
  const [accent, setAccent] = useState(initialSave?.accent || "#f7b500");
  const [company, setCompany] = useState(initialSave?.company || "Gulf Coast Logistics");
  const [toast, setToast] = useState("");
  const [steering, setSteering] = useState(0);
  const [laneOffset, setLaneOffset] = useState(0);
  const [fuel, setFuel] = useState(initialSave?.fuel ?? 72);
  const [immersive, setImmersive] = useState(true);
  const [cameraMode, setCameraMode] = useState<"cockpit" | "hood" | "chase">("cockpit");
  const [controllerConnected, setControllerConnected] = useState(false);
  const [worldPosition, setWorldPosition] = useState(
    initialSave?.position || { x: 0, y: 5, heading: -1.42 },
  );
  const worldRef = useRef<WorldState>({ ...worldPosition, speed: 0, steering: 0 });
  const controls = useRef({ up: false, down: false, left: false, right: false });
  const gamepadInput = useRef({ throttle: 0, brake: 0, steer: 0 });
  const job = jobs[jobIndex];

  useEffect(() => {
    live.current = { fuel, career };
    worldRef.current.environment = career;
  }, [fuel, career]);
  const snapshot = useRef({
    money,
    fuel,
    progress,
    jobIndex,
    company,
    accent,
    position: worldPosition,
    career,
    routePaid,
  });
  useEffect(() => {
    snapshot.current = {
      money,
      fuel,
      progress,
      jobIndex,
      company,
      accent,
      position: worldPosition,
      career,
      routePaid,
    };
  }, [money, fuel, progress, jobIndex, company, accent, worldPosition, career, routePaid]);
  useEffect(() => {
    const store = () => {
      try {
        localStorage.setItem(SAVE_KEY, JSON.stringify(snapshot.current));
        setSaveError(false);
      } catch {
        setSaveError(true);
      }
    };
    const id = window.setInterval(store, 2000);
    window.addEventListener("pagehide", store);
    return () => {
      clearInterval(id);
      window.removeEventListener("pagehide", store);
      store();
    };
  }, []);
  useEffect(() => {
    const id = window.setInterval(() => {
      if (!moving || showExpansion || showJobs || showCustomize) return;
      weatherClock.current++;
      const shiftWeather = weatherClock.current >= 90;
      if (shiftWeather) weatherClock.current = 0;
      const nextWeather = (["Clear", "Rain", "Fog"] as const)[Math.floor(Math.random() * 3)];
      setCareer((c) => {
        const next = advanceCareer(c, worldRef.current.speed, 1);
        if (shiftWeather) next.weather = nextWeather;
        return next;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [moving, showExpansion, showJobs, showCustomize, jobIndex]);
  useEffect(() => {
    const clear = () => {
      setMoving(false);
      controls.current = { up: false, down: false, left: false, right: false };
      gamepadInput.current = { throttle: 0, brake: 0, steer: 0 };
    };
    window.addEventListener("blur", clear);
    document.addEventListener("visibilitychange", clear);
    return () => {
      window.removeEventListener("blur", clear);
      document.removeEventListener("visibilitychange", clear);
    };
  }, []);
  useEffect(() => {
    if (!moving || showExpansion || showJobs || showCustomize) return;
    const id = window.setInterval(() => {
      const keyboardDirection = (controls.current.right ? 1 : 0) - (controls.current.left ? 1 : 0);
      const direction =
        Math.abs(gamepadInput.current.steer) > 0.08
          ? gamepadInput.current.steer
          : keyboardDirection;
      let next = worldRef.current.speed;
      const throttle = Math.max(controls.current.up ? 1 : 0, gamepadInput.current.throttle);
      const brake = Math.max(controls.current.down ? 1 : 0, gamepadInput.current.brake);
      if (throttle > 0.02) next += 0.65 * throttle;
      else if (brake > 0.02) next -= 1.35 * brake;
      else next -= 0.025;
      next = Math.max(0, Math.min(85 + live.current.career.engine * 5, next));
      if (live.current.fuel <= 0 || live.current.career.condition <= 0) next = 0;
      setProgress((p) => Math.min(100, p + ((next * 0.00055 * 12) / jobs[jobIndex].miles) * 100));
      setFuel((currentFuel) =>
        Math.max(0, currentFuel - next * 0.000012 * (1 - live.current.career.economy * 0.15)),
      );
      const world = worldRef.current;
      world.speed = next;
      world.steering += (direction - world.steering) * 0.18;
      world.heading += direction * (0.003 + next * 0.000035);
      const distance = next * 0.00055;
      world.x = Math.max(-102, Math.min(82, world.x + Math.sin(world.heading) * distance));
      world.y = Math.max(-52, Math.min(52, world.y + Math.cos(world.heading) * distance));
      setWorldPosition({ x: world.x, y: world.y, heading: world.heading });
      setSpeed(next);

      setSteering((current) => current + (direction - current) * 0.18);
      setLaneOffset((current) => Math.max(-32, Math.min(32, current + direction * 0.42)));
    }, 50);
    return () => window.clearInterval(id);
  }, [moving, showExpansion, showJobs, showCustomize, jobIndex]);

  useEffect(() => {
    const keys: Record<string, keyof typeof controls.current> = {
      w: "up",
      arrowup: "up",
      s: "down",
      arrowdown: "down",
      a: "left",
      arrowleft: "left",
      d: "right",
      arrowright: "right",
    };
    const updateKey = (event: KeyboardEvent, pressed: boolean) => {
      if (
        event.target instanceof HTMLInputElement ||
        event.target instanceof HTMLTextAreaElement ||
        event.target instanceof HTMLSelectElement
      )
        return;
      if (pressed && event.key.toLowerCase() === "c" && !event.repeat) {
        setCameraMode((current) =>
          current === "cockpit" ? "hood" : current === "hood" ? "chase" : "cockpit",
        );
        return;
      }
      if (pressed && event.key === "Escape") {
        setImmersive(false);
        return;
      }
      const control = keys[event.key.toLowerCase()];
      if (!control || event.target instanceof HTMLInputElement) return;
      event.preventDefault();
      controls.current[control] = pressed;
      if (pressed) setMoving(true);
    };
    const down = (event: KeyboardEvent) => updateKey(event, true);
    const up = (event: KeyboardEvent) => updateKey(event, false);
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
    };
  }, []);

  useEffect(() => {
    const close = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setShowExpansion(false);
        setShowJobs(false);
        setShowCustomize(false);
      }
    };
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, []);

  useEffect(() => {
    let animation = 0;
    let wasCameraPressed = false;
    let wasConnected = false;
    const readController = () => {
      const gamepad = navigator.getGamepads?.().find(Boolean);
      const connected = Boolean(gamepad);
      if (connected !== wasConnected) {
        setControllerConnected(connected);
        wasConnected = connected;
      }
      if (gamepad) {
        gamepadInput.current.steer = Math.abs(gamepad.axes[0] || 0) > 0.08 ? gamepad.axes[0] : 0;
        gamepadInput.current.throttle = gamepad.buttons[7]?.value || 0;
        gamepadInput.current.brake = gamepad.buttons[6]?.value || 0;
        const cameraPressed = Boolean(gamepad.buttons[3]?.pressed);
        if (cameraPressed && !wasCameraPressed) {
          setCameraMode((current) =>
            current === "cockpit" ? "hood" : current === "hood" ? "chase" : "cockpit",
          );
        }
        wasCameraPressed = cameraPressed;
      } else {
        gamepadInput.current = { throttle: 0, brake: 0, steer: 0 };
      }
      animation = requestAnimationFrame(readController);
    };
    animation = requestAnimationFrame(readController);
    return () => cancelAnimationFrame(animation);
  }, []);

  useEffect(() => {
    if (!toast) return;
    const id = window.setTimeout(() => setToast(""), 2400);
    return () => window.clearTimeout(id);
  }, [toast]);

  const remaining = Math.max(0, Math.round(job.miles * (1 - progress / 100)));
  const nearestCity = useMemo(
    () =>
      cities.reduce((nearest, city) =>
        Math.hypot(city.x - worldPosition.x, city.y - worldPosition.y) <
        Math.hypot(nearest.x - worldPosition.x, nearest.y - worldPosition.y)
          ? city
          : nearest,
      ),
    [worldPosition],
  );
  const destinationMiles = Math.round(
    Math.hypot(destination.x - worldPosition.x, destination.y - worldPosition.y) * 12,
  );
  const gear =
    speed < 1
      ? "N"
      : speed < 10
        ? "1"
        : speed < 22
          ? "2"
          : speed < 36
            ? "3"
            : speed < 52
              ? "4"
              : "5";
  const rpm = Math.round(650 + ((speed * 42) % 1550));
  const value = useMemo(() => (money / 2_000_000_000) * 100, [money]);
  const nav: [IconName, string][] = [
    ["grid", "Command"],
    ["map", "World map"],
    ["briefcase", "Job market"],
    ["truck", "Fleet"],
    ["users", "Drivers"],
    ["garage", "Garage"],
  ];

  const acceptJob = (index: number) => {
    setRoutePaid(false);
    setJobIndex(index);
    setDestination(cities.find((city) => city.name === jobs[index].to) || cities[0]);
    setProgress(4);
    setMoving(true);
    setShowJobs(false);
    setToast(`Route accepted: ${jobs[index].from} → ${jobs[index].to}`);
  };

  const completeRoute = () => {
    if (progress < 100 || routePaid) return;
    const payout = deliveryReward(job.pay, career.condition);
    setRoutePaid(true);
    setCareer((c) => ({ ...c, deliveries: c.deliveries + 1, earnings: c.earnings + payout }));
    setMoney((m) => m + payout);
    setProgress(0);
    setMoving(false);
    setToast(`Delivery complete. $${payout.toLocaleString()} added`);
  };

  const setControl = (control: keyof typeof controls.current, pressed: boolean) => {
    controls.current[control] = pressed;
    if (pressed) setMoving(true);
    if (pressed && !moving) setMoving(true);
  };

  return (
    <main
      className={`game-shell ${immersive ? "immersive" : ""}`}
      style={{ "--accent": accent } as React.CSSProperties}
    >
      <aside className="rail">
        <div className="brand-mark">
          <span>G</span>
          <i />
        </div>
        <nav>
          {nav.map(([icon, label]) => (
            <button
              key={label}
              onClick={() => {
                setActiveNav(label);
                if (label === "Job market") setShowJobs(true);
                if (label === "Garage") setShowCustomize(true);
              }}
              className={activeNav === label ? "active" : ""}
              aria-label={label}
            >
              <Icon name={icon} />
              <small>{label}</small>
            </button>
          ))}
        </nav>
        <button className="rail-settings" aria-label="Settings">
          <Icon name="settings" />
        </button>
      </aside>

      <section className="app-area">
        <header>
          <div className="company-id">
            <div className="mini-logo">GC</div>
            <div>
              <small>WELCOME BACK, OWNER</small>
              <strong>{company}</strong>
            </div>
          </div>
          <div className="top-stats">
            <div>
              <Icon name="dollar" />
              <span>
                <small>AVAILABLE FUNDS</small>
                <b>${money.toLocaleString()}</b>
              </span>
            </div>
            <div>
              <Icon name="building" />
              <span>
                <small>COMPANY VALUE</small>
                <b>$2.8M</b>
              </span>
            </div>
            <button className="notice" aria-label="Notifications">
              <Icon name="bell" />
              <i />
            </button>
            <div className="level">
              <span>12</span>
              <div>
                <small>OWNER LEVEL</small>
                <b>Road Baron</b>
              </div>
            </div>
          </div>
        </header>

        <div className="content-grid">
          <section className="drive-card">
            <TruckScene
              moving={moving}
              color={accent}
              speed={speed}
              steering={steering}
              laneOffset={laneOffset}
              worldRef={worldRef}
              destination={destination}
              destinationMiles={destinationMiles}
              cameraMode={cameraMode}
              gear={gear}
              rpm={rpm}
              fuel={fuel}
            />
            <div className="scene-topline">
              <span className="live-pill">
                <i /> FPV DRIVE
              </span>
              <div className="console-actions">
                <span className={`controller-state ${controllerConnected ? "connected" : ""}`}>
                  {controllerConnected ? "CONTROLLER CONNECTED" : "WASD • CONTROLLER READY"}
                </span>
                <button
                  className="camera-button"
                  onClick={() =>
                    setCameraMode((current) =>
                      current === "cockpit" ? "hood" : current === "hood" ? "chase" : "cockpit",
                    )
                  }
                >
                  CAMERA: {cameraMode.toUpperCase()} <kbd>C</kbd>
                </button>
                <button
                  className="command-button"
                  onClick={() => setImmersive((current) => !current)}
                >
                  {immersive ? "COMMAND CENTER" : "FULL-SCREEN DRIVE"}
                </button>
              </div>
            </div>
            <div className="highway-expansion">
              <button onClick={() => setShowExpansion(true)}>ROAD ATLAS & TRUCK STOP</button>
              <span>
                {String(Math.floor(career.hour)).padStart(2, "0")}:
                {String(Math.floor((career.hour % 1) * 60)).padStart(2, "0")} ·{" "}
                {career.weather.toUpperCase()} · CONDITION {career.condition.toFixed(0)}%
              </span>
              <small>
                {saveError
                  ? "Saving unavailable — progress lasts this visit"
                  : "LOCAL CAREER SAVED"}{" "}
                · {career.deliveries} DELIVERIES
              </small>
              {progress >= 100 && !routePaid && (
                <button onClick={completeRoute}>
                  COMPLETE DELIVERY · ${deliveryReward(job.pay, career.condition).toLocaleString()}
                </button>
              )}
            </div>
            <div className="city-title">
              <small>FREE ROAM • GULF HORIZON STATE</small>
              <h1>{nearestCity.name.toUpperCase()}</h1>
              <p>
                {nearestCity.major ? "MAJOR CITY" : "MINI CITY"} &nbsp;•&nbsp; {remaining} mi
                contract distance
              </p>
            </div>
            <div className="drive-controls" aria-label="Driving controls">
              <small>{controllerConnected ? "DUALSENSE / GAMEPAD ACTIVE" : "YOU'RE DRIVING"}</small>
              <div className="control-grid">
                <button
                  className="up"
                  aria-label="Accelerate"
                  onPointerDown={() => setControl("up", true)}
                  onPointerUp={() => setControl("up", false)}
                  onPointerCancel={() => {
                    controls.current = { up: false, down: false, left: false, right: false };
                  }}
                  onPointerLeave={() => setControl("up", false)}
                >
                  <kbd>W</kbd>
                  <span>ACCEL</span>
                </button>
                <button
                  aria-label="Steer left"
                  onPointerDown={() => setControl("left", true)}
                  onPointerUp={() => setControl("left", false)}
                  onPointerCancel={() => {
                    controls.current = { up: false, down: false, left: false, right: false };
                  }}
                  onPointerLeave={() => setControl("left", false)}
                >
                  <kbd>A</kbd>
                  <span>LEFT</span>
                </button>
                <button
                  aria-label="Brake"
                  onPointerDown={() => setControl("down", true)}
                  onPointerUp={() => setControl("down", false)}
                  onPointerCancel={() => {
                    controls.current = { up: false, down: false, left: false, right: false };
                  }}
                  onPointerLeave={() => setControl("down", false)}
                >
                  <kbd>S</kbd>
                  <span>BRAKE</span>
                </button>
                <button
                  aria-label="Steer right"
                  onPointerDown={() => setControl("right", true)}
                  onPointerUp={() => setControl("right", false)}
                  onPointerCancel={() => {
                    controls.current = { up: false, down: false, left: false, right: false };
                  }}
                  onPointerLeave={() => setControl("right", false)}
                >
                  <kbd>D</kbd>
                  <span>RIGHT</span>
                </button>
              </div>
            </div>
            <div className="drive-hud">
              <button
                aria-label={moving ? "Pause driving" : "Resume driving"}
                className="pause-btn"
                onClick={() => setMoving(!moving)}
              >
                <Icon name={moving ? "pause" : "play"} size={18} />
              </button>
              <div className="speed">
                <b>{moving ? Math.round(speed) : 0}</b>
                <span>MPH</span>
              </div>
              <div className="hud-stat">
                <Icon name="fuel" />
                <span>
                  <small>FUEL</small>
                  <b>{fuel.toFixed(1)}%</b>
                </span>
              </div>
              <div className="hud-stat">
                <Icon name="clock" />
                <span>
                  <small>DRIVE TIME</small>
                  <b>3h 42m</b>
                </span>
              </div>
              <div className="hud-stat income">
                <Icon name="dollar" />
                <span>
                  <small>THIS RUN</small>
                  <b>${job.pay.toLocaleString()}</b>
                </span>
              </div>
              <button className="view-btn" onClick={() => setLaneOffset(0)}>
                GEAR {gear} • {rpm} RPM
              </button>
            </div>
          </section>

          <aside className="route-panel">
            <div className="panel-heading">
              <div>
                <small>ACTIVE CONTRACT</small>
                <h2>{job.cargo}</h2>
              </div>
              <span className="cargo-tag">ON TIME</span>
            </div>
            <div className="route-map">
              <svg viewBox="-102 -52 184 104" preserveAspectRatio="none">
                <path
                  className="map-land"
                  d="M-101-42c28-13 50 3 70-6 27-12 54-1 72 12 20 15 27 6 40 2l1 32-10 22 8 31H-95l-7-26 12-25-11-21z"
                />
                <path className="waterway" d="M-102 29c34-14 56-4 79-14S18-4 46 14s24 9 38 2" />
                {roadLinks.map(([from, to]) => (
                  <line
                    className="state-road"
                    key={`${from}-${to}`}
                    x1={cities[from].x}
                    y1={cities[from].y}
                    x2={cities[to].x}
                    y2={cities[to].y}
                  />
                ))}
              </svg>
              {cities.map((city) => (
                <button
                  className={`state-city ${city.major ? "major" : "minor"}`}
                  key={city.short}
                  style={
                    {
                      left: `${((city.x + 102) / 184) * 100}%`,
                      top: `${((city.y + 52) / 104) * 100}%`,
                      "--city-color": city.color,
                    } as React.CSSProperties
                  }
                  title={city.name}
                  onClick={() => {
                    setDestination(city);
                    setToast(`Navigation set for ${city.name}`);
                  }}
                >
                  <i />
                  <b>{city.short}</b>
                </button>
              ))}
              <span
                className="map-truck"
                style={{
                  left: `${((worldPosition.x + 102) / 184) * 100}%`,
                  top: `${((worldPosition.y + 52) / 104) * 100}%`,
                  transform: `translate(-50%, -50%) rotate(${-worldPosition.heading}rad)`,
                }}
              >
                <Icon name="truck" size={15} />
              </span>
              <span className="world-count">5 CITIES • 3 MINI CITIES</span>
            </div>
            <div className="route-details">
              <div className="point">
                <span className="dot filled" />
                <div>
                  <small>PICKUP</small>
                  <b>{job.from}</b>
                  <p>Port cargo terminal</p>
                </div>
              </div>
              <div className="point">
                <span className="dot" />
                <div>
                  <small>DELIVERY</small>
                  <b>{job.to}</b>
                  <p>Distribution district</p>
                </div>
              </div>
            </div>
            <div className="route-progress">
              <div className="progress-copy">
                <span>{Math.round(progress)}% complete</span>
                <b>{remaining} mi</b>
              </div>
              <div className="bar">
                <i style={{ width: `${progress}%` }} />
              </div>
            </div>
            <div className="arrival">
              <Icon name="clock" />
              <span>
                <small>ESTIMATED ARRIVAL</small>
                <b>Today, 6:42 PM</b>
              </span>
              <em>+8% bonus</em>
            </div>
            <button
              className="primary-button"
              onClick={progress >= 100 ? completeRoute : () => setShowJobs(true)}
            >
              {progress >= 100 ? "COMPLETE DELIVERY" : "OPEN ROUTE PLANNER"} <Icon name="arrow" />
            </button>
          </aside>

          <section className="bottom-grid">
            <div className="business-card">
              <div className="section-title">
                <div>
                  <small>BUSINESS OVERVIEW</small>
                  <h2>Your empire is growing</h2>
                </div>
                <button onClick={() => setShowCustomize(true)}>
                  MANAGE COMPANY <Icon name="chevron" size={14} />
                </button>
              </div>
              <div className="metric-row">
                <div>
                  <span className="metric-icon">
                    <Icon name="truck" />
                  </span>
                  <p>
                    <small>OWNED TRUCKS</small>
                    <b>4</b>
                    <em>+1 this week</em>
                  </p>
                </div>
                <div>
                  <span className="metric-icon">
                    <Icon name="users" />
                  </span>
                  <p>
                    <small>HIRED DRIVERS</small>
                    <b>3</b>
                    <em>92% efficiency</em>
                  </p>
                </div>
                <div>
                  <span className="metric-icon">
                    <Icon name="briefcase" />
                  </span>
                  <p>
                    <small>ACTIVE ROUTES</small>
                    <b>3</b>
                    <em>$8.4k / day</em>
                  </p>
                </div>
              </div>
              <div className="goal">
                <div>
                  <Icon name="shield" />
                  <span>
                    <small>NEXT MILESTONE</small>
                    <b>Regional Operator</b>
                  </span>
                </div>
                <span>$2.8M / $5M</span>
                <div className="goal-bar">
                  <i style={{ width: "56%" }} />
                </div>
              </div>
            </div>

            <div className="drivers-card">
              <div className="section-title">
                <div>
                  <small>AI DRIVER NETWORK</small>
                  <h2>Drivers on the road</h2>
                </div>
                <button
                  onClick={() => {
                    setMoney((m) => m - 12500);
                    setToast("Maya Chen hired and assigned to fleet");
                  }}
                >
                  HIRE DRIVER <span>+</span>
                </button>
              </div>
              <div className="driver-list">
                {[
                  ["JM", "Jamal Morris", "Miami → NOLA", "+$3,240"],
                  ["ER", "Elena Ruiz", "Los Angeles → Houston", "+$5,860"],
                  ["DK", "Darius King", "Resting • Houston", "+$2,110"],
                ].map((d, i) => (
                  <div className="driver" key={d[1]}>
                    <span className={`avatar a${i}`}>
                      {d[0]}
                      <i />
                    </span>
                    <div>
                      <b>{d[1]}</b>
                      <small>{d[2]}</small>
                    </div>
                    <strong>
                      {d[3]}
                      <small>today</small>
                    </strong>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>
      </section>

      {showJobs && (
        <div className="modal-backdrop" onMouseDown={() => setShowJobs(false)}>
          <div className="modal jobs-modal" onMouseDown={(e) => e.stopPropagation()}>
            <div className="modal-head">
              <div>
                <small>DISPATCH CENTER</small>
                <h2>Choose your next contract</h2>
                <p>Build your reputation across the Gulf Coast Metroplex.</p>
              </div>
              <button onClick={() => setShowJobs(false)}>
                <Icon name="x" />
              </button>
            </div>
            <div className="job-list">
              {jobs.map((j, i) => (
                <button
                  className={i === jobIndex ? "selected" : ""}
                  key={j.cargo}
                  onClick={() => acceptJob(i)}
                >
                  <span className="job-number">0{i + 1}</span>
                  <div className="job-route">
                    <small>{j.cargo.toUpperCase()}</small>
                    <b>
                      {j.from} <Icon name="arrow" size={15} /> {j.to}
                    </b>
                    <p>
                      {j.miles.toLocaleString()} miles • {j.time}
                    </p>
                  </div>
                  <div className="job-pay">
                    <small>CONTRACT PAY</small>
                    <b>${j.pay.toLocaleString()}</b>
                    <span>ACCEPT ROUTE</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {showCustomize && (
        <div className="modal-backdrop" onMouseDown={() => setShowCustomize(false)}>
          <div className="modal customize-modal" onMouseDown={(e) => e.stopPropagation()}>
            <div className="modal-head">
              <div>
                <small>COMPANY GARAGE</small>
                <h2>Build your identity</h2>
                <p>Your choices appear across your truck, HQ, and driver uniforms.</p>
              </div>
              <button onClick={() => setShowCustomize(false)}>
                <Icon name="x" />
              </button>
            </div>
            <div className="custom-body">
              <div className="logo-preview" style={{ borderColor: accent }}>
                <span style={{ color: accent }}>GC</span>
                <i>EST. 2025</i>
              </div>
              <div className="custom-controls">
                <label>
                  COMPANY NAME
                  <input value={company} onChange={(e) => setCompany(e.target.value)} />
                </label>
                <label>
                  FLEET ACCENT
                  <div className="swatches">
                    {["#f7b500", "#e25139", "#36a3ff", "#1fd6a2", "#b47cff"].map((c) => (
                      <button
                        key={c}
                        onClick={() => setAccent(c)}
                        className={accent === c ? "chosen" : ""}
                        style={{ background: c }}
                      >
                        {accent === c && <Icon name="check" size={15} />}
                      </button>
                    ))}
                  </div>
                </label>
                <label>
                  HEADQUARTERS STYLE
                  <div className="style-options">
                    <button className="chosen">Industrial Loft</button>
                    <button>Modern Glass</button>
                    <button>Port Depot</button>
                  </div>
                </label>
                <button
                  className="save-button"
                  onClick={() => {
                    setShowCustomize(false);
                    setToast("Company identity updated");
                  }}
                >
                  SAVE COMPANY DESIGN
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {toast && (
        <div className="toast">
          <Icon name="check" size={17} />
          {toast}
        </div>
      )}
      {showExpansion && (
        <div className="modal-backdrop">
          <section
            className="modal expansion-modal"
            role="dialog"
            aria-modal="true"
            aria-label="Road atlas and truck stop"
          >
            <div className="modal-head">
              <div>
                <small>29 TRUCKERS / HIGHWAY SERVICES</small>
                <h2>Road atlas & truck stop</h2>
                <p>
                  {regionAt(worldPosition.x, worldPosition.y)} · ${money.toLocaleString()} available
                </p>
              </div>
              <button onClick={() => setShowExpansion(false)} aria-label="Close road atlas">
                <Icon name="x" />
              </button>
            </div>
            <div className="expansion-body">
              <svg
                viewBox="-105 -55 190 115"
                className="live-atlas"
                role="img"
                aria-label="Road network with truck position and destination"
              >
                <rect x="-105" y="-55" width="190" height="115" fill="#152d2c" />
                {roadLinks.map(([a, b]) => (
                  <line
                    key={a + "-" + b}
                    x1={cities[a].x}
                    y1={cities[a].y}
                    x2={cities[b].x}
                    y2={cities[b].y}
                    stroke="#8b967c"
                    strokeWidth=".7"
                  />
                ))}
                {cities.map((c) => (
                  <g key={c.name}>
                    <circle cx={c.x} cy={c.y} r="1.5" fill={c.color} />
                    <text x={c.x + 2} y={c.y - 2} fill="#eef2e7" fontSize="3">
                      {c.short}
                    </text>
                  </g>
                ))}
                <circle
                  cx={destination.x}
                  cy={destination.y}
                  r="3"
                  stroke="#f7b500"
                  fill="none"
                  strokeWidth=".5"
                />
                <path
                  d="M0 -3 L-1.6 2 L1.6 2Z"
                  fill="white"
                  transform={`translate(${worldPosition.x} ${worldPosition.y}) rotate(${(-worldPosition.heading * 180) / Math.PI + 180})`}
                />
              </svg>
              <p className="atlas-caption">
                White marker: your truck · gold ring: destination. Fictional compressed road
                network, not real navigation. WASD / arrows steer; C changes camera. Driving pauses
                while a menu is open.
              </p>
              <div className="expansion-grid">
                <article>
                  <h3>Truck-stop services</h3>
                  <p>Radio roadside support is available anywhere. Services park your truck.</p>
                  <button
                    disabled={money < serviceCost("fuel", fuel, career.condition) || fuel >= 100}
                    onClick={() => {
                      const cost = serviceCost("fuel", fuel, career.condition);
                      if (money < cost) return;
                      setMoney((m) => m - cost);
                      setFuel(100);
                      setSpeed(0);
                      worldRef.current.speed = 0;
                      setMoving(false);
                      setToast("Tank filled. Ready for the next haul.");
                    }}
                  >
                    Refuel · ${serviceCost("fuel", fuel, career.condition).toLocaleString()}
                  </button>
                  <button
                    disabled={
                      money < serviceCost("repair", fuel, career.condition) ||
                      career.condition >= 100
                    }
                    onClick={() => {
                      const cost = serviceCost("repair", fuel, career.condition);
                      if (money < cost) return;
                      setMoney((m) => m - cost);
                      setCareer((c) => ({ ...c, condition: 100 }));
                      setSpeed(0);
                      worldRef.current.speed = 0;
                      setMoving(false);
                      setToast("Truck serviced. Condition restored.");
                    }}
                  >
                    Repair · ${serviceCost("repair", fuel, career.condition).toLocaleString()}
                  </button>
                  <button
                    onClick={() => {
                      setCareer((c) => ({ ...c, hour: (c.hour + 8) % 24 }));
                      setSpeed(0);
                      worldRef.current.speed = 0;
                      setMoving(false);
                      setToast("Rested for eight game hours.");
                    }}
                  >
                    Rest 8 hours · free
                  </button>
                </article>
                <article>
                  <h3>Garage upgrades</h3>
                  {(["engine", "economy"] as const).map((key) => (
                    <div key={key}>
                      <p>
                        {key === "engine"
                          ? "Engine · +5 MPH top speed per level"
                          : "Economy · 15% less fuel per level"}{" "}
                        ({career[key]}/3)
                      </p>
                      <button
                        disabled={career[key] >= 3 || money < upgradeCost(career[key])}
                        onClick={() => {
                          if (career[key] >= 3 || money < upgradeCost(career[key])) return;
                          setMoney((m) => m - upgradeCost(career[key]));
                          setCareer((c) => ({ ...c, [key]: c[key] + 1 }));
                          setToast("Upgrade installed.");
                        }}
                      >
                        {career[key] >= 3
                          ? "Fully upgraded"
                          : "Install · $" + upgradeCost(career[key]).toLocaleString()}
                      </button>
                    </div>
                  ))}
                </article>
                <article>
                  <h3>Weather & conditions</h3>
                  <p>
                    Choose driving conditions. Rain and fog reduce visibility; headlights appear
                    after dark.
                  </p>
                  {(["Clear", "Rain", "Fog"] as const).map((weather) => (
                    <button
                      aria-pressed={career.weather === weather}
                      key={weather}
                      onClick={() => setCareer((c) => ({ ...c, weather }))}
                    >
                      {weather}
                    </button>
                  ))}
                  <p>
                    Current truck condition adjusts delivery pay from 80% to 100%. Fuel or condition
                    at zero stops the truck.
                  </p>
                </article>
                <article>
                  <h3>Career milestones</h3>
                  <p>
                    {career.deliveries} deliveries · ${career.earnings.toLocaleString()} earned
                  </p>
                  {milestones.map((m) => (
                    <button
                      key={m.goal}
                      disabled={career.deliveries < m.goal || career.claimed.includes(m.goal)}
                      onClick={() => {
                        if (career.deliveries < m.goal || career.claimed.includes(m.goal)) return;
                        setMoney((v) => v + m.reward);
                        setCareer((c) => ({ ...c, claimed: [...c.claimed, m.goal] }));
                      }}
                    >
                      {m.name} ·{" "}
                      {career.claimed.includes(m.goal)
                        ? "Claimed"
                        : "$" + m.reward.toLocaleString()}
                    </button>
                  ))}
                </article>
              </div>
              <button
                className="primary-button"
                onClick={() => {
                  setShowExpansion(false);
                  setShowJobs(true);
                }}
              >
                Browse freight contracts
              </button>
              <p className="atlas-caption">
                Saves stay in this browser. No cloud sync. Weather is a selectable simulation
                setting; scenery is stylized perspective rendering.
              </p>
            </div>
          </section>
        </div>
      )}
    </main>
  );
}

export default App;
