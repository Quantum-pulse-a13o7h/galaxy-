# Overview

This is an **interactive 3D solar system web application** built with React and Three.js. It renders a realistic solar system visualization where users can explore planets, control simulation speed, focus on individual celestial bodies, and navigate to detailed planet pages. The app fetches supplementary information from Wikipedia's API for planet descriptions.

## Key Features
- Elliptical orbits with eccentricity values and variable orbital speeds
- Asteroid belt with 2000 particles between Mars and Jupiter
- 12 moons across 4 planets (Jupiter, Saturn, Uranus, Neptune)
- Search functionality (Ctrl+K) to find and jump to any planet, moon, or feature
- VR mode support via WebXR (disabled when hardware unavailable)

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture

- **Framework:** React with TypeScript, using Vite as the build tool and dev server
- **3D Rendering:** Three.js via `@react-three/fiber` (React Three Fiber) and `@react-three/drei` for helpers like OrbitControls and Html overlays
- **XR/VR:** `@react-three/xr` with createXRStore for WebXR session management
- **Routing:** React Router (`react-router-dom`) with two main routes:
  - `/` — Main solar system view with orbiting planets
  - `/planet/:planetId` — Detailed single-planet view
- **State Management:** Zustand store (`useSolarSystem`) manages simulation state (speed, pause, focused planet, camera reset, planet positions list)
- **Styling:** Tailwind CSS with a dark theme configured via CSS custom properties (HSL color system). Uses shadcn/ui component library built on Radix UI primitives
- **UI Components:** Full shadcn/ui component library in `client/src/components/ui/`. Custom solar system components in `client/src/components/solar-system/`
- **Data:** Planet data is stored as a static JSON file at `client/src/data/planets.json` containing orbital parameters, colors, physical properties, eccentricity values, and fun facts
- **Path aliases:** `@/` maps to `client/src/`, `@shared/` maps to `shared/`

## Key 3D Components

- `SolarSystemScene` — Root scene component orchestrating all 3D objects
- `Sun`, `Planet`, `Earth`, `Saturn` — Individual celestial body components with custom materials and behaviors (Earth has clouds/atmosphere, Saturn has rings)
- `Starfield` — Background star particles
- `OrbitLines` — Visual orbit path indicators (now elliptical)
- `CameraController` — Manages camera focus transitions and orbit tracking on elliptical paths
- `AsteroidBelt` — 2000 particle system between Mars and Jupiter orbits (radii 30-43)
- `Moons` — 12 moons across 4 planets, using PlanetMoonSystem wrapper to share parent position

## Orbital Mechanics

- **Orbit utilities** in `client/src/lib/orbitUtils.ts`:
  - `getEllipticalPosition(angle, semiMajorAxis, eccentricity)` — Computes position on elliptical path
  - `getEllipticalOrbitPoints(semiMajorAxis, eccentricity, segments)` — Generates orbit path vertices
  - `getOrbitalSpeed(baseSpeed, angle, eccentricity)` — Varies speed based on position (faster near perihelion)
- Planets use position-based motion (not group rotation) for true elliptical paths
- Each planet in `planets.json` has an `eccentricity` value

## Moon Distribution (12 total)
- Jupiter: Io, Europa, Ganymede, Callisto
- Saturn: Titan, Rhea, Enceladus, Dione
- Uranus: Titania, Oberon, Miranda
- Neptune: Triton (retrograde orbit)

## Backend Architecture

- **Runtime:** Node.js with Express
- **Server entry:** `server/index.ts` — Creates HTTP server, adds JSON/URL-encoded parsing, request logging for `/api` routes
- **Routes:** `server/routes.ts` — Currently minimal, placeholder for API routes (prefix all with `/api`)
- **Dev server:** Vite middleware is served in development mode via `server/vite.ts`
- **Production:** Static files served from `dist/public` via `server/static.ts`
- **Build:** Custom build script (`script/build.ts`) uses Vite for client and esbuild for server bundling

## Data Storage

- **Database:** PostgreSQL via Drizzle ORM
- **Schema:** Defined in `shared/schema.ts` — currently only has a `users` table (id, username, password)
- **Storage layer:** `server/storage.ts` defines an `IStorage` interface with a `MemStorage` in-memory implementation (ready to swap to database-backed storage)
- **Schema push:** Use `npm run db:push` (drizzle-kit push) to sync schema to database
- **Validation:** Zod schemas generated from Drizzle schema via `drizzle-zod`

## Build & Development

- `npm run dev` — Starts development server with Vite HMR
- `npm run build` — Builds client (Vite) and server (esbuild) to `dist/`
- `npm run start` — Runs production build
- `npm run db:push` — Pushes database schema changes
- GLSL shader support is configured via `vite-plugin-glsl`
- Asset support includes `.gltf`, `.glb`, `.mp3`, `.ogg`, `.wav` files

# External Dependencies

- **PostgreSQL** — Primary database (connection via `DATABASE_URL` environment variable)
- **Drizzle ORM** — Database ORM with PostgreSQL dialect
- **Wikipedia REST API** — Fetches planet summaries from `en.wikipedia.org/api/rest_v1/page/summary/` (client-side, no API key needed)
- **Three.js ecosystem** — `@react-three/fiber`, `@react-three/drei`, `@react-three/postprocessing`, `@react-three/xr` for 3D rendering and VR
- **Radix UI** — Full suite of accessible UI primitives (dialog, dropdown, tabs, etc.)
- **TanStack React Query** — Data fetching and caching (configured with infinite stale time, no auto-refetch)
- **Framer Motion** — Animation library used in planet detail pages
- **Tailwind CSS** — Utility-first CSS framework
- **Inter font** — Via `@fontsource/inter`
