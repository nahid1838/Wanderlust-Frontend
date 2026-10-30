import { redirect } from "next/navigation"
import { Suspense } from "react"
import { headers } from "next/headers"
import {
  CameraIcon,
  DollarSignIcon,
  GlobeIcon,
  MapPinIcon,
  PencilIcon,
  PlaneIcon,
  TrendingUpIcon,
} from "lucide-react"
import { cn } from "cn"
import { auth } from "@/lib/auth"
import { getTokenFromServer } from "@/lib/getTokenFromServer"
import { IBooking } from "@/lib/type"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import EditProfileDialog from "@/components/profile/EditProfileDialog"

/** TODO: better-auth has no location/nationality fields yet — mockup copy
 *  shown as placeholder until custom user fields are added. */
const PLACEHOLDER_LOCATION = "San Francisco, CA"
const PLACEHOLDER_NATIONALITY = "United States"

async function getBookings(email: string): Promise<IBooking[]> {
  // The backend protects /my-bookings/* with verifyToken — attach the JWT.
  const token = await getTokenFromServer()

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/my-bookings/${encodeURIComponent(email)}`,
      {
        cache: "no-store",
        headers: {
          authorization: `Bearer ${token}`,
        },
      }
    );
    if (!res.ok) throw new Error(`API responded with ${res.status}`);
    const data: unknown = await res.json();
    if (!Array.isArray(data)) throw new Error("API did not return an array");
    return data as IBooking[];
  } catch (error) {
    // Stats degrade to zeros — the profile itself still renders.
    console.warn("Bookings API unreachable, stats show zeros:", error);
    return [];
  }
}

/** Session + bookings are request-time reads — kept behind <Suspense>
 *  (matches the site convention and keeps the page build-safe). */
async function ProfileSection() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const user = session?.user;
  if (!user) redirect("/login");

  const bookings = await getBookings(user.email);

  const countriesVisited = new Set(
    bookings.map((booking) => booking.country).filter(Boolean)
  ).size;
  const upcomingTrips = bookings.filter(
    (booking) => new Date(booking.departureDate) > new Date()
  ).length;
  const totalSpent = bookings.reduce(
    (sum, booking) => sum + Number(booking.price || 0),
    0
  );

  const memberSince = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
      })
    : "—";

  const stats: {
    label: string;
    value: string;
    icon: typeof PlaneIcon;
    iconClassName: string;
  }[] = [
    {
      label: "Total Bookings",
      value: String(bookings.length),
      icon: PlaneIcon,
      iconClassName: "bg-teal-100 text-teal-600",
    },
    {
      label: "Countries Visited",
      value: String(countriesVisited),
      icon: GlobeIcon,
      iconClassName: "bg-green-100 text-green-600",
    },
    {
      label: "Upcoming Trips",
      value: String(upcomingTrips),
      icon: TrendingUpIcon,
      iconClassName: "bg-orange-100 text-orange-600",
    },
    {
      label: "Total Spent",
      value: `$${totalSpent.toLocaleString("en-US")}`,
      icon: DollarSignIcon,
      iconClassName: "bg-pink-100 text-pink-600",
    },
  ];

  return (
    <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
      {/* ---------- PROFILE CARD ---------- */}
      <div className="w-full max-w-xs shrink-0 rounded-xl border border-border bg-background p-6 text-center shadow-sm">
        <div className="relative mx-auto w-fit">
          <Avatar className="size-28 border border-border">
            {user.image && (
              <AvatarImage
                src={user.image}
                alt={user.name ?? "User"}
                referrerPolicy="no-referrer"
              />
            )}
            <AvatarFallback className="bg-brand text-3xl font-semibold text-white">
              {(user.name || user.email || "U").charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>

          {/* Camera badge — opens the edit dialog */}
          <EditProfileDialog
            user={{ name: user.name, image: user.image }}
            trigger={
              <button
                type="button"
                aria-label="Edit photo"
                className="absolute right-0 bottom-0 grid size-8 place-items-center rounded-full border-2 border-background bg-brand text-white transition-colors hover:bg-brand/90"
              >
                <CameraIcon className="size-3.5" />
              </button>
            }
          />
        </div>

        <h2 className="mt-4 text-xl font-semibold text-foreground">
          {user.name}
        </h2>
        <p className="mt-1 flex items-center justify-center gap-1.5 text-sm text-muted-foreground">
          <MapPinIcon className="size-4" />
          {PLACEHOLDER_LOCATION}
        </p>

        <dl className="mt-5 space-y-2 border-t border-border pt-4 text-sm">
          <div className="flex items-center justify-between">
            <dt className="text-muted-foreground">Member since</dt>
            <dd className="font-medium text-foreground">{memberSince}</dd>
          </div>
          <div className="flex items-center justify-between">
            <dt className="text-muted-foreground">Nationality</dt>
            <dd className="font-medium text-foreground">
              {PLACEHOLDER_NATIONALITY}
            </dd>
          </div>
        </dl>

        {/* Full-width Edit Profile button — same dialog */}
        <EditProfileDialog
          user={{ name: user.name, image: user.image }}
          trigger={
            <Button className="mt-5 h-11 w-full bg-brand text-white hover:bg-brand/90">
              <PencilIcon />
              Edit Profile
            </Button>
          }
        />
      </div>

      {/* ---------- TRAVEL STATISTICS ---------- */}
      <div className="flex-1">
        <h2 className="text-lg font-semibold text-foreground">
          Travel Statistics
        </h2>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {stats.map(({ label, value, icon: Icon, iconClassName }) => (
            <div
              key={label}
              className="flex items-center justify-between rounded-lg border border-border bg-background p-5 shadow-sm"
            >
              <div>
                <p className="text-sm text-muted-foreground">{label}</p>
                <p className="mt-1 text-2xl font-semibold text-foreground">
                  {value}
                </p>
              </div>
              <span
                className={cn(
                  "grid size-9 shrink-0 place-items-center rounded-full",
                  iconClassName
                )}
              >
                <Icon className="size-4.5" />
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/** Layout-matching placeholder while the profile streams in. */
function ProfileSkeleton() {
  return (
    <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
      <div className="w-full max-w-xs shrink-0 rounded-xl border border-border bg-background p-6 text-center">
        <Skeleton className="mx-auto size-28 rounded-full" />
        <Skeleton className="mx-auto mt-4 h-6 w-32" />
        <Skeleton className="mx-auto mt-2 h-4 w-36" />
        <Skeleton className="mt-5 h-14 w-full" />
        <Skeleton className="mt-5 h-11 w-full" />
      </div>
      <div className="flex-1 space-y-4">
        <Skeleton className="h-6 w-40" />
        <div className="grid gap-4 sm:grid-cols-2">
          {[0, 1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-24 w-full" />
          ))}
        </div>
      </div>
    </div>
  );
}

const ProfilePage = () => {
  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-5xl px-5 py-10 sm:px-8 sm:py-12">
        {/* Page Heading */}
        <div className="mb-6">
          <h1 className="font-serif text-3xl font-normal tracking-tight text-neutral-900 sm:text-4xl">
            My Profile
          </h1>

          <p className="mt-2 text-sm text-neutral-500">
            Manage your account settings and travel preferences
          </p>
        </div>

        <Suspense fallback={<ProfileSkeleton />}>
          <ProfileSection />
        </Suspense>
      </div>
    </div>
  );
};

export default ProfilePage;
