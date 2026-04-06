import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useSolarSystem } from "@/lib/stores/useSolarSystem";
import { ArrowLeft, ArrowLeftRight, Orbit } from "lucide-react";

const METRICS = [
  { label: "Type", get: (p: any) => p.type },
  { label: "Diameter", get: (p: any) => p.diameter },
  { label: "Mass", get: (p: any) => p.mass },
  { label: "Gravity", get: (p: any) => p.gravity },
  { label: "Temperature", get: (p: any) => p.temperature },
  { label: "Day Length", get: (p: any) => p.dayLength },
  { label: "Year Length", get: (p: any) => p.yearLength },
];

export default function Compare() {
  const { planets } = useSolarSystem();
  const [leftId, setLeftId] = useState(() => planets[0]?.id ?? "");
  const [rightId, setRightId] = useState(() => planets[1]?.id ?? planets[0]?.id ?? "");

  const left = useMemo(() => planets.find((p) => p.id === leftId) ?? null, [planets, leftId]);
  const right = useMemo(() => planets.find((p) => p.id === rightId) ?? null, [planets, rightId]);

  const handleSwap = () => {
    setLeftId(rightId);
    setRightId(leftId);
  };

  return (
    <div className="min-h-screen h-screen overflow-y-auto scrollbar-thin bg-[#050509] text-white font-body">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_10%,rgba(88,101,242,0.2),transparent_45%),radial-gradient(circle_at_85%_20%,rgba(16,185,129,0.2),transparent_40%),linear-gradient(180deg,#04030a,transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_80%,rgba(255,255,255,0.08),transparent_50%)]" />
      </div>

      <div className="relative z-10 px-6 py-10">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-white/70 hover:text-white transition"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Landing
            </Link>
            <Link
              to="/explore"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/20 bg-white/5 hover:bg-white/10 transition"
            >
              <Orbit className="w-4 h-4" />
              Open Solar System
            </Link>
          </div>

          <div className="mt-6">
            <h1 className="font-display text-4xl md:text-5xl">Compare Planets</h1>
            <p className="text-white/60 mt-2 max-w-2xl">
              Pick two planets to see their stats side-by-side. Swap to quickly compare another.
            </p>
          </div>

          <div className="mt-8 grid gap-6 md:grid-cols-[1fr_auto_1fr] items-end">
            <div className="rounded-2xl border border-white/15 bg-white/5 p-5 backdrop-blur-xl">
              <label className="text-xs uppercase tracking-[0.3em] text-white/50">Planet A</label>
              <select
                className="mt-3 w-full rounded-xl bg-black/40 border border-white/20 px-3 py-2 text-white"
                value={leftId}
                onChange={(event) => setLeftId(event.target.value)}
              >
                {planets.map((planet) => (
                  <option key={planet.id} value={planet.id}>
                    {planet.name}
                  </option>
                ))}
              </select>
              {left && (
                <div className="mt-4 rounded-xl border border-white/10 bg-white/5 p-4">
                  <div className="text-lg font-semibold">{left.name}</div>
                  <p className="text-white/60 text-sm mt-1">{left.description}</p>
                  <Link
                    to={`/planet/${left.id}`}
                    className="inline-flex items-center gap-2 text-emerald-300 text-sm mt-3 hover:text-emerald-200 transition"
                  >
                    View details
                  </Link>
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={handleSwap}
              className="mx-auto inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-white/80 hover:bg-white/20 transition"
            >
              <ArrowLeftRight className="w-4 h-4" />
              Swap
            </button>

            <div className="rounded-2xl border border-white/15 bg-white/5 p-5 backdrop-blur-xl">
              <label className="text-xs uppercase tracking-[0.3em] text-white/50">Planet B</label>
              <select
                className="mt-3 w-full rounded-xl bg-black/40 border border-white/20 px-3 py-2 text-white"
                value={rightId}
                onChange={(event) => setRightId(event.target.value)}
              >
                {planets.map((planet) => (
                  <option key={planet.id} value={planet.id}>
                    {planet.name}
                  </option>
                ))}
              </select>
              {right && (
                <div className="mt-4 rounded-xl border border-white/10 bg-white/5 p-4">
                  <div className="text-lg font-semibold">{right.name}</div>
                  <p className="text-white/60 text-sm mt-1">{right.description}</p>
                  <Link
                    to={`/planet/${right.id}`}
                    className="inline-flex items-center gap-2 text-emerald-300 text-sm mt-3 hover:text-emerald-200 transition"
                  >
                    View details
                  </Link>
                </div>
              )}
            </div>
          </div>

          <div className="mt-10 rounded-2xl border border-white/15 bg-white/5 backdrop-blur-xl">
            <div className="grid grid-cols-[1fr_1fr_1fr] px-6 py-4 border-b border-white/10 text-sm uppercase tracking-[0.25em] text-white/50">
              <div>Metric</div>
              <div className="text-center">{left?.name ?? "Planet A"}</div>
              <div className="text-center">{right?.name ?? "Planet B"}</div>
            </div>
            {METRICS.map((metric) => (
              <div
                key={metric.label}
                className="grid grid-cols-[1fr_1fr_1fr] px-6 py-4 border-b border-white/10 last:border-b-0 text-sm"
              >
                <div className="text-white/60">{metric.label}</div>
                <div className="text-center text-white/90">{left ? metric.get(left) : "—"}</div>
                <div className="text-center text-white/90">{right ? metric.get(right) : "—"}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
