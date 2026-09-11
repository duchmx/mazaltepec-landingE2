import StickyWhatsApp from "@/components/StickyWhatsApp";
import Availability from "@/components/sections/Availability";
import Footer from "@/components/sections/Footer";
import Hero from "@/components/sections/Hero";
import Payment from "@/components/sections/Payment";
import Subdivision from "@/components/sections/Subdivision";
import Visit from "@/components/sections/Visit";

/**
 * Lot status is read from the admin database, so the page is regenerated in the background
 * at most once a minute (lib/lot-status.ts). Visitors are still served a static page —
 * nothing here waits on the database per request.
 */
export const revalidate = 60;

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
