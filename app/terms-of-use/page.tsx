
import PageTransition from "@/components/PageTransition";

export default function TermsOfUse() {
  return (
    <PageTransition>
      <section className="container mx-auto px-4 md:px-12 xl:px-40 py-8">
        <h1 className="text-3xl font-bold mb-6 text-[#4280BF]">Terms of Use</h1>
        <p>Last updated: {new Date().toLocaleDateString()}</p>

        <p className="mt-6 mb-6">
          By accessing or using <strong>globalgames.store</strong>, you agree to follow these
          Terms of Use. If you do not agree, please discontinue using our site immediately.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-3">User Responsibilities</h2>
        <ul className="list-disc pl-6 mb-6">
          <li>Do not use the site for illegal activities</li>
          <li>No attempt to hack, damage, or misuse services</li>
          <li>No copyright infringement</li>
        </ul>

        <h2 className="text-xl font-semibold mt-6 mb-3">Limitation of Liability</h2>
        <p className="mb-6">
          We are not responsible for any direct or indirect damages resulting from using our website.
        </p>
      </section>
    </PageTransition>
  );
}
