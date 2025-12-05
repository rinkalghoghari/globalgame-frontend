
import PageTransition from "@/components/PageTransition";

export default function CookiePolicy() {
  return (
    <PageTransition>
      <section className="container mx-auto px-4 md:px-12 xl:px-40 py-8">
        <h1 className="text-3xl font-bold mb-6 text-[#4280BF]">Cookie Policy</h1>

        <p className="mb-6">
          <strong>globalgames.store</strong> uses cookies to improve user experience
          and provide personalized ads through Google AdSense & Analytics.
        </p>

        <h2 className="text-xl sm:text-2xl font-semibold mb-2 sm:mb-4 text-[#4280BF]">What Are Cookies?</h2>
        <p className="mb-6">
          Cookies are small text files stored on your device that remember preferences
          and improve functionality.
        </p>

        <h2 className="text-xl sm:text-2xl font-semibold mb-2 sm:mb-4 text-[#4280BF]">Managing Cookies</h2>
        <p className="mb-6">You can disable cookies anytime in your browser settings.</p>

        <h2 className="text-xl sm:text-2xl font-semibold mb-2 sm:mb-4 text-[#4280BF]">Third-Party Cookies</h2>
        <p>
          Google and other advertisers may use cookies to serve personalized ads.
          Manage preferences at: <strong>https://adssettings.google.com</strong>
        </p>
      </section>
    </PageTransition>
  );
}
