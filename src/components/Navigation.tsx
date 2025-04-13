'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Upload, Brain, BarChart2, User } from 'lucide-react'

const navItems = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/upload', label: 'Upload', icon: Upload },
  { href: '/quiz', label: 'Quiz', icon: Brain },
  { href: '/progress', label: 'Progress', icon: BarChart2 },
  { href: '/profile', label: 'Profile', icon: User },
]

export default function Navigation() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-midnight-gray/95 backdrop-blur-sm border-t border-holographic-silver/10">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-around py-4">
          {navItems.map(({ href, label, icon: Icon }) => {
            const isActive = pathname === href || pathname.startsWith(href)
            return (
              <Link
                key={href}
                href={href}
                className={`flex flex-col items-center gap-1 transition-colors ${
                  isActive ? 'nav-link-active' : 'nav-link'
                }`}
              >
                <Icon className="w-6 h-6" />
                <span className="text-xs">{label}</span>
              </Link>
            )
          })}
        </div>
      </div>
    </nav>
  )
} 