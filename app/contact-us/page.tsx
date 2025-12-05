import React from "react";
import PageTransition from "@/components/PageTransition";

const ContactUs = () => {
  return (
    <PageTransition>
      <section className="container mx-auto px-4 md:px-12 xl:px-40 py-8">
        <h1 className="text-3xl font-bold mb-6 text-[#4280BF]">
          Copyright Concern
        </h1>

        <div className="mb-6 sm:mb-8 space-y-4 text-gray-700">
          <p>
            Our platform holds intellectual property rights (IPR) for many of
            the games featured here. In several instances, we have acquired
            usage rights or licenses from the known copyright owners. However,
            for some games, copyright details were either unavailable or could
            not be verified due to widespread online usage.
          </p>
          <p>
            Certain games may be displayed under fair-use conditions, based on
            specific criteria that we strive to meet in every case.
          </p>
          <p>
            Please note that we do not modify original game files or source code
            in any way. Credits, brand references, and external links are left
            untouched. If you believe your copyrighted material or intellectual
            property is being used without permission on our platform, kindly
            contact us with the following details:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              Your electronic or physical signature (or that of a legal
              representative);
            </li>
            <li>
              A clear description of the copyrighted material or IPR in
              question, along with the nature of the concern;
            </li>
            <li>
              Details of where the original material exists (such as a URL,
              registration document, etc.);
            </li>
            <li>
              Proof of your ownership or license to use the material, if
              you&apos;re not the original creator;
            </li>
            <li>
              The specific link or page on our site where the allegedly
              infringing content appears;
            </li>
          </ul>
          <p>
            You may send your report to{" "}
            <a
              href="mailto:thunderapps58@gmail.com"
              className="text-blue-600 underline"
            >
              thunderapps58@gmail.com
            </a>
            . We take such matters seriously and aim to respond within 7
            business days.
          </p>
        </div>

        <form className="space-y-6 max-w-lg">
          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-1">
              Your Name
            </label>
            <input
              type="text"
              id="name"
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:border-[#4280BF]"
              placeholder="Enter your name"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1">
              Your Email
            </label>
            <input
              type="email"
              id="email"
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:border-[#4280BF]"
              placeholder="Enter your email"
            />
          </div>
          <div>
            <label htmlFor="message" className="block text-sm font-medium mb-1">
              Your Message
            </label>
            <textarea
              id="message"
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:border-[#4280BF]"
              placeholder="Write your message here..."
            />
          </div>
          <button
            type="submit"
            className="inline-block px-6 py-3 bg-[#4280BF] text-white font-semibold rounded hover:bg-[#306090] transition"
          >
            Submit
          </button>
        </form>
      </section>
    </PageTransition>
  );
};

export default ContactUs;
