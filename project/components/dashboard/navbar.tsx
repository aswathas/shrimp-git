"use client";

import { Button } from "@/components/ui/button";
import { Droplet, Pill, Calculator, Settings } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const navbarItems = [
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
    title: "Settings",
    icon: Settings,
    href: "/settings",
  },
];

export function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="w-full border-b border-muted px-4 py-2">
      <ul className="flex space-x-4">
        {navbarItems.map((item) => (
          <li key={item.href}>
            <Link href={item.href}>
              <Button
                variant={pathname === item.href ? "secondary" : "ghost"}
                className={cn("flex items-center gap-2", {
                  "bg-muted": pathname === item.href,
                })}
              >
                <item.icon className="h-4 w-4" />
                {item.title}
              </Button>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
