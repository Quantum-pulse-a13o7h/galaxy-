import { useRef, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { useSolarSystem } from "@/lib/stores/useSolarSystem";

export function CameraController() {
  const controlsRef = useRef<any>(null);
  const { camera } = useThree();
  const { focusedPlanet, cameraResetTrigger, simulationSpeed, isPaused } = useSolarSystem();
  const targetPosition = useRef(new THREE.Vector3(0, 0, 0));
  const orbitAngle = useRef(0);
  const lastFocusedId = useRef<string | null>(null);

  useEffect(() => {
    if (!focusedPlanet) {
      camera.position.set(0, 80, 120);
      if (controlsRef.current) {
        controlsRef.current.target.set(0, 0, 0);
      }
      lastFocusedId.current = null;
    }
  }, [cameraResetTrigger, camera]);

  useEffect(() => {
    if (focusedPlanet && focusedPlanet.id !== lastFocusedId.current) {
      orbitAngle.current = 0;
      lastFocusedId.current = focusedPlanet.id;
    }
  }, [focusedPlanet]);

  useFrame((state, delta) => {
    if (focusedPlanet && controlsRef.current) {
      if (!isPaused) {
        orbitAngle.current += focusedPlanet.orbitSpeed * simulationSpeed;
      }
      
      const x = Math.cos(orbitAngle.current) * focusedPlanet.orbitRadius;
      const z = Math.sin(orbitAngle.current) * focusedPlanet.orbitRadius;
      
      targetPosition.current.set(x, 0, z);
      
      controlsRef.current.target.lerp(targetPosition.current, 0.08);
      
      const distance = Math.max(focusedPlanet.radius * 8, 5);
      const targetCameraPos = new THREE.Vector3(
        x + distance * 0.6,
        distance * 0.4,
        z + distance * 0.8
      );
      camera.position.lerp(targetCameraPos, 0.04);
    }
  });

  return (
    <OrbitControls
      ref={controlsRef}
      enablePan={true}
      enableZoom={true}
      enableRotate={true}
      minDistance={3}
      maxDistance={300}
      dampingFactor={0.08}
      enableDamping
      rotateSpeed={0.5}
      zoomSpeed={0.8}
    />
  );
}
