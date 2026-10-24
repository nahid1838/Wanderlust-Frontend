import type { Metadata } from "next"
import { TravelPackageForm } from "@/components/travel-package-form"

export const metadata: Metadata = {
  title: "Add New Travel Package | Wanderlast",
}

export default function AddNewTravelPage() {
  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-12 md:py-16">
      <h1 className="text-4xl font-medium text-foreground sm:text-5xl">
        Add New Travel Package
      </h1>
      <div className="mt-10">
        <TravelPackageForm />
      </div>
    </main>
  )
}
