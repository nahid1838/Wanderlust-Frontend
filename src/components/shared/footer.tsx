import type { ComponentType, SVGProps } from "react"
import Link from "next/link"
import { ArrowUpRightIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

/**
 * Site footer. Hrefs live in the arrays below — replace "#" with real
 * routes when they exist (Home already points at "/").
 */
const QUICK_LINKS: { label: string; href: string }[] = [
  { label: "Home", href: "/" },
  { label: "Destinations", href: "/all-destinations" },
  { label: "My Bookings", href: "/my-bookings" },
  { label: "My Profile", href: "#" },
]

const SUPPORT_LINKS: { label: string; href: string }[] = [
  { label: "Help Center", href: "#" },
  { label: "Terms of Service", href: "#" },
  { label: "Privacy Policy", href: "#" },
]

const SOCIAL_LINKS: {
  label: string
  href: string
  icon: ComponentType<SVGProps<SVGSVGElement>>
}[] = [
  {
    label: "X",
    href: "#",
    icon: (props) => (
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
        <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
      </svg>
    ),
  },
  {
    label: "LinkedIn",
    href: "#",
    icon: (props) => (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        {...props}
      >
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
        <rect x="2" y="9" width="4" height="12" />
        <circle cx="4" cy="4" r="2" />
      </svg>
    ),
  },
  {
    label: "Instagram",
    href: "#",
    icon: (props) => (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        {...props}
      >
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
      </svg>
    ),
  },
]

const columnHeadingClassName =
  "text-sm font-semibold uppercase tracking-widest text-white/90"
const footerLinkClassName =
  "text-sm text-white/60 transition-colors hover:text-white"

export function Footer() {
  return (
    <footer className="mt-auto bg-neutral-950 px-4 pt-14 pb-8 text-white">
      <div className="mx-auto max-w-6xl">
        {/* Brand block */}
        <p className="text-5xl font-bold tracking-tight sm:text-7xl lg:text-8xl">
          Wanderlast
        </p>
        <p className="mt-3 text-sm text-white/60 sm:text-base">
          Your gateway to extraordinary travel experiences around the world.
        </p>

        {/* Columns */}
        <div className="mt-12 grid gap-10 md:grid-cols-[2fr_1fr_1fr_1fr]">
          <div>
            <h3 className={columnHeadingClassName}>Newsletter</h3>
            <p className="mt-3 text-xs text-white/60">
              Subscribe for exclusive travel deals and inspiration.
            </p>
            <div className="relative mt-4 w-full max-w-xs">
              <Input
                type="email"
                placeholder="Enter email"
                className="h-11 rounded-md border-white/25 bg-white/5 pr-11 pl-4 text-sm text-white placeholder:text-white/50 focus-visible:border-white/50 focus-visible:ring-white/20"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                aria-label="Subscribe"
                className="absolute top-1/2 right-1.5 -translate-y-1/2 text-white hover:bg-white/10 hover:text-white"
              >
                <ArrowUpRightIcon />
              </Button>
            </div>
          </div>

          <div>
            <h3 className={columnHeadingClassName}>Quick Links</h3>
            <ul className="mt-4 space-y-3">
              {QUICK_LINKS.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className={footerLinkClassName}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className={columnHeadingClassName}>Support</h3>
            <ul className="mt-4 space-y-3">
              {SUPPORT_LINKS.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className={footerLinkClassName}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className={columnHeadingClassName}>Contact Us</h3>
            <ul className="mt-4 space-y-3">
              <li>
                <a href="tel:+17869011522" className={footerLinkClassName}>
                  786 901 1522
                </a>
              </li>
              <li>
                <a
                  href="mailto:info@wanderland.com"
                  className={footerLinkClassName}
                >
                  info@wanderland.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-col gap-4 border-t border-white/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-white/50">
            © 2026 Wanderlust. All rights reserved.
          </p>
          <div className="flex items-center gap-3">
            {SOCIAL_LINKS.map((social) => (
              <Link
                key={social.label}
                href={social.href}
                aria-label={social.label}
                className="flex size-9 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
              >
                <social.icon className="size-4" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
