import Image from "next/image"

/**
 * "Why Choose Wanderlust" value-props section. Content/icons are
 * presentational — edit the array below to change the cards.
 */
const FEATURES: { icon: string; title: string; description: string }[] = [
  {
    icon: "/assets/ShieldCheck.png",
    title: "Safe & Secure",
    description:
      "Your safety is our priority with comprehensive travel insurance and 24/7 support.",
  },
  {
    icon: "/assets/MapTrifold.png",
    title: "Expert Guides",
    description:
      "Local experts who bring destinations to life with authentic cultural insights.",
  },
  {
    icon: "/assets/Headset.png",
    title: "24/7 Support",
    description:
      "Round-the-clock customer service to assist you wherever your journey takes you.",
  },
]

export function WhyChooseUs() {
  return (
    <section className="bg-brand/10 px-4 py-16 md:py-24">
      <div className="mx-auto max-w-6xl">
        <div className="text-center">
          <h2 className="text-4xl font-medium text-foreground sm:text-5xl">
            Why Choose Wanderlust
          </h2>
          <p className="mt-3 text-sm text-muted-foreground sm:text-base">
            Your trusted partner for exceptional travel experiences
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {FEATURES.map((feature) => (
            <div
              key={feature.title}
              className="rounded-lg border border-border/70 bg-background p-6 shadow-sm md:p-8"
            >
              <Image
                src={feature.icon}
                alt=""
                width={32}
                height={32}
                className="size-8"
              />
              <h3 className="mt-5 text-xl font-medium text-foreground sm:text-2xl">
                {feature.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
