import React from 'react';
import Lottie from 'react-lottie-player';
import rocketAnimation from '@/public/rocketAnimation.json';

export default function Loader() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center">
      <Lottie
        loop
        animationData={rocketAnimation}
        play
        style={{ width: 125, height: 125 }}
      />
      <p className="text-sm text-muted-foreground">
        Hang tight! Loading data...
      </p>
    </div>
  );
}
