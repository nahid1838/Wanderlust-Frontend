import { Suspense } from "react"
import type { Metadata } from "next"
import DestinationsExplorer from "@/components/destination/destinations-explorer"
import { Skeleton } from "@/components/ui/skeleton"
import { IDestination } from "@/lib/type"

export const metadata: Metadata = {
  title: "All Destinations | Wanderlast",
}

/**
 * Demo data shown only when the API (localhost:5000) is unreachable —
 * keeps the page renderable for design review without the backend.
 */
const FALLBACK_DESTINATIONS: IDestination[] = [
  {
    _id: "sample-1",
    destinationName: "Bali Paradise",
    country: "Indonesia",
    category: "beach",
    price: 1299,
    duration: "7 Days / 6 Nights",
    departureDate: "2026-11-15",
    imageUrl: "/assets/destinations/image6.png",
    description: "Golden beaches, emerald rice terraces and ancient temples.",
  },
  {
    _id: "sample-2",
    destinationName: "Maldives Overwater Escape",
    country: "Maldives",
    category: "luxury",
    price: 2799,
    duration: "5 Days / 4 Nights",
    departureDate: "2026-12-02",
    imageUrl: "/assets/destinations/image5.png",
    description: "Overwater villas above crystal-clear turquoise lagoons.",
  },
  {
    _id: "sample-3",
    destinationName: "Himalayan Horizon",
    country: "Nepal",
    category: "mountain",
    price: 1799,
    duration: "8 Days / 7 Nights",
    departureDate: "2026-10-20",
    imageUrl: "/assets/destinations/image4.png",
    description: "Panoramic mountain views and unforgettable ridge walks.",
  },
  {
    _id: "sample-4",
    destinationName: "Machu Picchu Discovery",
    country: "Peru",
    category: "cultural",
    price: 2399,
    duration: "6 Days / 5 Nights",
    departureDate: "2026-11-05",
    imageUrl: "/assets/destinations/image3.png",
    description: "Ancient Inca ruins high in the Andes mountains.",
  },
  {
    _id: "sample-5",
    destinationName: "Coastal Dunes Retreat",
    country: "Australia",
    category: "beach",
    price: 899,
    duration: "4 Days / 3 Nights",
    departureDate: "2026-09-30",
    imageUrl: "/assets/destinations/image2.png",
    description: "White sand beaches and lazy afternoons by the shore.",
  },
  {
    _id: "sample-6",
    destinationName: "Sonoran Desert Sunsets",
    country: "United States",
    category: "adventure",
    price: 1899,
    duration: "5 Days / 4 Nights",
    departureDate: "2026-11-25",
    imageUrl: "/assets/destinations/image1.png",
    description: "Desert trails, cactus forests and glowing sunsets.",
  },
]

async function getDestinations(): Promise<IDestination[]> {
  try {
    const res = await fetch("http://localhost:5000/destinations")
    if (!res.ok) throw new Error(`API responded with ${res.status}`)
    const data: unknown = await res.json()
    if (!Array.isArray(data)) throw new Error("API did not return an array")
    return data as IDestination[]
  } catch (error) {
    console.warn("Destinations API unreachable, using fallback data:", error)
    return FALLBACK_DESTINATIONS
  }
}

async function DestinationsSection() {
  const destinations = await getDestinations()
  return <DestinationsExplorer destinations={destinations} />
}

/** Layout-matching placeholder while the fetch streams in. */
function ExplorerSkeleton() {
  return (
    <div>
      <div className="grid gap-4 sm:grid-cols-3">
        <Skeleton className="h-11 rounded-md" />
        <Skeleton className="h-11 rounded-md" />
        <Skeleton className="h-11 rounded-md" />
      </div>
      <Skeleton className="mt-4 h-4 w-44" />
      <div className="mt-6 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="overflow-hidden rounded-xl border border-border/70"
          >
            <Skeleton className="aspect-[2/1] rounded-none" />
            <div className="space-y-3 p-4">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-24" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

const AllDestinationsPage = () => {
  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-12 md:py-16">
      <h1 className="text-4xl font-medium text-foreground sm:text-5xl">
        Explore All Destinations
      </h1>
      <p className="mt-3 text-sm text-muted-foreground sm:text-base">
        Find your perfect travel experience from our curated collection
      </p>

      {/* Uncached fetch must sit inside <Suspense> (Cache Components) */}
      <div className="mt-8">
        <Suspense fallback={<ExplorerSkeleton />}>
          <DestinationsSection />
        </Suspense>
      </div>
    </main>
  )
}

export default AllDestinationsPage
