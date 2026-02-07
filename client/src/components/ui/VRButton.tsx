import { useState, useEffect } from "react";
import { Glasses } from "lucide-react";

interface VRButtonProps {
  onEnterVR: () => void;
}

export function VRButton({ onEnterVR }: VRButtonProps) {
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    if (navigator.xr) {
      navigator.xr.isSessionSupported("immersive-vr").then((supported) => {
        setIsSupported(supported);
      }).catch(() => {
        setIsSupported(false);
      });
    }
  }, []);

  return (
    <button
      onClick={isSupported ? onEnterVR : undefined}
      disabled={!isSupported}
      className={`fixed bottom-4 left-4 z-50 flex items-center gap-2 px-4 py-2.5 rounded-xl text-white transition-all duration-200 ${
        isSupported
          ? "bg-purple-600/80 hover:bg-purple-600 border border-purple-400/30 cursor-pointer"
          : "bg-white/10 border border-white/20 opacity-50 cursor-not-allowed"
      }`}
      title={isSupported ? "Enter VR Mode" : "VR not available on this device"}
    >
      <Glasses className="w-5 h-5" />
      <span className="text-sm font-medium">
        {isSupported ? "Enter VR" : "VR Mode"}
      </span>
      {!isSupported && (
        <span className="text-xs text-white/40 hidden sm:inline">(requires headset)</span>
      )}
    </button>
  );
}
