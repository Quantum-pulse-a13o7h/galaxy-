import { useEffect, useRef, useState, useMemo, Suspense } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { useSolarSystem, Planet } from "@/lib/stores/useSolarSystem";
import { ArrowLeft, Sparkles, Info, Ruler, Weight, Thermometer, Clock, Calendar, Atom, Loader2 } from "lucide-react";
import { motion, useScroll } from "framer-motion";
import { fetchWikipediaExtract } from "@/lib/wikipedia";

function DetailPlanet({ planet, scrollProgress }: { planet: Planet; scrollProgress: number }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const cloudsRef = useRef<THREE.Mesh>(null);
  const atmosphereRef = useRef<THREE.Mesh>(null);
  const { camera } = useThree();
  const targetZ = useRef(8);
  
  useFrame(() => {
    const zoomDistance = 8 - scrollProgress * 3.5;
    targetZ.current = Math.max(4.5, zoomDistance);
    camera.position.z += (targetZ.current - camera.position.z) * 0.05;
  });
  
  const planetMaterial = useMemo(() => {
    const baseColor = new THREE.Color(planet.color);
    return new THREE.MeshStandardMaterial({
      color: baseColor,
      roughness: 0.6,
      metalness: 0.15,
      emissive: baseColor.clone().multiplyScalar(0.15),
      emissiveIntensity: 0.4,
    });
  }, [planet.color]);

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.002;
    }
    if (cloudsRef.current) {
      cloudsRef.current.rotation.y += 0.003;
    }
  });

  const isEarth = planet.id === "earth";
  const isSaturn = planet.id === "saturn";
  const isSun = planet.type === "star";

  return (
    <group>
      <mesh ref={meshRef} material={planetMaterial}>
        <sphereGeometry args={[2, 256, 256]} />
      </mesh>
      
      {isEarth && (
        <>
          <mesh ref={cloudsRef}>
            <sphereGeometry args={[2.04, 128, 128]} />
            <meshStandardMaterial color="#ffffff" transparent opacity={0.35} roughness={1} />
          </mesh>
          <mesh ref={atmosphereRef}>
            <sphereGeometry args={[2.2, 64, 64]} />
            <meshBasicMaterial color="#87CEEB" transparent opacity={0.1} side={THREE.BackSide} />
          </mesh>
        </>
      )}
      
      {isSaturn && (
        <group rotation={[Math.PI * 0.4, 0, 0]}>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <ringGeometry args={[2.8, 3.2, 128]} />
            <meshStandardMaterial color="#C9B896" transparent opacity={0.7} side={THREE.DoubleSide} roughness={0.8} />
          </mesh>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <ringGeometry args={[3.3, 3.8, 128]} />
            <meshStandardMaterial color="#E8D5B7" transparent opacity={0.5} side={THREE.DoubleSide} roughness={0.8} />
          </mesh>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <ringGeometry args={[4.0, 4.6, 128]} />
            <meshStandardMaterial color="#D4C4A8" transparent opacity={0.35} side={THREE.DoubleSide} roughness={0.8} />
          </mesh>
        </group>
      )}
      
      {isSun && (
        <>
          <mesh>
            <sphereGeometry args={[2.3, 64, 64]} />
            <meshBasicMaterial color="#FF8C00" transparent opacity={0.25} side={THREE.BackSide} />
          </mesh>
          <pointLight color="#FFF5E0" intensity={2} distance={50} />
        </>
      )}
      
      <ambientLight intensity={0.3} color="#404060" />
      <directionalLight position={[5, 5, 5]} intensity={1.5} color="#ffffff" />
      <directionalLight position={[-5, 2, -5]} intensity={0.3} color="#4477ff" />
      <pointLight position={[0, 0, 8]} intensity={0.5} color="#ffffff" />
      
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        autoRotate
        autoRotateSpeed={0.5}
        minPolarAngle={Math.PI / 4}
        maxPolarAngle={Math.PI * 3 / 4}
      />
    </group>
  );
}

export default function PlanetDetail() {
  const { planetId } = useParams();
  const navigate = useNavigate();
  const { planets } = useSolarSystem();
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ container: containerRef });
  const [scrollValue, setScrollValue] = useState(0);
  const [wikiDescription, setWikiDescription] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const planet = planets.find(p => p.id === planetId);
  
  useEffect(() => {
    return scrollYProgress.on("change", (v) => setScrollValue(v));
  }, [scrollYProgress]);
  
  useEffect(() => {
    if (planet) {
      setIsLoading(true);
      fetchWikipediaExtract(planet.name)
        .then((data) => {
          if (data?.extract) {
            setWikiDescription(data.extract);
          } else {
            setWikiDescription(planet.description);
          }
        })
        .catch(() => {
          setWikiDescription(planet.description);
        })
        .finally(() => setIsLoading(false));
    }
  }, [planet?.id, planet?.description]);
  
  if (!planet) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-black">
        <p className="text-white">Planet not found</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-black relative">
      <div className="fixed inset-0 z-0">
        <Canvas
          camera={{
            position: [0, 0, 8],
            fov: 45,
            near: 0.1,
            far: 100
          }}
          gl={{
            antialias: true,
            toneMapping: 3,
            toneMappingExposure: 1.5,
          }}
          dpr={[1, 2]}
        >
          <color attach="background" args={["#000005"]} />
          <Suspense fallback={null}>
            <DetailPlanet planet={planet} scrollProgress={scrollValue} />
          </Suspense>
        </Canvas>
      </div>
      
      <div className="fixed top-4 left-4 z-50">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-xl hover:bg-white/20 border border-white/20 rounded-xl text-white transition-all duration-200"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Solar System
        </button>
      </div>
      
      <div 
        ref={containerRef}
        className="absolute inset-0 z-10 overflow-y-auto scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent"
      >
        <div className="min-h-[200vh] relative">
          <div className="h-screen flex items-center justify-center pointer-events-none">
            <motion.div 
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              <h1 className="text-6xl md:text-8xl font-bold text-white mb-4">{planet.name}</h1>
              <p className="text-white/60 text-lg md:text-xl max-w-md mx-auto">{planet.type === "star" ? "The Star at the Center" : "The " + planet.name + " Planet"}</p>
              <div className="mt-8 animate-bounce">
                <p className="text-white/40 text-sm">Scroll down to explore</p>
              </div>
            </motion.div>
          </div>
          
          <div className="relative z-20 bg-gradient-to-t from-black via-black/95 to-transparent">
            <div className="max-w-4xl mx-auto px-6 py-20">
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="mb-12"
              >
                <h2 className="text-3xl font-bold text-white mb-4 flex items-center gap-3">
                  <Info className="w-7 h-7 text-blue-400" />
                  About {planet.name}
                </h2>
                {isLoading ? (
                  <div className="flex items-center gap-2 text-white/50">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Loading from Wikipedia...</span>
                  </div>
                ) : (
                  <p className="text-white/80 text-lg leading-relaxed">
                    {wikiDescription || planet.description}
                  </p>
                )}
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                viewport={{ once: true }}
                className="mb-12"
              >
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                  <Atom className="w-6 h-6 text-purple-400" />
                  Scientific Data
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-5">
                    <div className="flex items-center gap-2 text-white/50 text-sm mb-2">
                      <Ruler className="w-4 h-4" />
                      Diameter
                    </div>
                    <p className="text-white text-xl font-semibold">{planet.diameter}</p>
                  </div>
                  <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-5">
                    <div className="flex items-center gap-2 text-white/50 text-sm mb-2">
                      <Weight className="w-4 h-4" />
                      Mass
                    </div>
                    <p className="text-white text-xl font-semibold">{planet.mass}</p>
                  </div>
                  <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-5">
                    <div className="flex items-center gap-2 text-white/50 text-sm mb-2">
                      <Weight className="w-4 h-4" />
                      Gravity
                    </div>
                    <p className="text-white text-xl font-semibold">{planet.gravity}</p>
                  </div>
                  <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-5">
                    <div className="flex items-center gap-2 text-white/50 text-sm mb-2">
                      <Thermometer className="w-4 h-4" />
                      Temperature
                    </div>
                    <p className="text-white text-xl font-semibold">{planet.temperature}</p>
                  </div>
                  <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-5">
                    <div className="flex items-center gap-2 text-white/50 text-sm mb-2">
                      <Clock className="w-4 h-4" />
                      Day Length
                    </div>
                    <p className="text-white text-xl font-semibold">{planet.dayLength}</p>
                  </div>
                  <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-5">
                    <div className="flex items-center gap-2 text-white/50 text-sm mb-2">
                      <Calendar className="w-4 h-4" />
                      Year Length
                    </div>
                    <p className="text-white text-xl font-semibold">{planet.yearLength}</p>
                  </div>
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
                className="mb-20"
              >
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                  <Sparkles className="w-6 h-6 text-yellow-400" />
                  Fun Facts
                </h2>
                <div className="space-y-4">
                  {planet.funFacts.map((fact, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                      viewport={{ once: true }}
                      className="flex items-start gap-4 bg-gradient-to-r from-white/5 to-transparent border-l-2 border-yellow-400/50 pl-4 py-3"
                    >
                      <span className="text-yellow-400 font-bold">{index + 1}</span>
                      <p className="text-white/80">{fact}</p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="text-center pb-20"
              >
                <button
                  onClick={() => navigate("/")}
                  className="px-8 py-3 bg-blue-500/80 hover:bg-blue-500 rounded-xl text-white font-medium transition-all duration-200"
                >
                  Explore More Planets
                </button>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
