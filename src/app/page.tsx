import { Banner } from "@/components/banner"
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
    </>
  )
}
