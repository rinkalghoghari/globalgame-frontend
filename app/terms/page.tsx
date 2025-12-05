export default function PrivacyPolicy() {
  return (
    <>
      <div className="min-h-screen bg-white text-gray-800 flex flex-col">
        <main className="container mx-auto px-4 md:px-12 xl:px-40 py-8 ">
          <h1 className="text-3xl font-bold mb-6 text-[#4280BF]">Terms of Service</h1>

          <section className="mb-6">
            <h2 className="text-xl sm:text-2xl font-semibold mb-2 sm:mb-4 text-[#4280BF]">1. Overview</h2>
            <p>
              Your privacy is important to us. This Privacy Policy explains how we handle your information, including what we collect, how we use it, and how we keep it secure.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-xl sm:text-2xl font-semibold mb-2 sm:mb-4 text-[#4280BF]">2. Automatically Collected Information</h2>
            <p>
              We may automatically collect technical data such as your IP address, browser type, and device information. This helps us improve the website and user experience.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-xl sm:text-2xl font-semibold mb-2 sm:mb-4 text-[#4280BF]">3. Personal Data Collection</h2>
            <p>
              We do not collect personal information from users directly. Our services are designed to respect your privacy.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-xl sm:text-2xl font-semibold mb-2 sm:mb-4 text-[#4280BF]">4. How We Use Your Data</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>To operate and maintain the website.</li>
              <li>To enable participation in features or programs.</li>
              <li>To send important communications or support messages.</li>
              <li>To improve usability and performance.</li>
              <li>To comply with legal and regulatory requirements.</li>
            </ul>
          </section>

          <section className="mb-6">
            <h2 className="text-xl sm:text-2xl font-semibold mb-2 sm:mb-4 text-[#4280BF]">5. Third-Party Services</h2>
            <p>
              We may use third-party providers for services like payments or analytics. These providers have their own privacy policies, which we recommend reviewing.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-xl sm:text-2xl font-semibold mb-2 sm:mb-4 text-[#4280BF]">6. Data Retention</h2>
            <p>
              We retain information only as long as necessary for service delivery and legal compliance. You may request deletion of your data by contacting us.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-xl sm:text-2xl font-semibold mb-2 sm:mb-4 text-[#4280BF]">7. Age Restrictions</h2>
            <p>
              Certain features are intended for users aged 13 and above. We may use cookies to manage age-based access and redirect underage users as needed.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-xl sm:text-2xl font-semibold mb-2 sm:mb-4 text-[#4280BF]">8. Security & Safety</h2>
            <p>
              We implement standard security practices to protect user data. While no system is entirely secure, we take reasonable steps to safeguard information.
            </p>
            <p className="mt-2">
              The platform does not feature any gambling content. All games or features are purely for entertainment, using virtual currency only.
            </p>
          </section>
        </main>

        <footer className="text-center text-sm text-gray-500 py-6 border-t">
          © {new Date().getFullYear()}. All rights reserved.
        </footer>
      </div>
    </>
  );
}
