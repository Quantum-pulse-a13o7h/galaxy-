import { useEffect } from "react";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";

export function MilkyWay() {
  const texture = useTexture("/textures/milkyway/milkyway.jpg");

  useEffect(() => {
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = 8;
  }, [texture]);

  return (
    <mesh>
      <sphereGeometry args={[450, 64, 64]} />
      <meshBasicMaterial map={texture} side={THREE.BackSide} depthWrite={false} />
    </mesh>
  );
}
