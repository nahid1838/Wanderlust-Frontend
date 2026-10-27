import Image from "next/image"
import Link from "next/link"
import { cn } from "cn"
import { ArrowRightIcon } from "lucide-react"
import { Button, buttonVariants } from "@/components/ui/button"

/**
 * Route wiring: replace "#" with the real path once the page exists.
 * The search strip is presentational for now.
 */
const EXPLORE_HREF = "#"
const DESTINATIONS_HREF = "#"

const SEARCH_FIELDS: { label: string; hint: string }[] = [
  { label: "Location", hint: "Address, City Or Zip" },
  { label: "Date/Duration", hint: "Anytime/3 Days" },
  { label: "Budget", hint: "$0-$3000" },
  { label: "People", hint: "5-10" },
]

export function Banner() {
  return (
    <section className="relative isolate flex min-h-[640px] flex-col overflow-hidden lg:min-h-[calc(100svh-5rem)]">
      <Image
        src="/assets/Banner.png"
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />
      {/* Banner.png is already darkened; only a light wash is needed for contrast. */}
      <div className="absolute inset-0 bg-black/20" aria-hidden="true" />

      {/* Hero content */}
      <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-4 py-16 text-center">
        <h1 className="text-4xl leading-tight font-light text-white sm:text-5xl lg:text-7xl">
          Discover Your
          <br />
          Next Adventure
        </h1>
        <p className="mt-5 max-w-2xl text-sm leading-relaxed text-white/85 sm:text-base">
          Explore breathtaking destinations and create unforgettable memories
          with our curated travel experiences.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          {/* Real anchors styled as buttons (avoids Base UI's nativeButton
              warning — Button's `render` would put an <a> where a <button>
              is expected). */}
          <Link
            href={EXPLORE_HREF}
            className={cn(
              buttonVariants(),
              "h-11 rounded-md bg-brand px-6 text-xs font-semibold tracking-widest text-white uppercase shadow-sm hover:bg-brand/90 sm:text-sm"
            )}
          >
            Explore Now
            <ArrowRightIcon />
          </Link>
          <Link
            href={"/all-destinations"}
            className={cn(
              buttonVariants(),
              "h-11 rounded-md bg-white/20 px-6 text-xs font-semibold tracking-widest text-white uppercase backdrop-blur-sm hover:bg-white/30 sm:text-sm"
            )}
          >
            View Destination
          </Link>
        </div>
      </div>

      {/* Search strip */}
      <div className="relative z-10 border-t border-white/15 bg-black/40 backdrop-blur-sm">
        <div className="flex flex-col divide-y divide-white/10 md:flex-row md:divide-x md:divide-y-0">
          {SEARCH_FIELDS.map((field) => (
            <div key={field.label} className="flex-1 px-5 py-3.5 text-left">
              <p className="text-sm font-semibold text-white">
                {field.label}
              </p>
              <p className="mt-0.5 text-xs text-white/60">{field.hint}</p>
            </div>
          ))}
          <Button className="h-12 rounded-none bg-brand px-10 text-sm font-semibold text-white hover:bg-brand/90 md:h-auto md:w-44">
            Search
          </Button>
        </div>
      </div>
    </section>
  )
}
