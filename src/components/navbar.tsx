"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { cn } from "cn"
import { MenuIcon, UserIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"

/**
 * Route wiring lives here: replace "#" with the real path once the page
 * exists (e.g. "/destinations"). Links with href "#" stay inert and are
 * never highlighted as active; the current pathname highlights automatically.
 */
const NAV_LINKS: { label: string; href: string }[] = [
  { label: "Home", href: "/" },
  { label: "Destinations", href: "/all-destinations" },
  { label: "Add Destination", href: "/add-destination"},
  { label: "My Bookings", href: "#" },
]

const AUTH_LINKS: {
  label: string
  href: string
  icon?: typeof UserIcon
}[] = [
  { label: "Profile", href: "#", icon: UserIcon },
  { label: "Login", href: "#" },
  { label: "Sign Up", href: "#" },
]

const linkClassName = (isActive: boolean) =>
  cn(
    "inline-flex items-center border-b-2 pb-1 text-sm font-medium transition-colors",
    isActive
      ? "border-brand text-brand"
      : "border-transparent text-foreground/80 hover:text-foreground"
  )

const authLinkClassName =
  "inline-flex items-center gap-1.5 text-sm font-medium text-foreground/80 transition-colors hover:text-brand"

export function Navbar() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  const isActive = (href: string) => href !== "#" && pathname === href

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background shadow-sm">
      <div className="mx-auto flex h-20 max-w-screen-2xl items-center px-4 md:px-6">
        {/* Left: desktop nav */}
        <nav className="flex flex-1 items-center gap-6">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className={cn(linkClassName(isActive(link.href)), "hidden md:inline-flex")}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Center: logo */}
        <Link
          href="/"
          className="text-2xl font-bold tracking-tight text-brand"
        >
          Wanderlast
        </Link>

        {/* Right: auth links (desktop) + menu button (mobile) */}
        <div className="flex flex-1 items-center justify-end gap-5">
          <div className="hidden items-center gap-5 md:flex">
            {AUTH_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className={authLinkClassName}
              >
                {link.icon && <link.icon className="size-3.5" />}
                {link.label}
              </Link>
            ))}
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            aria-label="Open menu"
            onClick={() => setOpen(true)}
          >
            <MenuIcon />
          </Button>
        </div>
      </div>

      {/* Mobile menu */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="right" className="gap-0">
          <SheetHeader>
            <SheetTitle className="text-lg font-bold text-brand">
              Wanderlast
            </SheetTitle>
            <SheetDescription className="sr-only">
              Site navigation
            </SheetDescription>
          </SheetHeader>
          <nav className="flex flex-col gap-4 px-4 pb-4">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setOpen(false)}
                className={linkClassName(isActive(link.href))}
              >
                {link.label}
              </Link>
            ))}
            <div className="border-t border-border pt-4">
              {AUTH_LINKS.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={cn(authLinkClassName, "py-2")}
                >
                  {link.icon && <link.icon className="size-3.5" />}
                  {link.label}
                </Link>
              ))}
            </div>
          </nav>
        </SheetContent>
      </Sheet>
    </header>
  )
}
