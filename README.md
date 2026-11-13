# 29 Truckers

A React/Vite single-player trucking game with a stylized perspective road network.

## Development

```sh
npm ci
npm run dev
npx tsc --noEmit
npm run build
```

## Living highways expansion

- WASD/arrow keys and on-screen controls accelerate, brake and steer. C cycles cab, hood and chase cameras. Start parked; use Accelerate to begin. Losing window focus pauses driving.
- Road atlas & truck stop opens from the driving view. Menus pause simulation.
- The live map shows eight cities, road links, the truck and selected destination. Coordinates are a compressed fictional network, not real navigation.
- Roadside trees, desert plants and buildings remain fixed in world space, avoiding the road corridors. Regional scenery follows truck coordinates.
- One game day lasts 24 minutes of active driving. Rain/fog/clear weather can be selected, and weather is reconsidered every 90 active seconds. Night rendering adds a headlight glow.
- Refuel ($24 per percentage point), repair ($35 per condition point), or rest eight game hours. Roadside support is available everywhere. Rest and service stop the truck.
- Engine upgrades add 5 MPH to maximum speed per level; economy upgrades reduce fuel consumption by 15% per level, up to three levels each.
- Driving wears condition and consumes fuel. Zero fuel or condition prevents movement; services restore them. Delivery pay ranges from 80–100% based on condition.
- Contract progress uses accumulated simulated mileage, not arrival detection. Complete a route when the meter reaches 100%; use the driving-view completion button or the Command Center. Each accepted route pays once. Twelve freight jobs are available.
- Delivery milestones award one-time bonuses after 1, 3 and 10 completed routes.
- Career, cash, fuel, current route, truck position, upgrades, company name and accent autosave every two seconds and on page exit to `29-truckers-career-v1` in browser localStorage. Preview and production saves are separate. Clearing browser data removes progress. If storage is unavailable, a warning is shown and play continues for that visit. The earlier app did not persist progress.

No new runtime dependencies or external scenery assets were added. The existing Vite configuration emits a future compatibility warning about native config loading; it does not prevent the current build. This is not a photorealistic, geographic or traffic-collision simulation. Controller support is retained but needs physical-device testing.
