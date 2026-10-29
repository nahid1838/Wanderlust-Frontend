"use client";

import { useState } from "react";
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
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button";
import { Trash2Icon } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { getTokenFromClient } from "@/lib/getTokenFromClient";


const DeleteDestinationDialog = ({ id }: { id: string }) => {
    const router = useRouter();
    // Controlled so the confirm button closes the dialog only AFTER the
    // DELETE succeeds (AlertDialogAction alone doesn't close it, and the
    // old DialogClose wrapper was an invalid nested <button>).
    const [open, setOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDeleteDestination = async () => {
        if (isDeleting) return; // guard against double click
        setIsDeleting(true);

        const token = await getTokenFromClient();
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/destination/${id}`, {
                method: "DELETE",
                headers: {
                    authorization: `Bearer ${token}`
                }
            });
            if (!res.ok) throw new Error(`Delete failed with status ${res.status}`);

            toast.success("Destination deleted successfully!");
            router.refresh(); // re-render server data after deletion
            setOpen(false);
            router.push("/all-destinations");   // close only after success
        } catch (error) {
            console.error("Failed to delete destination:", error);
            // stay open so the user can retry
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            {/* render → our Button replaces the default <button> trigger (no nesting) */}
            <AlertDialogTrigger
                render={
                    <Button
                        type="button"
                        variant="outline"
                        className="h-10 gap-1 border-red-400 px-4 text-red-500 hover:bg-red-100 hover:text-red-500"
                    />
                }
            >
                <Trash2Icon />
                <span className="font-semibold">Delete</span>
            </AlertDialogTrigger>

            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete this destination
                        from our servers.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={handleDeleteDestination}
                        disabled={isDeleting}
                        className="bg-destructive text-white hover:bg-destructive/90"
                    >
                        {isDeleting ? "Deleting..." : "Continue"}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default DeleteDestinationDialog;
