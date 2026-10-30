"use client"

import * as React from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { authClient } from "@/lib/auth-client"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"

type EditProfileDialogProps = {
  user: {
    name?: string | null
    image?: string | null
  }
  /** Replaces the trigger element — the round camera badge on the avatar,
   *  or the full-width "Edit Profile" button (both open this same dialog). */
  trigger: React.ReactElement
}

/**
 * Better-auth stores `name` and `image` on the user record natively, so no
 * backend route is needed — `authClient.updateUser` handles it. On success
 * `router.refresh()` re-renders the server components with the new session.
 */
const EditProfileDialog = ({ user, trigger }: EditProfileDialogProps) => {
  const router = useRouter()
  // Controlled so the dialog closes only AFTER a successful update.
  const [open, setOpen] = React.useState(false)
  const [isSaving, setIsSaving] = React.useState(false)
  // Live preview of the photo while typing the URL.
  const [preview, setPreview] = React.useState<string | null>(user.image ?? null)

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (isSaving) return

    const formData = new FormData(event.currentTarget)
    const name = String(formData.get("name") ?? "").trim()
    const image = String(formData.get("image") ?? "").trim()

    if (!name) {
      toast.error("Name cannot be empty")
      return
    }

    setIsSaving(true)
    try {
      const { error } = await authClient.updateUser({ name, image })
      if (error) {
        throw new Error(error.message ?? "Update failed")
      }

      toast.success("Profile updated!")
      router.refresh() // re-render server data (name + avatar in navbar too)
      setOpen(false)
    } catch (error) {
      console.error("Failed to update profile:", error)
      toast.error(
        error instanceof Error ? error.message : "Could not update your profile"
      )
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={trigger} />

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
          <DialogDescription>
            Update your display name and profile photo.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Live photo preview */}
          <div className="relative mx-auto size-20 overflow-hidden rounded-full bg-muted">
            {preview ? (
              <Image
                src={preview}
                alt="Profile preview"
                fill
                sizes="80px"
                className="object-cover"
                onError={() => setPreview(null)}
              />
            ) : null}
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="profile-name"
              className="text-sm font-medium text-foreground"
            >
              Name
            </label>
            <Input
              id="profile-name"
              name="name"
              defaultValue={user.name ?? ""}
              required
              className="h-11 rounded-md border-border/60 bg-muted px-4 text-sm focus-visible:border-brand focus-visible:ring-brand/30"
            />
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="profile-image"
              className="text-sm font-medium text-foreground"
            >
              Photo URL
            </label>
            <Input
              id="profile-image"
              name="image"
              type="url"
              placeholder="https://example.com/photo.jpg"
              defaultValue={user.image ?? ""}
              onChange={(event) => setPreview(event.target.value || null)}
              className="h-11 rounded-md border-border/60 bg-muted px-4 text-sm focus-visible:border-brand focus-visible:ring-brand/30"
            />
          </div>

          <DialogFooter>
            <DialogClose
              render={
                <Button type="button" variant="outline" disabled={isSaving} />
              }
            >
              Cancel
            </DialogClose>
            <Button
              type="submit"
              disabled={isSaving}
              className="bg-brand text-white hover:bg-brand/90"
            >
              {isSaving ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default EditProfileDialog
