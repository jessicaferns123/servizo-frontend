'use client';

import dynamic from 'next/dynamic';

// Leaflet reads `window` as soon as it's imported, so load the map only in the browser.
// The props come from MapSelector's default export, so this wrapper passes them through
// unchanged.
const MapSelectorClient = dynamic(() => import('./MapSelector'), {
  ssr: false,
  loading: () => (
    <div className="flex h-[300px] w-full items-center justify-center bg-gray-100 text-sm text-gray-500">
      Loading map...
    </div>
  ),
});

export default MapSelectorClient;
