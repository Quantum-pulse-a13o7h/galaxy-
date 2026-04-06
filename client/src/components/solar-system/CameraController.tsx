import { useRef, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { useSolarSystem } from "@/lib/stores/useSolarSystem";

export function CameraController() {
  const controlsRef = useRef<any>(null);
  const { camera, scene } = useThree();
  const { focusedPlanet, cameraResetTrigger } = useSolarSystem();
  const targetPosition = useRef(new THREE.Vector3());
  const targetObject = useRef<THREE.Object3D | null>(null);

  useEffect(() => {
    if (!focusedPlanet) {
      camera.position.set(0, 80, 120);
      controlsRef.current?.target.set(0, 0, 0);
      targetObject.current = null;
    }
  }, [cameraResetTrigger, camera, focusedPlanet]);

  useEffect(() => {
    targetObject.current = focusedPlanet
      ? scene.getObjectByName(`planet-${focusedPlanet.id}`) ?? null
      : null;
  }, [focusedPlanet, scene]);

  useFrame(() => {
    if (focusedPlanet && controlsRef.current && targetObject.current) {
      targetObject.current.getWorldPosition(targetPosition.current);
      controlsRef.current.target.lerp(targetPosition.current, 0.08);

      const distance = Math.max(focusedPlanet.radius * 8, 5);
      const targetCameraPos = new THREE.Vector3(
        targetPosition.current.x + distance * 0.6,
        targetPosition.current.y + distance * 0.4,
        targetPosition.current.z + distance * 0.8
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
