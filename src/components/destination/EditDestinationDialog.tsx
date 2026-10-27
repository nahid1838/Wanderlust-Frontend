"use client";

import { useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { PackageIcon, PencilIcon, Trash2Icon } from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { CATEGORIES } from "@/lib/constant";
import { IDestination } from "@/lib/type";
import { toast } from "sonner";

const fieldClassName =
  "h-11 rounded-md border-border/60 bg-muted px-4 text-sm placeholder:text-muted-foreground/70 focus-visible:border-brand focus-visible:ring-brand/30";

const labelClassName = "block text-sm font-medium text-foreground";

const EditDestinationDialog = ({destination}: {destination: IDestination}) => {
  const router = useRouter();
  // Controlled so Save can close the dialog only AFTER a successful PATCH
  // (DialogClose on the submit button used to close it before/regardless of the request).
  const [open, setOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSaving) return; // guard against double submit

    const formData = new FormData(event.currentTarget);
    const data = Object.fromEntries(formData.entries()) as Record<string, string>;
    // FormData yields strings — price must be a number for the API.
    const payload = {
      ...data,
      price: data.price === "" ? destination.price : Number(data.price),
    };

    setIsSaving(true);
    try {
      const res = await fetch(`http://localhost:5000/destination/${destination._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(`Update failed with status ${res.status}`);

      router.refresh();
      toast.success("Destination edited successfully!"); // re-render server data AFTER the update
      setOpen(false);   // close only after success — stays open on failure
    } catch (error) {
      console.error("Failed to update destination:", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {/* `render` puts our Button in the trigger's slot — a nested
          <Button> inside the default <button> trigger is invalid HTML */}
      <DialogTrigger
        render={
          <Button
            type="button"
            variant="outline"
            className="h-10 px-4 text-foreground"
          />
        }
      >
        <PencilIcon />
        Edit
      </DialogTrigger>

      <DialogContent
        className="max-h-[90vh] w-[calc(100%-2rem)] max-w-2xl overflow-y-auto p-4 sm:max-w-2xl sm:p-6"
      >
        <DialogHeader>
          <DialogTitle>Edit Destination</DialogTitle>
          <DialogDescription>Update the destination details below.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="space-y-5">
            <div className="space-y-2">
              <label htmlFor="destinationName" className={labelClassName}>
                Destination Name
              </label>
              <Input
                id="destinationName"
                name="destinationName"
                defaultValue={destination.destinationName}
                className={fieldClassName}
              />
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-2">
                <label htmlFor="country" className={labelClassName}>
                  Country
                </label>
                <Input
                  id="country"
                  name="country"
                  defaultValue={destination.country}
                  className={fieldClassName}
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="category" className={labelClassName}>
                  Category
                </label>
                {/* Base UI Select `name` serializes the value into FormData */}
                <Select name="category" defaultValue={destination.category}>
                  <SelectTrigger id="category" className={cn(fieldClassName, "w-full")}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((category) => (
                      <SelectItem key={category.value} value={category.value}>
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-2">
                <label htmlFor="price" className={labelClassName}>
                  Price (USD)
                </label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  min={0}
                  defaultValue={destination.price}
                  className={fieldClassName}
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="duration" className={labelClassName}>
                  Duration
                </label>
                <Input
                  id="duration"
                  name="duration"
                  defaultValue={destination.duration}
                  className={fieldClassName}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="departureDate" className={labelClassName}>
                Departure Date
              </label>
              <Input
                id="departureDate"
                name="departureDate"
                type="date"
                className={fieldClassName}
                defaultValue={destination.departureDate}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="imageUrl" className={labelClassName}>
                Image URL
              </label>
              <Input
                id="imageUrl"
                name="imageUrl"
                type="url"
                defaultValue={destination.imageUrl}
                className={fieldClassName}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="description" className={labelClassName}>
                Description
              </label>
              <Textarea
                id="description"
                name="description"
                defaultValue={destination.description}
                className={cn(fieldClassName, "min-h-28 py-3")}
              />
            </div>
          </div>

          <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end sm:gap-4">
            {/* render → single real button that closes the dialog (no nesting) */}
            <DialogClose
              render={
                <Button
                  type="button"
                  variant="outline"
                  className="h-11 w-full border-destructive bg-background px-5 text-destructive hover:bg-destructive/10 hover:text-destructive sm:w-auto"
                />
              }
            >
              <Trash2Icon />
              Cancel
            </DialogClose>
            <Button
              type="submit"
              disabled={isSaving}
              className="h-11 w-full bg-brand px-5 text-white hover:bg-brand/90 sm:w-auto"
            >
              <PackageIcon />
              {isSaving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditDestinationDialog;
