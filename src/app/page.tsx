import { Banner } from "@/components/banner"
import { Cta } from "@/components/cta"
import { Navbar } from "@/components/navbar"
import { Testimonials } from "@/components/testimonials"
import { WhyChooseUs } from "@/components/why-choose-us"

export default function Home() {
  return (
    <>
      <Navbar />
      <Banner />
      <WhyChooseUs />
      <Testimonials />
      <Cta />
    </>
  )
}
