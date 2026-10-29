import Image from "next/image"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

/**
 * "What Travelers Say" testimonials carousel.
 * - Add/remove entries and the arrows page through them.
 * - Entries WITH a `photo` path show the portrait on the right;
 *   entries without one show an empty placeholder slot. To fill a
 *   slot later, add `photo: "/assets/..."` to the entry — the image
 *   renders automatically (portrait slot layout is already in place).
 * - person3–6.jpg are random stock portraits — swap them for real
 *   traveler photos anytime (same filename or update the path).
 */
const TESTIMONIALS: {
  quote: string
  name: string
  location: string
  photo?: string
}[] = [
  {
    quote:
      '"The Bali Trip Was Absolutely Magical! Every Detail Was Perfectly Planned. The Resorts Were Luxurious And The Cultural Experiences Were Unforgettable."',
    name: "Michael Chen",
    location: "Singapore",
    photo: "/assets/person2.png",
  },
  {
    quote:
      '"Swiss Alps Adventure Exceeded All Expectations. The Mountain Views Were Breathtaking And Our Guide Was Incredibly Knowledgeable. Highly Recommend!"',
    name: "Sarah Johnson",
    location: "New York, USA",
    photo: "/assets/person1.png",
  },
  {
    quote:
      '"An Unforgettable Journey Through Japan! From Bustling Tokyo To Serene Kyoto, Every Moment Was Flawlessly Orchestrated And Full Of Wonder."',
    name: "Emily Rodriguez",
    location: "London, UK",
    photo: "/assets/person3.jpg",
  },
  {
    quote:
      '"The Kenyan Safari Was A Dream Come True! Witnessing The Great Migration Up Close Was Something We Will Treasure Forever."',
    name: "David Kimani",
    location: "Toronto, Canada",
    photo: "/assets/person4.jpg",
  },
  {
    quote:
      '"Our Greek Islands Cruise Was Pure Magic! Crystal-Clear Waters, Charming Villages And A Crew That Went Above And Beyond."',
    name: "Andreas Mueller",
    location: "Berlin, Germany",
    photo: "/assets/person5.jpg",
  },
  {
    quote:
      '"Paris Was Everything We Hoped For And More! The Skip-The-Line Tickets And Hand-Picked Hotels Made The Trip Effortless."',
    name: "Sophie Laurent",
    location: "Lyon, France",
    photo: "/assets/person6.jpg",
  },
]

export function Testimonials() {
  return (
    <section className="bg-background px-4 py-16 md:py-24">
      <div className="mx-auto max-w-6xl">
        <Carousel opts={{ loop: true, align: "start" }}>
          {/* Header: heading left, carousel arrows right (mockup layout) */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-4xl font-medium text-foreground sm:text-5xl">
                What Travelers Say
              </h2>
              <p className="mt-3 text-sm text-muted-foreground sm:text-base">
                Real experiences from our happy travelers
              </p>
            </div>
            <div className="flex items-center gap-3">
              {/* `static` overrides the default `absolute` positioning so the
                  controls sit in the header row instead of overlaying slides */}
              <CarouselPrevious className="static size-10" />
              <CarouselNext className="static size-10" />
            </div>
          </div>

          <CarouselContent className="-ml-4 mt-10">
            {TESTIMONIALS.map((testimonial) => (
              <CarouselItem
                key={testimonial.name}
                className="pl-4 md:basis-1/2"
              >
                <figure className="flex h-full overflow-hidden rounded-lg border border-border bg-background shadow-sm">
                  <div className="flex flex-1 flex-col p-5 sm:p-6">
                    <blockquote className="text-base leading-snug text-foreground sm:text-lg">
                      {testimonial.quote}
                    </blockquote>
                    <figcaption className="mt-auto pt-6">
                      <p className="text-sm font-medium text-brand">
                        — {testimonial.name}
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {testimonial.location}
                      </p>
                    </figcaption>
                  </div>
                  {/* Portrait slot: real image when photo is set,
                      empty placeholder space otherwise */}
                  <div className="relative w-2/5 shrink-0">
                    {testimonial.photo ? (
                      <Image
                        src={testimonial.photo}
                        alt={testimonial.name}
                        fill
                        sizes="(min-width: 768px) 40vw, 100vw"
                        className="object-cover"
                      />
                    ) : (
                      <div
                        className="absolute inset-0 bg-muted"
                        aria-hidden="true"
                      />
                    )}
                  </div>
                </figure>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
    </section>
  )
}
