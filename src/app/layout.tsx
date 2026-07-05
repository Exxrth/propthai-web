import type { Metadata } from 'next'
import { Geist } from 'next/font/google'
import ClientLayout from '@/components/ClientLayout'
import './globals.css'

const geist = Geist({ subsets: ['latin'], variable: '--font-geist' })

export const metadata: Metadata = {
  title: { default: 'Resipacial — อสังหาริมทรัพย์คุณภาพ', template: '%s | Resipacial' },
  description: 'Resipacial — ค้นหาบ้าน คอนโด ที่ดิน อสังหาริมทรัพย์คุณภาพทั่วประเทศไทย',
  keywords: ['อสังหาริมทรัพย์', 'บ้าน', 'คอนโด', 'ที่ดิน', 'ซื้อบ้าน', 'เช่าบ้าน', 'Resipacial'],
  openGraph: {
    siteName: 'Resipacial',
    title: 'Resipacial — อสังหาริมทรัพย์คุณภาพ',
    description: 'ค้นหาบ้าน คอนโด ที่ดิน อสังหาริมทรัพย์คุณภาพทั่วประเทศไทย',
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
