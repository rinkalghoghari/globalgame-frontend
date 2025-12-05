import React from "react";
import Link from "next/link";
import PageTransition from "@/components/PageTransition";

const Developers = () => {
  return (
    <PageTransition>
    <section className="container mx-auto px-4 md:px-12 xl:px-40 py-8 ">
      <h1 className="text-3xl font-bold mb-6 text-[#4280BF]">
        Developers – Join Our Platform
      </h1>

      <p className="mb-6">
        We’re a forward-thinking game development studio focused on delivering
        creative and immersive gaming experiences. Beyond building games, we
        specialize in crafting responsive and scalable gaming applications that
        perform seamlessly across platforms.
      </p>

      <p className="mb-6">
        Our platform empowers content creators with full control over their
        projects. From publishing and promotion to real-time performance
        tracking and monetization everything is streamlined through our
        intuitive dashboard. What truly enhances your reach is our engaged
        community and the high visibility that our platform provides.
      </p>

      <p className="mb-6 italic">
        Picture the ability to launch your ideas to a worldwide audience,
        generate revenue from your creations, and grow your following all in one
        place.
      </p>

      <p className="mb-6">
        With the right tools and exposure, turning your love for game
        development into a successful business has never been more achievable.
      </p>

      <Link href="/contact-us">
        <button className="inline-block mt-4 px-6 py-3 bg-[#4280BF] text-white font-semibold rounded hover:bg-[#306090] transition">
          Contact Us and Join Now
        </button>
      </Link>
    </section>
    </PageTransition>
  );
};

export default Developers;
