
import PageTransition from "@/components/PageTransition";
import Link from "next/link";

export default function DMCA() {
  return (
    <PageTransition>
      <section className="container mx-auto px-4 md:px-12 xl:px-40 py-8">
        <h1 className="text-3xl font-bold mb-6 text-[#4280BF]">DMCA Policy</h1>

        <p className="mb-6">
          If you believe that any content on <strong>globalgames.store</strong> infringes your
          copyright, please contact us with valid evidence and the specific location of
          the infringing material so we can investigate.
        </p>

        <h2 className="text-xl sm:text-2xl font-semibold mb-2 sm:mb-4 text-[#4280BF]">Required Information</h2>
        <ul className="list-disc pl-5 mb-6">
          <li>Your full name and contact details</li>
          <li>The URL of the infringing content</li>
          <li>Proof of ownership or authorization</li>
        </ul>

     
      <Link href="/contact-us">
        <button className="inline-block sm:mt-4 px-6 py-3 bg-[#4280BF] text-white font-semibold rounded hover:bg-[#306090] transition">
          Contact Us and Join Now
        </button>
      </Link>
      </section>
    </PageTransition>
  );
}
