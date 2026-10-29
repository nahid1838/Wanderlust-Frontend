"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { authClient } from "@/lib/auth-client"
import { IDestination } from "@/lib/type"
import { ArrowRightIcon, CheckIcon } from "lucide-react"
import { toast } from "sonner"


const BOOKING_INCLUDES: string[] = [
  "Free consultation up to 7 days",
  "Travel insurance included",
  "24/7 customer support",
]

const BookingCard = ({ data }: { data: IDestination }) => {
    const router = useRouter()
    const { data: session, isPending } = authClient.useSession()
    const user = session?.user
    const [isBooking, setIsBooking] = useState(false)

    const handleOnSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (isBooking || isPending) return;

        // Never create a booking without an account attached — bookings
        // saved without userEmail are invisible on /my-bookings.
        if (!user) {
            toast.error("Please sign in to book this trip");
            router.push("/login");
            return;
        }

        const formData = new FormData(e.currentTarget);
        const departureDate = String(formData.get("departureDate") ?? "");
        if (!departureDate) {
            toast.error("Please choose a departure date");
            return;
        }

        // Explicit payload — never send the destination's `_id` (it used to
        // be spread in, which caused a duplicate-key 500 when re-booking).
        const bookingData = {
            userName: user.name,
            userEmail: user.email,
            userImage: user.image ?? "",
            destinationName: data.destinationName,
            country: data.country,
            category: data.category,
            price: data.price,
            duration: data.duration,
            departureDate,
            imageUrl: data.imageUrl,
            description: data.description,
            bookingDate: new Date().toISOString(),
        };

        setIsBooking(true);
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/booking`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(bookingData)
            });

            if (!res.ok) {
                const body = (await res.json().catch(() => null)) as
                    | { message?: string }
                    | null;
                throw new Error(body?.message ?? `Booking failed (${res.status})`);
            }

            toast.success("Booking confirmed!", {
                description: `${data.destinationName} — view it under My Bookings.`,
            });
            router.push("/my-bookings");
        } catch (error) {
            console.error("Booking error:", error);
            toast.error(
                error instanceof Error ? error.message : "Booking failed. Please try again."
            );
        } finally {
            setIsBooking(false);
        }
    }

    return (
        <div>
            <aside className="h-fit rounded-xl border border-border/70 bg-background p-5 shadow-sm">
          <p className="text-xs text-muted-foreground">Starting from</p>
          <p className="mt-1 text-3xl font-bold text-brand sm:text-4xl">
            ${data.price}
          </p>
          <p className="text-xs text-muted-foreground">per person</p>

        <form onSubmit={handleOnSubmit}>
          <Input
            type="date"
            name="departureDate"
            defaultValue={data.departureDate}
            required
            aria-label="Departure date"
            className="mt-4 h-11 rounded-md border-border/60 bg-muted px-4 text-sm text-foreground focus-visible:border-brand focus-visible:ring-brand/30"
          />

          <Button
            type="submit"
            disabled={isBooking || isPending}
            className="mt-4 h-11 w-full bg-brand text-white hover:bg-brand/90"
          >
            {isBooking ? "Booking..." : "Book Now"}
            <ArrowRightIcon />
          </Button>
          </form>

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
    );
};

export default BookingCard;
