import { useEffect } from "react";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";

type PlanetTextureSet = {
  map: THREE.Texture;
  cloudsMap?: THREE.Texture;
  lightsMap?: THREE.Texture;
  ringsMap?: THREE.Texture;
};

const PLANET_TEXTURES: Record<string, {
  map: string;
  clouds?: string;
  lights?: string;
  rings?: string;
}> = {
  sun: { map: "/textures/planets/sun/color.jpg" },
  mercury: { map: "/textures/planets/mercury/color.jpg" },
  venus: {
    map: "/textures/planets/venus/color.jpg",
    clouds: "/textures/planets/venus/clouds.jpg",
  },
  earth: {
    map: "/textures/planets/earth/color.jpg",
    clouds: "/textures/planets/earth/clouds.jpg",
    lights: "/textures/planets/earth/lights.jpg",
  },
  mars: { map: "/textures/planets/mars/color.jpg" },
  jupiter: { map: "/textures/planets/jupiter/color.jpg" },
  saturn: {
    map: "/textures/planets/saturn/color.jpg",
    rings: "/textures/planets/saturn/rings.png",
  },
  uranus: { map: "/textures/planets/uranus/color.jpg" },
  neptune: { map: "/textures/planets/neptune/color.jpg" },
};

export function usePlanetTextures(id: string): PlanetTextureSet {
  const paths = PLANET_TEXTURES[id];
  if (!paths) {
    throw new Error(`Missing texture paths for planet: ${id}`);
  }

  const toLoad: Record<string, string> = {
    map: paths.map,
  };
  if (paths.clouds) toLoad.cloudsMap = paths.clouds;
  if (paths.lights) toLoad.lightsMap = paths.lights;
  if (paths.rings) toLoad.ringsMap = paths.rings;

  const textures = useTexture(toLoad) as Record<string, THREE.Texture>;

  useEffect(() => {
    Object.values(textures).forEach((t) => {
      t.colorSpace = THREE.SRGBColorSpace;
      t.anisotropy = 8;
    });
  }, [textures]);

  return textures as PlanetTextureSet;
}

export function useMoonTexture() {
  const texture = useTexture("/textures/moons/shared/color.jpg") as THREE.Texture;

  useEffect(() => {
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = 8;
  }, [texture]);

  return texture;
}
