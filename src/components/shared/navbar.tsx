"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { cn } from "cn"
import { MenuIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { authClient } from "@/lib/auth-client"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { UserMenu } from "./userMenu"

const NAV_LINKS: { label: string; href: string }[] = [
  { label: "Home", href: "/" },
  { label: "Destinations", href: "/all-destinations" },
  { label: "Add Destination", href: "/add-destination" },
  { label: "My Bookings", href: "#" },
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

  // session = logged in user-er data, na thakle null
  const { data: session, isPending } = authClient.useSession()

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
              className={cn(
                linkClassName(isActive(link.href)),
                "hidden md:inline-flex"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Center: logo */}
        <Link href="/" className="text-2xl font-bold tracking-tight text-brand">
          Wanderlast
        </Link>

        {/* Right side */}
        <div className="flex flex-1 items-center justify-end gap-3 sm:gap-5">
          {/* User thakle: Avatar (mobile + desktop dui jaygatei dekhabe) */}
          {!isPending && session && <UserMenu user={session.user} />}

          {/* User na thakle: Login + Sign Up (shudhu desktop-e) */}
          {!isPending && !session && (
            <div className="hidden items-center gap-5 md:flex">
              <Link href="/login" className={authLinkClassName}>
                Login
              </Link>
              <Link href="/signUp" className={authLinkClassName}>
                Sign Up
              </Link>
            </div>
          )}

          {/* Mobile menu button */}
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

      {/* ---------- MOBILE MENU ---------- */}
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

            {/* Mobile-e Login/Sign Up shudhu user na thakle dekhabe.
                User thakle avatar upore-i ache, tai ekhane kichu lagbe na */}
            {!isPending && !session && (
              <div className="border-t border-border pt-4">
                <Link
                  href="/login"
                  onClick={() => setOpen(false)}
                  className={cn(authLinkClassName, "py-2")}
                >
                  Login
                </Link>
                <Link
                  href="/signUp"
                  onClick={() => setOpen(false)}
                  className={cn(authLinkClassName, "py-2")}
                >
                  Sign Up
                </Link>
              </div>
            )}
          </nav>
        </SheetContent>
      </Sheet>
    </header>
  )
}