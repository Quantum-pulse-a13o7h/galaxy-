import { Suspense, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Link } from "react-router-dom";
import { Sparkles, Cpu, Layers, Globe, ArrowRight, MoveHorizontal, Camera } from "lucide-react";
import { Canvas } from "@react-three/fiber";
import { SolarSystemScene } from "@/components/solar-system/SolarSystemScene";

export default function Landing() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ container: containerRef });
  const cardY = useTransform(scrollYProgress, [0, 1], ["0px", "40px"]);
  const cardTilt = useTransform(scrollYProgress, [0, 1], ["0deg", "-4deg"]);
  const [overlayTone, setOverlayTone] = useState<"dark" | "light">("dark");
  const overlayClass = overlayTone === "dark" ? "bg-black/65" : "bg-black/35";

  return (
    <div ref={containerRef} className="w-full h-full overflow-y-auto bg-black text-white font-body">
    <div className="fixed inset-0 pointer-events-none">
  <video
    className="absolute inset-0 h-full w-full object-cover"
    src="/backgrounds/nebula.mp4"
    autoPlay
    loop
    muted
    playsInline
  />
  <div className={`absolute inset-0 ${overlayClass}`} />
</div>


      <div className="relative">
        <div className="fixed top-4 right-4 z-50">
          <button
            type="button"
            onClick={() =>
              setOverlayTone((current) => (current === "dark" ? "light" : "dark"))
            }
            className="px-3 py-1.5 rounded-full border border-white/20 bg-white/10 text-white/80 text-xs tracking-wide hover:bg-white/20 transition"
          >
            Overlay: {overlayTone === "dark" ? "Darker" : "Lighter"}
          </button>
        </div>

        <section className="min-h-screen flex items-center px-6">
          <div className="max-w-6xl mx-auto w-full">
            <div className="grid md:grid-cols-2 gap-10 items-center">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <img
                    src="/logo.webp"
                    alt="Cosmic Details logo"
                    className="h-10 w-10 rounded-full border border-white/20 bg-white/5 object-cover"
                  />
                  <p className="text-emerald-300/80 text-sm tracking-[0.3em] uppercase">
                    Cosmic Details
                  </p>
                </div>
                <h1 className="font-display text-5xl md:text-7xl leading-tight">
                  A Real‑Time,
                  <br />
                  Cinematic Solar System
                </h1>
                <p className="text-white/70 text-lg mt-6 max-w-xl">
                  Explore ultra‑realistic planets, detailed moons, and a living starfield.
                  Built for smooth interaction and scientific inspiration.
                </p>

                <div className="flex flex-wrap gap-3 mt-8">
                  <Link
                    to="/explore"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-500/90 hover:bg-emerald-500 text-black font-semibold transition"
                  >
                    Enter Experience
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link
                    to="/compare"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-white/20 text-white/90 hover:bg-white/10 transition"
                  >
                    Compare Planets
                    <MoveHorizontal className="w-4 h-4" />
                  </Link>
                  <a
                    href="#tech"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-white/20 text-white/90 hover:bg-white/10 transition"
                  >
                    See Tech Specs
                  </a>
                </div>

                <div className="mt-10 flex items-center gap-6 text-white/60 text-sm">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    Real‑Time Rendering
                  </div>
                  <div className="flex items-center gap-2">
                    <Camera className="w-4 h-4" />
                    Interactive Camera
                  </div>
                </div>
              </div>

              <div className="relative">
                <motion.div
  className="rounded-3xl border border-white/20 bg-white/5 backdrop-blur-xl p-6 shadow-2xl relative"
  style={{ y: cardY, rotate: cardTilt }}
>
  <div className="absolute inset-0 rounded-3xl bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.18),transparent_60%)]" />
  <div className="relative">
    <div className="text-xs uppercase tracking-widest text-white/50 mb-4">Live Preview</div>
                  <div className="aspect-[4/3] rounded-2xl border border-white/10 bg-black/30 overflow-hidden relative">
                    <Canvas
                      className="absolute inset-0"
                      style={{ pointerEvents: "none" }}
                      camera={{ position: [0, 80, 120], fov: 55 }}
                      dpr={[1, 1]}
                      gl={{ antialias: true, alpha: true }}
                    >
                      <Suspense fallback={null}>
                        <SolarSystemScene />
                      </Suspense>
                    </Canvas>
                  </div>
    <div className="grid grid-cols-3 gap-3 mt-4 text-xs text-white/60">
      <div className="rounded-lg border border-white/10 p-3">PBR Textures</div>
      <div className="rounded-lg border border-white/10 p-3">WebXR Ready</div>
      <div className="rounded-lg border border-white/10 p-3">Realtime Light</div>
    </div>
  </div>
</motion.div>

              </div>
            </div>
          </div>
        </section>

        <section id="tech" className="py-24 px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="font-display text-3xl md:text-4xl mb-6">Tech Specs</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="rounded-2xl border border-white/15 bg-white/5 p-6 backdrop-blur-xl">
                <Cpu className="w-5 h-5 text-emerald-300 mb-3" />
                <div className="text-white font-semibold">Frontend</div>
                <p className="text-white/60 text-sm mt-2">
                  React 18, TypeScript, Vite, Tailwind CSS, Framer Motion
                </p>
              </div>
              <div className="rounded-2xl border border-white/15 bg-white/5 p-6 backdrop-blur-xl">
                <Layers className="w-5 h-5 text-emerald-300 mb-3" />
                <div className="text-white font-semibold">3D Engine</div>
                <p className="text-white/60 text-sm mt-2">
                  Three.js + React Three Fiber, Drei helpers, Postprocessing
                </p>
              </div>
              <div className="rounded-2xl border border-white/15 bg-white/5 p-6 backdrop-blur-xl">
                <Globe className="w-5 h-5 text-emerald-300 mb-3" />
                <div className="text-white font-semibold">Backend</div>
                <p className="text-white/60 text-sm mt-2">
                  Node.js + Express, PostgreSQL + Drizzle ORM
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-24 px-6">
          <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8">
            <div className="rounded-2xl border border-white/15 bg-white/5 p-6 backdrop-blur-xl">
              <h3 className="font-display text-2xl">Core Features</h3>
              <div className="mt-4 space-y-3 text-white/70">
                <div>Ultra‑real planet textures and animated clouds</div>
                <div>Interactive camera focus and orbit tracking</div>
                <div>Realistic sun glow with volumetric flare feel</div>
                <div>Milky Way background with parallax depth</div>
              </div>
            </div>
            <div className="rounded-2xl border border-white/15 bg-white/5 p-6 backdrop-blur-xl">
              <h3 className="font-display text-2xl">Next‑Up Features</h3>
              <div className="mt-4 space-y-3 text-white/70">
                <div className="flex items-center gap-2">
                  <MoveHorizontal className="w-4 h-4 text-amber-300" />
                  Compare two or more planets side‑by‑side
                </div>
                <div>Atmospheric scattering for sunsets and limb glow</div>
                <div>Dynamic star density tied to camera distance</div>
                <div>Custom presets for cinematic tours</div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-24 px-6">
          <div className="max-w-6xl mx-auto rounded-3xl border border-white/15 bg-gradient-to-r from-emerald-500/20 via-transparent to-amber-500/20 p-8 backdrop-blur-xl text-center">
            <h3 className="font-display text-3xl">Ready to Explore?</h3>
            <p className="text-white/70 mt-3">Jump into the live solar system experience.</p>
            <Link
              to="/explore"
              className="inline-flex items-center gap-2 px-8 py-3 mt-6 rounded-xl bg-white text-black font-semibold transition hover:bg-white/90"
            >
              Launch Experience
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
