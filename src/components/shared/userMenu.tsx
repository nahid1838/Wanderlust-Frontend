"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { LogOutIcon, UserIcon } from "lucide-react"
import { toast } from "sonner"
import { authClient } from "@/lib/auth-client"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

type UserMenuProps = {
  user: {
    name?: string | null
    email?: string | null
    image?: string | null
  }
}

export function UserMenu({ user }: UserMenuProps) {
  const router = useRouter()

  // Naam-er prothom akkhor (capital), naam na thakle email-er prothom akkhor
  const initial = (user.name || user.email || "U").charAt(0).toUpperCase()

  const handleSignOut = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          toast.success("Signed out successfully")
          router.push("/login")
          router.refresh()
        },
      },
    })
  }

  return (
    <DropdownMenu>
      {/* CHANGED: asChild-er bodole render prop */}
      <DropdownMenuTrigger
        aria-label="Open user menu"
        render={
          <button className="rounded-full outline-none ring-offset-background transition hover:opacity-90 focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2" />
        }
      >
        <Avatar className="size-9 border-2 border-brand/30 sm:size-10">
          {/* Google image thakle eta dekhabe */}
          {user.image && (
            <AvatarImage
              src={user.image}
              alt={user.name ?? "User"}
              referrerPolicy="no-referrer"
            />
          )}
          {/* Image na thakle naam-er prothom akkhor dekhabe */}
          <AvatarFallback className="bg-brand text-sm font-semibold text-white">
            {initial}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-56">
        {/* CHANGED: Label ke Group-er vitore rakha hoyeche */}
        <DropdownMenuGroup>
          <DropdownMenuLabel className="font-normal">
            <p className="truncate text-sm font-semibold text-foreground">
              {user.name}
            </p>
            <p className="truncate text-xs text-muted-foreground">
              {user.email}
            </p>
          </DropdownMenuLabel>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        {/* CHANGED: asChild-er bodole render prop */}
        <DropdownMenuItem
          render={<Link href="#" />}
          className="cursor-pointer"
        >
          <UserIcon className="size-4" />
          Profile
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={handleSignOut}
          className="cursor-pointer text-red-600 focus:bg-red-50 focus:text-red-600"
        >
          <LogOutIcon className="size-4" />
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}