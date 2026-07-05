import type { Metadata } from 'next'
import { Geist } from 'next/font/google'
import ClientLayout from '@/components/ClientLayout'
import './globals.css'

const geist = Geist({ subsets: ['latin'], variable: '--font-geist' })

export const metadata: Metadata = {
  title: { default: 'Resipacial — Take a rest with your special place', template: '%s | Resipacial' },
  description: 'Resipacial — Take a rest with your special place. ค้นหาบ้าน คอนโด ที่ดิน อสังหาริมทรัพย์คุณภาพทั่วประเทศไทย',
  keywords: ['อสังหาริมทรัพย์', 'บ้าน', 'คอนโด', 'ที่ดิน', 'ซื้อบ้าน', 'เช่าบ้าน', 'Resipacial'],
  openGraph: {
    siteName: 'Resipacial',
    title: 'Resipacial — 𝗧𝗮𝗸𝗲 𝗮 𝗿𝗲𝘀𝘁 𝘄𝗶𝘁𝗵 𝘆𝗼𝘂𝗿 𝘀𝗽𝗲𝗰𝗶𝗮𝗹 𝗽𝗹𝗮𝗰𝗲',
    description: '𝗧𝗮𝗸𝗲 𝗮 𝗿𝗲𝘀𝘁 𝘄𝗶𝘁𝗵 𝘆𝗼𝘂𝗿 𝘀𝗽𝗲𝗰𝗶𝗮𝗹 𝗽𝗹𝗮𝗰𝗲 — ค้นหาบ้าน คอนโด ที่ดิน ทั่วประเทศไทย',
    type: 'website',
    locale: 'th_TH',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="th" className={`${geist.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-gray-50 text-gray-900">
        {children}
        <ClientLayout />
      </body>
    </html>
  )
}
