import Image from "next/image"
import Link from "next/link"
import { cn } from "cn"
import { ArrowRightIcon } from "lucide-react"
import { buttonVariants } from "@/components/ui/button"

// TODO(routes): replace "#" once the booking page exists.
const BOOK_TRIP_HREF = "#"

/**
 * Closing CTA band ("Ready To Start Your Journey?") on CTA.png.
 */
export function Cta() {
  return (
    <section className="relative isolate overflow-hidden px-4 py-20 md:py-24">
      <Image
        src="/assets/CTA.png"
        alt=""
        fill
        sizes="100vw"
        className="object-cover"
      />
      {/* CTA.png is not pre-darkened — wash it for white-text contrast */}
      <div className="absolute inset-0 bg-black/60" aria-hidden="true" />

      <div className="relative z-10 mx-auto flex max-w-2xl flex-col items-center text-center">
        <h2 className="text-4xl font-light text-white sm:text-5xl">
          Ready To Start Your Journey?
        </h2>
        <p className="mt-4 text-sm text-white/85 sm:text-base">
          Join thousands of travelers who have discovered the world with us
        </p>
        <Link
          href={BOOK_TRIP_HREF}
          className={cn(
            buttonVariants(),
            "mt-8 h-11 rounded-md bg-background px-6 text-xs font-semibold tracking-widest text-foreground uppercase shadow-md hover:bg-background/90 sm:text-sm"
          )}
        >
          Book Your Trip Today
          <ArrowRightIcon />
        </Link>
      </div>
    </section>
  )
}
