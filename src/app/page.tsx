import { Banner } from "@/components/home/banner"
import { Cta } from "@/components/home/cta"
import FeaturedDestinations from "@/components/home/FeaturedDestinations"
import { Testimonials } from "@/components/home/testimonials"
import { WhyChooseUs } from "@/components/home/why-choose-us"

export default function Home() {
  return (
    <>
      <Banner />
      <FeaturedDestinations />
      <WhyChooseUs />
      <Testimonials />
      <Cta />
    </>
  )
}
