import Image from "next/image"
import Link from "next/link"
import { ArrowUpRightIcon, CalendarDaysIcon, MapPinIcon, StarIcon } from "lucide-react"
import { IDestination } from "@/lib/type"

// TODO(routes): replace "#" with the booking page route.
const BOOK_NOW_HREF = "#"

const DestinationCard = ({ destination }: { destination: IDestination }) => {
    // API doesn't send a rating yet — show the design's 4.5 until it does.
    const rating = destination.rating ?? 4.5;

    return (
        <article className="group overflow-hidden rounded-xl border border-border/70 bg-background shadow-sm transition-shadow hover:shadow-md">
            <div className="relative aspect-[2/1]">
                <Image
                    src={destination.imageUrl}
                    alt={destination.destinationName}
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover"
                />
                <span className="absolute top-3 right-3 flex items-center gap-1 rounded-md bg-background/95 px-2 py-1 text-xs font-medium text-foreground shadow-sm">
                    {rating}
                    <StarIcon className="size-3 fill-current" />
                </span>
            </div>

            <div className="p-4">
                <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <MapPinIcon className="size-3.5" />
                    {destination.country}
                </p>

                <div className="mt-2 flex items-baseline justify-between gap-2">
                    <h3 className="text-lg font-semibold text-foreground">
                        {destination.destinationName}
                    </h3>
                    <p className="shrink-0">
                        <span className="text-lg font-semibold text-foreground">
                            ${destination.price}
                        </span>
                        <span className="text-xs text-muted-foreground">/Person</span>
                    </p>
                </div>

                <p className="mt-2 flex items-center gap-1.5 text-sm text-muted-foreground">
                    <CalendarDaysIcon className="size-3.5" />
                    {destination.duration}
                </p>

                <Link
                    href={BOOK_NOW_HREF}
                    className="mt-4 inline-flex items-center gap-1 text-xs font-semibold tracking-wide text-brand uppercase hover:underline"
                >
                    Book Now
                    <ArrowUpRightIcon className="size-3.5" />
                </Link>
            </div>
        </article>
    );
};

export default DestinationCard;
