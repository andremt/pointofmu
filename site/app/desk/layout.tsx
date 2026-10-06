import type { Metadata } from 'next'
import DeskChrome from '@/components/desk/DeskChrome'

export const metadata: Metadata = {
  title: 'the desk',
  robots: { index: false, follow: false },
}

export default function DeskLayout({ children }: { children: React.ReactNode }) {
  return <DeskChrome>{children}</DeskChrome>
}
