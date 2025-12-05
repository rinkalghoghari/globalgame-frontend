
import PageTransition from "@/components/PageTransition";
import Link from "next/link";

export default function PrivacyPolicy() {
  return (
    <PageTransition>
      <section className="container mx-auto px-4 md:px-12 xl:px-40 py-8">
        <h1 className="text-3xl font-bold mb-6 text-[#4280BF]">Privacy Policy</h1>
        <p>Last updated: {new Date().toLocaleDateString()}</p>

        <p className="mt-6 mb-6">
          Welcome to <strong>globalgames.store</strong>. We respect your privacy and are committed
          to protecting your personal information. This policy explains how we collect, use,
          and safeguard your data.
        </p>

        <h2 className="text-xl sm:text-2xl font-semibold mb-2 sm:mb-4 text-[#4280BF]">Information We Collect</h2>
        <ul className="list-disc pl-6 mb-6">
          <li>Personal details (name, email, contact info)</li>
          <li>Usage data such as pages visited & browser type</li>
          <li>Cookies and tracking technologies (Google AdSense, Analytics)</li>
        </ul>

        <h2 className="text-xl sm:text-2xl font-semibold mb-2 sm:mb-4 text-[#4280BF]">Use of Data</h2>
        <ul className="list-disc pl-6 mb-6">
          <li>Personalized ads & analytics</li>
          <li>Improving website performance</li>
          <li>Responding to user inquiries</li>
        </ul>

        <h2 className="text-xl sm:text-2xl font-semibold mb-2 sm:mb-4 text-[#4280BF]">Google AdSense & Cookies</h2>
        <p className="mb-6">
          Google and third-party vendors use cookies to show personalized ads based on
          your browsing history. You can opt out anytime through Google Ads Settings.
        </p>
        <Link href="/contact-us">
        <button className="inline-block mt-4 px-6 py-3 bg-[#4280BF] text-white font-semibold rounded hover:bg-[#306090] transition">
          Contact Us and Join Now
        </button>
      </Link>
      </section>
    </PageTransition>
  );
}
