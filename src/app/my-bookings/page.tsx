import { Suspense } from "react";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import MyBookingCard from "@/components/booking/MyBookingCard";
import { Skeleton } from "@/components/ui/skeleton";
import { IBooking } from "@/lib/type";

async function getBookings(email: string): Promise<IBooking[]> {
  try {
    const res = await fetch(
      `http://localhost:5000/my-bookings/${encodeURIComponent(email)}`
    );
    if (!res.ok) throw new Error(`API responded with ${res.status}`);
    const data: unknown = await res.json();
    if (!Array.isArray(data)) throw new Error("API did not return an array");
    return data as IBooking[];
  } catch (error) {
    console.warn("Bookings API unreachable, showing empty list:", error);
    return [];
  }
}

/** Reads session + bookings — request-time reads must sit behind <Suspense>
 *  (Cache Components: uncached reads outside a boundary fail the build). */
async function BookingsSection() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const email = session?.user?.email;
  if (!email) redirect("/login");

  const bookings = await getBookings(email);

  if (bookings.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-md border border-neutral-200 px-6 py-16 text-center">
        <h2 className="text-lg font-semibold text-neutral-800">
          No bookings found
        </h2>

        <p className="mt-2 text-sm text-neutral-500">
          Your upcoming travel plans will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {bookings.map((booking) => (
        <MyBookingCard key={booking._id} booking={booking} />
      ))}
    </div>
  );
}

/** Layout-matching placeholder while the session + bookings stream in. */
function BookingsSkeleton() {
  return (
    <div className="space-y-2">
      {[0, 1, 2].map((i) => (
        <Skeleton key={i} className="h-44 w-full rounded-none" />
      ))}
    </div>
  );
}

const MyBookingPage = () => {
  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-5xl px-5 py-10 sm:px-8 sm:py-12">
        {/* Page Heading */}
        <div className="mb-6">
          <h1 className="font-serif text-3xl font-normal tracking-tight text-neutral-900 sm:text-4xl">
            My Bookings
          </h1>

          <p className="mt-2 text-sm text-neutral-500">
            Manage and view your upcoming travel plans
          </p>
        </div>

        {/* Booking List */}
        <Suspense fallback={<BookingsSkeleton />}>
          <BookingsSection />
        </Suspense>
      </div>
    </div>
  );
};

export default MyBookingPage;
