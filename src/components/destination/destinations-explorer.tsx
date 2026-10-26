"use client"

import { useMemo, useState } from "react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import DestinationCard from "@/components/shared/destinationCard"
import { CATEGORIES } from "@/lib/constant"
import type { IDestination } from "@/lib/type"

const CATEGORY_OPTIONS = [
  { value: "all", label: "All Categories" },
  ...CATEGORIES,
]

const PRICE_RANGE_OPTIONS = [
  { value: "all", label: "All Prices" },
  { value: "under-1000", label: "Under $1,000" },
  { value: "1000-2500", label: "$1,000 – $2,500" },
  { value: "2500-5000", label: "$2,500 – $5,000" },
  { value: "over-5000", label: "$5,000+" },
]

const SORT_OPTIONS = [
  { value: "featured", label: "Featured" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "rating", label: "Top Rated" },
]

const matchesPriceRange = (price: number, range: string) => {
  switch (range) {
    case "under-1000":
      return price < 1000
    case "1000-2500":
      return price >= 1000 && price < 2500
    case "2500-5000":
      return price >= 2500 && price < 5000
    case "over-5000":
      return price >= 5000
    default:
      return true
  }
}

/** Filter bar selects: bordered box, uppercase label until chosen. */
const filterTriggerClassName =
  "h-11 w-full justify-between rounded-md border-border bg-background pl-4 pr-3 data-placeholder:text-sm data-placeholder:font-semibold data-placeholder:uppercase data-placeholder:tracking-widest"

const DestinationsExplorer = ({
  destinations,
}: {
  destinations: IDestination[]
}) => {
  // null = untouched (shows the uppercase placeholder from the mockup)
  const [category, setCategory] = useState<string | null>(null)
  const [priceRange, setPriceRange] = useState<string | null>(null)
  const [sortBy, setSortBy] = useState<string | null>(null)

  const visible = useMemo(() => {
    const filtered = destinations.filter((destination) => {
      const categoryOk =
        !category || category === "all" || destination.category === category
      const priceOk =
        !priceRange ||
        priceRange === "all" ||
        matchesPriceRange(destination.price, priceRange)
      return categoryOk && priceOk
    })

    switch (sortBy) {
      case "price-asc":
        return [...filtered].sort((a, b) => a.price - b.price)
      case "price-desc":
        return [...filtered].sort((a, b) => b.price - a.price)
      case "rating":
        return [...filtered].sort(
          (a, b) => (b.rating ?? 4.5) - (a.rating ?? 4.5)
        )
      default:
        return filtered
    }
  }, [destinations, category, priceRange, sortBy])

  return (
    <div>
      {/* Filter bar */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className={filterTriggerClassName}>
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            {CATEGORY_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={priceRange} onValueChange={setPriceRange}>
          <SelectTrigger className={filterTriggerClassName}>
            <SelectValue placeholder="Price Range" />
          </SelectTrigger>
          <SelectContent>
            {PRICE_RANGE_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className={filterTriggerClassName}>
            <SelectValue placeholder="Sort By" />
          </SelectTrigger>
          <SelectContent>
            {SORT_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <p className="mt-4 text-sm text-muted-foreground">
        Showing {visible.length} destinations
      </p>

      {/* Grid */}
      <div className="mt-6 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {visible.length === 0 ? (
          <p className="col-span-full py-12 text-center text-sm text-muted-foreground">
            No destinations match your filters.
          </p>
        ) : (
          visible.map((destination) => (
            <DestinationCard
              key={destination._id}
              destination={destination}
            />
          ))
        )}
      </div>
    </div>
  )
}

export default DestinationsExplorer
