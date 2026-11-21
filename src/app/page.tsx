
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import PopularCategories from "@/components/sections/PopularCategories";
import HowItWorks from "@/components/sections/HowItWorks";
import FeaturedServices from "@/components/sections/FeaturedServices";
import WhyChooseMendizo from "@/components/sections/WhyChooseMendizo";
import Testimonials from "@/components/sections/Testimonials";
import CallToAction from "@/components/sections/CallToAction";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="relative flex-1 bg-background overflow-x-hidden">
      <Navbar />
      <Hero />
      <PopularCategories />
      <HowItWorks />
      <FeaturedServices />
      <WhyChooseMendizo />
      <Testimonials />
      <CallToAction />
      <Footer />
    </main>
  );
}
