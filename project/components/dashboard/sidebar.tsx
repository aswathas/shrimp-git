"use client"

import { Button } from "@/components/ui/button"
import {
  Droplet,
  Fish,
  AlertTriangle,
  TrendingUp,
  Pill,
  Settings,
  Calculator,
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

const sidebarItems = [
  {
    title: "Water Quality",
    icon: Droplet,
    href: "/water-quality",
  },
  {
    title: "Medicine",
    icon: Pill,
    href: "/medicine",
  },
  {
    title: "Count Estimation",
    icon: Calculator,
    href: "/count-estimation",

  },
  {
    title: "Education",
    icon: Settings,
    href: "/education",
  },
  {
    title: "Settings",
    icon: Settings,
    href: "/settings",
  },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="pb-12 min-h-screen">
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <div className="space-y-1">
            {sidebarItems.map((item) => (
              <Link key={item.href} href={item.href}>
                <Button
                  variant={pathname === item.href ? "secondary" : "ghost"}
                  className={cn("w-full justify-start gap-2", {
                    "bg-muted": pathname === item.href,
                  })}
                >
                  <item.icon className="h-4 w-4" />
                  {item.title}
                </Button>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}