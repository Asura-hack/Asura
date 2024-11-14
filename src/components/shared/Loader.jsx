import React from "react";
import AtomicSpinner from "atomic-spinner";

export const Loader = () => {
  return (
    <div className="flex justify-center items-center min-h-[200px]">
      <AtomicSpinner
        atomSize={120}
        electronSize={3}
        nucleusParticleCount={10}
        nucleusParticleSize={3}
        electronTrailWidth={1.5}
        electronTrailColor="#3B82F6"
        electronColor="#3B82F6"
        nucleusParticleColor="#3B82F6"
        electronTrailLength={0.8}
        atomColor="#3B82F6"
      />
    </div>
  );
};
