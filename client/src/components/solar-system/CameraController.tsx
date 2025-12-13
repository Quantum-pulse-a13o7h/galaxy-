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

  useEffect(() => {
    if (!focusedPlanet) {
      camera.position.set(0, 80, 120);
      if (controlsRef.current) {
        controlsRef.current.target.set(0, 0, 0);
      }
    }
  }, [cameraResetTrigger, camera]);

  useFrame((state, delta) => {
    if (focusedPlanet && controlsRef.current) {
      if (!isPaused) {
        orbitAngle.current += focusedPlanet.orbitSpeed * simulationSpeed;
      }
      
      const x = Math.cos(orbitAngle.current) * focusedPlanet.orbitRadius;
      const z = Math.sin(orbitAngle.current) * focusedPlanet.orbitRadius;
      
      targetPosition.current.set(x, 0, z);
      
      controlsRef.current.target.lerp(targetPosition.current, 0.05);
      
      const distance = focusedPlanet.radius * 6;
      const targetCameraPos = new THREE.Vector3(
        x + distance * 0.5,
        distance * 0.5,
        z + distance
      );
      camera.position.lerp(targetCameraPos, 0.02);
    }
  });

  return (
    <OrbitControls
      ref={controlsRef}
      enablePan={true}
      enableZoom={true}
      enableRotate={true}
      minDistance={5}
      maxDistance={300}
      dampingFactor={0.05}
      enableDamping
      rotateSpeed={0.5}
      zoomSpeed={0.8}
    />
  );
}
