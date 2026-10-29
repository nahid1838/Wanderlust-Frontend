"use client";

import Image from "next/image";
import { useState } from "react";
import { CalendarDays, MapPin, Eye, Trash2, CircleCheck } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { IBooking } from "@/lib/type";

interface MyBookingCardProps {
    booking: IBooking;
}

const MyBookingCard = ({ booking }: MyBookingCardProps) => {

    const router = useRouter();
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [isCancelling, setIsCancelling] = useState(false);

    const {
        _id,
        destinationName,
        country,
        price,
        departureDate,
        imageUrl,
    } = booking;

    const handleCancelBooking = async () => {
        if (isCancelling) return; // guard against double click
        setIsCancelling(true);
        try {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/my-bookings/${_id}`,
                {
                    method: "DELETE",
                }
            );

            if (!res.ok) {
                const body = (await res.json().catch(() => null)) as
                    | { message?: string }
                    | null;
                throw new Error(body?.message ?? `Cancel failed (${res.status})`);
            }

            toast.success("Booking cancelled");
            setConfirmOpen(false);
            router.refresh();
        } catch (error) {
            console.error("Cancel Booking Error:", error);
            toast.error(
                error instanceof Error ? error.message : "Failed to cancel booking"
            );
            // dialog stays open so the user can retry
        } finally {
            setIsCancelling(false);
        }
    };

    return (
        <Card className="overflow-hidden rounded-none border border-neutral-200 bg-white py-0 shadow-none">
            <CardContent className="flex flex-col gap-4 p-3 sm:flex-row sm:items-center sm:gap-3">
                {/* Destination Image */}
                <div className="relative h-44 w-full shrink-0 overflow-hidden sm:h-34 sm:w-[31%]">
                    <Image
                        src={imageUrl}
                        alt={destinationName}
                        fill
                        sizes="(max-width: 640px) 100vw, 300px"
                        className="object-cover"
                    />
                </div>

                {/* Booking Information */}
                <div className="min-w-0 flex-1">
                    {/* Status */}
                    <Badge className="mb-1.5 gap-1 rounded-full border border-green-100 bg-green-50 px-2 py-0.5 text-[10px] font-medium text-green-600 hover:bg-green-50">
                        <CircleCheck className="size-3" />
                        Confirmed
                    </Badge>

                    {/* Destination */}
                    <h2 className="truncate text-base font-semibold leading-tight tracking-tight text-neutral-900">
                        {destinationName}
                    </h2>

                    {/* Country */}
                    <p className="mt-0.5 truncate text-[10px] text-neutral-500">
                        {country}
                    </p>

                    {/* Departure Date */}
                    <div className="mt-2 flex items-center gap-1.5 text-[10px] text-neutral-500">
                        <CalendarDays className="size-3 shrink-0" />

                        <span>
                            Departure:{" "}
                            {new Date(`${departureDate}T00:00:00`).toLocaleDateString(
                                "en-US",
                                {
                                    month: "short",
                                    day: "numeric",
                                    year: "numeric",
                                }
                            )}
                        </span>
                    </div>

                    {/* Booking ID */}
                    <div className="mt-1 flex items-center gap-1.5 text-[10px] text-neutral-500">
                        <MapPin className="size-3 shrink-0" />

                        <span>Booking ID: {_id.slice(-6)}</span>
                    </div>

                    {/* Price */}
                    <p className="mt-1 text-xl font-medium leading-tight text-sky-500">
                        ${Number(price).toLocaleString("en-US")}
                    </p>
                </div>

                {/* Action Buttons */}
                <div className="flex shrink-0 items-center justify-end gap-1.5 sm:self-end">
                    {/* Confirm before destroying — one misclick used to delete permanently */}
                    <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
                        <AlertDialogTrigger
                            render={
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="h-7 rounded-none border-red-200 px-2.5 text-[10px] font-normal text-red-500 hover:bg-red-50 hover:text-red-600"
                                />
                            }
                        >
                            <Trash2 className="size-3" />
                            Cancel
                        </AlertDialogTrigger>

                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Cancel this booking?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This will permanently cancel your booking for{" "}
                                    {destinationName}. This action cannot be undone.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Keep Booking</AlertDialogCancel>
                                <AlertDialogAction
                                    onClick={handleCancelBooking}
                                    disabled={isCancelling}
                                    className="bg-destructive text-white hover:bg-destructive/90"
                                >
                                    {isCancelling ? "Cancelling..." : "Yes, Cancel Booking"}
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>

                    <Button
                        className="h-7 rounded-none bg-cyan-600 px-2.5 text-[10px] font-normal text-white hover:bg-cyan-700"
                        onClick={() => router.push(`/my-bookings/${_id}`)}
                    >
                        <Eye className="size-3" />
                        View
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
};

export default MyBookingCard;
