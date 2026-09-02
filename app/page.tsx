import StickyWhatsApp from "@/components/StickyWhatsApp";
import Availability from "@/components/sections/Availability";
import Footer from "@/components/sections/Footer";
import Hero from "@/components/sections/Hero";
import Payment from "@/components/sections/Payment";
import Subdivision from "@/components/sections/Subdivision";
import Visit from "@/components/sections/Visit";

export default function Page() {
  return (
    <>
      <main id="contenido">
        <Hero />
        <Availability />
        <Payment />
        <Subdivision />
        <Visit />
      </main>
      <Footer />
      <StickyWhatsApp />
    </>
  );
}
