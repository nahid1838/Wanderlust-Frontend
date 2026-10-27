import Image from "next/image";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { Suspense } from "react";
import { headers } from "next/headers";
import {
  ArrowLeftIcon,
  CalendarDaysIcon,
  CircleCheckIcon,
  ClockIcon,
  MapPinIcon,
  TagIcon,
} from "lucide-react";
import { auth } from "@/lib/auth";
import { IBooking } from "@/lib/type";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

/** `2026-11-25` → date-only parse; full ISO timestamps parse as-is. */
function parseDate(value: string): Date {
  return new Date(value.length > 10 ? value : `${value}T00:00:00`);
}

function formatDate(value: string): string {
  const date = parseDate(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

/** Session + fetch are request-time reads — must sit behind <Suspense>
 *  (Cache Components: uncached reads outside a boundary fail the build). */
async function findBooking(id: string): Promise<IBooking | null> {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const email = session?.user?.email;
  if (!email) redirect("/login");

  try {
    const res = await fetch(
      `http://localhost:5000/my-bookings/${encodeURIComponent(email)}`
    );
    if (!res.ok) return null;
    const data: unknown = await res.json();
    if (!Array.isArray(data)) return null;
    return (data as IBooking[]).find((booking) => booking._id === id) ?? null;
  } catch (error) {
    console.warn("Failed to load booking:", error);
    return null;
  }
}

async function BookingDetail({ id }: { id: string }) {
  const booking = await findBooking(id);
  if (!booking) notFound();

  const {
    destinationName,
    country,
    category,
    price,
    duration,
    departureDate,
    imageUrl,
    description,
    bookingDate,
    _id,
  } = booking;

  const details: { icon: typeof MapPinIcon; label: string; value: string }[] = [
    { icon: MapPinIcon, label: "Destination", value: `${destinationName}, ${country}` },
    { icon: CalendarDaysIcon, label: "Departure", value: formatDate(departureDate) },
    { icon: ClockIcon, label: "Duration", value: duration },
    ...(category ? [{ icon: TagIcon, label: "Category", value: category }] : []),
    { icon: CalendarDaysIcon, label: "Booked on", value: formatDate(bookingDate) },
  ];

  return (
    <article>
      {/* Status */}
      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        <Badge className="gap-1 rounded-full border border-green-100 bg-green-50 px-2.5 py-1 text-xs font-medium text-green-600 hover:bg-green-50">
          <CircleCheckIcon className="size-3.5" />
          Confirmed
        </Badge>
        <span className="text-xs text-muted-foreground">Booking ID: {_id.slice(-6)}</span>
      </div>

      {/* Hero image */}
      <div className="relative mt-4 aspect-[16/9] overflow-hidden rounded-lg">
        <Image
          src={imageUrl}
          alt={destinationName}
          fill
          priority
          sizes="(min-width: 1024px) 1024px, 100vw"
          className="object-cover"
        />
      </div>

      {/* Title + price */}
      <div className="mt-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <MapPinIcon className="size-4" />
            {country}
          </p>
          <h1 className="mt-2 text-3xl font-medium text-foreground sm:text-4xl">
            {destinationName}
          </h1>
        </div>
        <p className="text-2xl font-semibold text-brand">
          ${Number(price).toLocaleString("en-US")}
          <span className="ml-1 text-xs font-normal text-muted-foreground">
            per person
          </span>
        </p>
      </div>

      {/* Details grid */}
      <dl className="mt-8 grid gap-4 border-y border-border py-6 sm:grid-cols-2 lg:grid-cols-3">
        {details.map(({ icon: Icon, label, value }) => (
          <div key={label} className="flex items-start gap-2.5">
            <Icon className="mt-0.5 size-4 shrink-0 text-brand" />
            <div>
              <dt className="text-xs text-muted-foreground">{label}</dt>
              <dd className="text-sm font-medium text-foreground">{value}</dd>
            </div>
          </div>
        ))}
      </dl>

      {/* Description */}
      <section className="mt-6">
        <h2 className="text-lg font-semibold text-foreground sm:text-xl">
          Overview
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          {description}
        </p>
      </section>

      {/* Back link */}
      <Link
        href="/my-bookings"
        className="mt-8 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeftIcon className="size-4" />
        Back to My Bookings
      </Link>
    </article>
  );
}

function BookingDetailSkeleton() {
  return (
    <div className="mt-6">
      <Skeleton className="h-6 w-40 rounded-full" />
      <Skeleton className="mt-4 aspect-[16/9] w-full rounded-lg" />
      <Skeleton className="mt-6 h-8 w-2/3" />
      <div className="mt-8 grid gap-4 border-y border-border py-6 sm:grid-cols-2 lg:grid-cols-3">
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <Skeleton key={i} className="h-10 w-full" />
        ))}
      </div>
      <Skeleton className="mt-6 h-4 w-full" />
      <Skeleton className="mt-2 h-4 w-5/6" />
    </div>
  );
}

const BookingDetailPage = ({
  params,
}: PageProps<"/my-bookings/[id]">) => {
  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-10">
      <Link
        href="/my-bookings"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeftIcon className="size-4" />
        Back to My Bookings
      </Link>

      <Suspense fallback={<BookingDetailSkeleton />}>
        <BookingDetailParams params={params} />
      </Suspense>
    </main>
  );
};

async function BookingDetailParams({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <BookingDetail id={id} />;
}

export default BookingDetailPage;
