"use client"

import { useState } from "react"
import { cn } from "cn"
import { PackageIcon, Trash2Icon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useRouter } from "next/navigation"
import { CATEGORIES } from "@/lib/constant"
import { toast } from "sonner"

/** Shared field look: filled light-gray inputs matching the mockup. */
const fieldClassName =
  "h-11 rounded-md border-border/60 bg-muted px-4 text-sm placeholder:text-muted-foreground/70 focus-visible:border-brand focus-visible:ring-brand/30"

const labelClassName = "block text-sm font-medium text-foreground"

export function TravelPackageForm() {

  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async(event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmitting) return;

    const formData = new FormData(event.currentTarget);
    const data = Object.fromEntries(formData.entries());

    const isEmpty = Object.values(data).some(
    (value) => typeof value === "string" && value.trim() === ""
  );

  if (isEmpty) {
    toast.error("Please fill in all the fields!");
    return;
  }

    setIsSubmitting(true);
    try {
      const res = await fetch("http://localhost:5000/add-destination", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data)
      });
      if (!res.ok) throw new Error(`Request failed with status ${res.status}`);

      toast.success("Travel package added successfully!");
      router.push("/all-destinations"); // navigate only AFTER the save succeeds
    } catch (error) {
      console.error("Failed to add destination:", error);
      toast.error("Could not add the travel package. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}
      className="rounded-xl border border-border/70 bg-background p-6 shadow-sm sm:p-10"
    >
      <div className="space-y-5">
        <div className="space-y-2">
          <label htmlFor="destinationName" className={labelClassName}>
            Destination Name
          </label>
          <Input
            id="destinationName"
            name="destinationName"
            placeholder="Bali Paradise"
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
              placeholder="Indonesia"
              className={fieldClassName}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="category" className={labelClassName}>
              Category
            </label>
            {/* `name` so the selected category is included in FormData */}
            <Select name="category" defaultValue="beach">
              <SelectTrigger
                id="category"
                className={cn(fieldClassName, "w-full")}
              >
                <SelectValue placeholder="Select category" />
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
              placeholder="e.g., 1299"
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
              placeholder="e.g., 7 Days/6 Nights"
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
            placeholder="https://example.com/image.jpg"
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
            placeholder="Describe the travel experience..."
            className={cn(fieldClassName, "min-h-32 py-3")}
          />
        </div>
      </div>

      <div className="mt-8 flex flex-wrap justify-end gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          className="h-11 border-destructive bg-background px-5 text-destructive hover:bg-destructive/10 hover:text-destructive"
        >
          <Trash2Icon />
          Cancel
        </Button>


        <Button
          type="submit"
          disabled={isSubmitting}
          className="h-11 bg-brand px-5 text-white hover:bg-brand/90"
        >
          <PackageIcon />
          {isSubmitting ? "Adding..." : "Add Travel Package"}
        </Button>
      </div>
    </form>
  )
}
