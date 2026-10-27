"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { authClient } from "@/lib/auth-client";
import { IDestination } from "@/lib/type";
import {ArrowRightIcon, CheckIcon} from "lucide-react"


const BOOKING_INCLUDES: string[] = [
  "Free consultation up to 7 days",
  "Travel insurance included",
  "24/7 customer support",
]

const BookingCard = ({data}: {data: IDestination}) => {

    const {data: session} = authClient.useSession();
    const user = session?.user;

    const handleOnSubmit = async (e) => {
        e.preventDefault();

        const departureDate = e.currentTarget.departureDate.value;

        const bookingData = {
            userName: user?.name,
            userEmail: user?.email,
            userImage: user?.image,
            ...data,
            departureDate: departureDate,
            bookingDate: new Date()
        }
        
        const res = await fetch("http://localhost:5000/booking", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(bookingData)
        });
        const bookingRes = res.json();
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
            aria-label="Departure date"
            className="mt-4 h-11 rounded-md border-border/60 bg-muted px-4 text-sm text-foreground focus-visible:border-brand focus-visible:ring-brand/30"
          />

          <Button
            type="submit"
            className="mt-4 h-11 w-full bg-brand text-white hover:bg-brand/90"
          >
            Book Now
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