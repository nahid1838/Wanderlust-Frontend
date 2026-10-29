import Link from "next/link"
import { Suspense } from "react"
import { ArrowRightIcon } from "lucide-react"
import { buttonVariants } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "cn"
import { IFeaturedDestination } from "@/lib/type"
import FeaturedCarousel from "./featured-carousel"

/** TODO(routes): change to a dedicated featured page if one is added later. */
const ALL_DESTINATIONS_HREF = "/all-destinations"

async function getFeaturedDestinations(): Promise<IFeaturedDestination[]> {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/featured-destinations`)
        if (!res.ok) throw new Error(`API responded with ${res.status}`)

        const data: unknown = await res.json()
        if (!Array.isArray(data)) throw new Error("API did not return an array")

        return data as IFeaturedDestination[]
    } catch (error) {
        console.warn("Featured destinations API unreachable:", error)
        return []
    }
}

/** Fetches the data and swaps in the carousel (Suspense child). */
async function FeaturedDestinationsCarousel() {
    const featuredDestinations = await getFeaturedDestinations()

    if (featuredDestinations.length === 0) {
        return (
            <p className="mt-10 text-sm text-muted-foreground">
                No featured destinations yet — check back soon!
            </p>
        )
    }

    return <FeaturedCarousel destinations={featuredDestinations} />
}

/** The uncached API fetch lives behind <Suspense> (Cache Components). */
const FeaturedDestinations = () => {
    return (
        <section className="bg-background px-4 py-16 md:py-24">
            <div className="mx-auto max-w-6xl">
                {/* Section header: heading + subtitle left, ALL DESTINATIONS link right */}
                <div className="flex flex-wrap items-end justify-between gap-4">
                    <div>
                        <h2 className="text-4xl font-medium text-foreground sm:text-5xl">
                            Featured Destinations
                        </h2>
                        <p className="mt-3 text-sm text-muted-foreground sm:text-base">
                            Handpicked travel experiences for the adventure seekers
                        </p>
                    </div>
                    <Link
                        href={ALL_DESTINATIONS_HREF}
                        className={cn(
                            buttonVariants({ variant: "outline" }),
                            "h-11 rounded-md px-6 text-xs font-semibold tracking-widest text-foreground uppercase",
                        )}
                    >
                        All Destinations
                        <ArrowRightIcon className="size-3.5" />
                    </Link>
                </div>

                <Suspense fallback={<FeaturedCarouselSkeleton />}>
                    <FeaturedDestinationsCarousel />
                </Suspense>
            </div>
        </section>
    )
}

export default FeaturedDestinations

/** Loading placeholder matching the card grid layout. */
function FeaturedCarouselSkeleton() {
    return (
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[0, 1, 2].map((i) => (
                <div
                    key={i}
                    className="overflow-hidden rounded-xl border border-border/70"
                >
                    <Skeleton className="aspect-[8/5] w-full rounded-none" />
                    <div className="space-y-2 p-4">
                        <Skeleton className="h-4 w-20" />
                        <Skeleton className="h-6 w-2/3" />
                        <Skeleton className="h-4 w-28" />
                        <Skeleton className="mt-4 h-4 w-24" />
                    </div>
                </div>
            ))}
        </div>
    )
}
