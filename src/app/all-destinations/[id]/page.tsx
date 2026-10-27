import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import {
  ArrowLeftIcon,
  CalendarDaysIcon,
  CheckIcon,
  MapPinIcon,
  StarIcon,
} from "lucide-react"

import { IDestination } from "@/lib/type"
import EditDestinationDialog from "@/components/destination/EditDestinationDialog"
import DeleteDestinationDialog from "@/components/destination/DeleteDestinationDialog"
import BookingCard from "@/components/booking/BookingCard"

/** Shown while the API doesn't provide `highlights` (mockup copy). */
const HIGHLIGHTS_FALLBACK: string[] = [
  "Luxury beachfront resorts",
  "Visit Uluwatu Temple at sunset",
  "Traditional Balinese spa treatment",
  "Private beach dinner experience",
  "Sunrise trek to Mount Batur",
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
          <EditDestinationDialog destination={data}/>
          <DeleteDestinationDialog id={id} />
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
            </div><p></p>
          </section>
        </div>

        {/* Booking card */}
        <BookingCard data={data} />
      </div>
    </main>
  );
};

export default DestinationDetailsPage;
