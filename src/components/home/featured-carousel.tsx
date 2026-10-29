"use client"

import * as React from "react"
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
    type CarouselApi,
} from "@/components/ui/carousel"
import { IFeaturedDestination } from "@/lib/type"
import FeaturedDestinationCard from "./FeaturedDestinationCard"

/**
 * Client half of the Featured Destinations section: peeking cards,
 * the "N/Total" counter, progress track and round arrow controls.
 */
export default function FeaturedCarousel({
    destinations,
}: {
    destinations: IFeaturedDestination[]
}) {
    const [api, setApi] = React.useState<CarouselApi>()
    const [current, setCurrent] = React.useState(1)
    const total = destinations.length
    const progress = total > 0 ? (current / total) * 100 : 100

    React.useEffect(() => {
        if (!api) return
        const onSelect = () => setCurrent(api.selectedScrollSnap() + 1)
        api.on("reInit", onSelect)
        api.on("select", onSelect)
        return () => {
            api?.off("reInit", onSelect)
            api?.off("select", onSelect)
        }
    }, [api])

    return (
        <Carousel setApi={setApi} opts={{ align: "start", loop: true }}>
            <CarouselContent className="-ml-4 mt-10">
                {destinations.map((destination) => (
                    <CarouselItem
                        key={destination._id}
                        className="pl-4 basis-[85%] sm:basis-[47%] lg:basis-[32%]"
                    >
                        <FeaturedDestinationCard featuredDestination={destination} />
                    </CarouselItem>
                ))}
            </CarouselContent>

            {/* Counter + progress track + arrows */}
            <div className="mt-8 flex items-center gap-6">
                <p className="shrink-0 text-sm font-medium">
                    <span className="text-foreground">{current}</span>
                    <span className="text-muted-foreground">/{total}</span>
                </p>

                <div className="h-[3px] flex-1 overflow-hidden rounded-full bg-border">
                    <div
                        className="h-full rounded-full bg-foreground/60 transition-[width] duration-300"
                        style={{ width: `${progress}%` }}
                    />
                </div>

                <div className="flex shrink-0 items-center gap-3">
                    <CarouselPrevious className="static size-10" />
                    <CarouselNext className="static size-10" />
                </div>
            </div>
        </Carousel>
    )
}
