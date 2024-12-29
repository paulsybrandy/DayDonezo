'use client';

import React from 'react';

export default function Loader() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center">
      <video
        autoPlay={true}
        loop
        muted
        playsInline
        style={{ width: '150px', height: '150px' }}
      >
        <source src="/loader.webm" type="video/webm" />
      </video>

      <p className="text-sm text-muted-foreground">
        Hang tight! Loading data...
      </p>
    </div>
  );
}
