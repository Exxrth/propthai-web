'use client'

import dynamic from 'next/dynamic'
import type { Property } from '@/types/property'

// Leaflet uses `window` — must be loaded client-side only
const MapView = dynamic(() => import('./MapView'), { ssr: false, loading: () => (
  <div className="w-full h-full rounded-xl bg-gray-100 flex items-center justify-center">
    <p className="text-gray-400 text-sm">กำลังโหลดแผนที่...</p>
  </div>
)})

export default function MapClientWrapper({ properties }: { properties: Property[] }) {
  return (
    <div className="w-full h-full">
      <MapView properties={properties} />
    </div>
  )
}
