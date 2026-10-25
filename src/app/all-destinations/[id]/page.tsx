import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { cn } from "cn"
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  CalendarDaysIcon,
  CheckIcon,
  MapPinIcon,
  PencilIcon,
  StarIcon,
  Trash2Icon,
} from "lucide-react"
import { Button, buttonVariants } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { IDestination } from "@/lib/type"

/** Shown while the API doesn't provide `highlights` (mockup copy). */
const HIGHLIGHTS_FALLBACK: string[] = [
  "Luxury beachfront resorts",
  "Visit Uluwatu Temple at sunset",
  "Traditional Balinese spa treatment",
  "Private beach dinner experience",
  "Sunrise trek to Mount Batur",
]

const BOOKING_INCLUDES: string[] = [
  "Free consultation up to 7 days",
  "Travel insurance included",
  "24/7 customer support",
]

const DestinationDetailsPage = async ({
  params,
}: PageProps<"/all-destinations/[id]">) => {
  const { id } = await params;

  const res = await fetch(`http://localhost:5000/destination/${id}`);
  if (!res.ok) notFound();
  const data: IDestination = await res.json();

  const rating = data.rating ?? 4.9;
  const reviews = data.reviews ?? 234;
  const highlights = data.highlights ?? HIGHLIGHTS_FALLBACK;

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-10">
      {/* Top bar: back link + actions */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Link
          href="/all-destinations"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeftIcon className="size-4" />
          Back to Destinations
        </Link>
        <div className="flex items-center gap-3">
          {/* TODO: route to the edit page once it exists */}
          <Button
            type="button"
            variant="outline"
            className="h-10 px-4 text-foreground"
          >
            <PencilIcon />
            Edit
          </Button>
          <Link
            href="/all-destinations"
            className={cn(
              buttonVariants({ variant: "outline" }),
              "h-10 border-destructive px-4 text-destructive hover:bg-destructive/10 hover:text-destructive"
            )}
          >
            <Trash2Icon />
            Cancel
          </Link>
        </div>
      </div>

      {/* Hero image */}
      <div className="relative mt-6 aspect-[16/9] overflow-hidden rounded-lg">
        <Image
          src={data.imageUrl}
          alt={data.destinationName}
          fill
          priority
          sizes="(min-width: 1024px) 1024px, 100vw"
          className="object-cover"
        />
      </div>

      {/* Content + booking card */}
      <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div>
          <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <MapPinIcon className="size-4" />
            {data.country}
          </p>
          <h1 className="mt-2 text-4xl font-medium text-foreground sm:text-5xl">
            {data.destinationName}
          </h1>

          <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
            <span className="flex items-center gap-1.5">
              <StarIcon className="size-4 fill-green-500 text-green-500" />
              <span className="font-semibold text-foreground">{rating}</span>
              <span className="text-muted-foreground">({reviews} reviews)</span>
            </span>
            <span className="flex items-center gap-1.5 text-muted-foreground">
              <CalendarDaysIcon className="size-4" />
              {data.duration}
            </span>
          </div>

          <section className="mt-8">
            <h2 className="text-lg font-semibold text-foreground sm:text-xl">
              Overview
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {data.description}
            </p>
          </section>

          <section className="mt-6">
            <h2 className="text-lg font-semibold text-foreground sm:text-xl">
              Highlights
            </h2>
            <div className="mt-3 grid gap-x-6 gap-y-3 sm:grid-cols-2">
              {highlights.map((highlight) => (
                <p
                  key={highlight}
                  className="flex items-start gap-2 text-sm text-foreground/90"
                >
                  <CheckIcon className="mt-0.5 size-4 shrink-0 text-green-500" />
                  {highlight}
                </p>
              ))}
            </div>
          </section>
        </div>

        {/* Booking card */}
        <aside className="h-fit rounded-xl border border-border/70 bg-background p-5 shadow-sm">
          <p className="text-xs text-muted-foreground">Starting from</p>
          <p className="mt-1 text-3xl font-bold text-brand sm:text-4xl">
            ${data.price}
          </p>
          <p className="text-xs text-muted-foreground">per person</p>

          <Input
            type="date"
            defaultValue={data.departureDate}
            aria-label="Departure date"
            className="mt-4 h-11 rounded-md border-border/60 bg-muted px-4 text-sm text-foreground focus-visible:border-brand focus-visible:ring-brand/30"
          />

          <Button
            type="button"
            className="mt-4 h-11 w-full bg-brand text-white hover:bg-brand/90"
          >
            Book Now
            <ArrowRightIcon />
          </Button>

          <div className="mt-5 space-y-2.5 border-t border-border pt-4">
            {BOOKING_INCLUDES.map((item) => (
              <p
                key={item}
                className="flex items-center gap-2 text-xs text-muted-foreground"
              >
                <CheckIcon className="size-3.5 shrink-0 text-green-500" />
                {item}
              </p>
            ))}
          </div>
        </aside>
      </div>
    </main>
  );
};

export default DestinationDetailsPage;
