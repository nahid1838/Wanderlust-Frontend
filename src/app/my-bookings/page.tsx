import MyBookingCard from "@/components/booking/MyBookingCard";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

interface Booking {
  _id: string;
  userName: string;
  userEmail: string;
  destinationName: string;
  country: string;
  category?: string;
  price: number | string;
  duration: string;
  departureDate: string;
  imageUrl: string;
  description: string;
  bookingDate: string;
}

const MyBookingPage = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const user = session?.user;

  const res = await fetch(
    `http://localhost:5000/my-bookings/${user?.email}`
  );

  const bookings: Booking[] = await res.json();

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
        <div className="space-y-2">
          {bookings.length > 0 ? (
            bookings.map((booking) => (
              <MyBookingCard
                key={booking._id}
                booking={booking}
              />
            ))
          ) : (
            <div className="flex flex-col items-center justify-center rounded-md border border-neutral-200 px-6 py-16 text-center">
              <h2 className="text-lg font-semibold text-neutral-800">
                No bookings found
              </h2>

              <p className="mt-2 text-sm text-neutral-500">
                Your upcoming travel plans will appear here.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyBookingPage;