'use client'

import { useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import Link from 'next/link'
import 'leaflet/dist/leaflet.css'
import type { Property } from '@/types/property'

// Fix default marker icons broken by webpack
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl:       'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl:     'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

const STATUS_LABELS: Record<string, string> = {
  for_sale: 'ขาย', for_rent: 'เช่า', sold: 'ขายแล้ว', rented: 'เช่าแล้ว',
}

interface Props {
  properties: Property[]
  center?: [number, number]
  zoom?: number
}

export default function MapView({ properties, center = [13.736717, 100.523186], zoom = 10 }: Props) {
  // properties that have valid coordinates
  const mapped = properties.filter(
    (p): p is Property & { latitude: number; longitude: number } =>
      p.latitude != null && p.longitude != null,
  )

  return (
    <MapContainer
      center={center}
      zoom={zoom}
      className="w-full h-full rounded-xl"
      scrollWheelZoom
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {mapped.map((p) => (
        <Marker key={p.id} position={[p.latitude, p.longitude]}>
          <Popup minWidth={200}>
            <div className="text-sm leading-relaxed">
              {p.images[0] && (
                <img
                  src={p.images[0]}
                  alt={p.title}
                  className="w-full h-28 object-cover rounded-lg mb-2"
                />
              )}
              <p className="font-semibold text-gray-900 mb-1 line-clamp-2">{p.title}</p>
              <p className="text-gray-500 text-xs mb-1">📍 {p.location}, {p.province}</p>
              <p className="text-blue-600 font-bold mb-2">
                ฿{p.price.toLocaleString('th-TH')}
                {p.status === 'for_rent' && <span className="text-xs font-normal text-gray-400">/เดือน</span>}
              </p>
              <Link
                href={`/listings/${p.id}`}
                className="block text-center bg-blue-600 text-white text-xs px-3 py-1.5 rounded-lg hover:bg-blue-700 transition-colors"
              >
                ดูรายละเอียด →
              </Link>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  )
}
