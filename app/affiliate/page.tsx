import React from 'react';
import Link from 'next/link';
import PageTransition from '@/components/PageTransition';

const AffiliateProgram = () => {
  return (
    <PageTransition>
    <section className="container mx-auto px-4 md:px-12 xl:px-40 py-8 ">
      <h1 className="text-3xl font-bold mb-6 text-[#4280BF]">
        Join Our Affiliate Program
      </h1>

      <p className="mb-6">
        If you&apos;re a web or mobile developer, you can now monetize your traffic by directing users to our gaming platform. It&apos;s simple, effective, and built to reward your efforts.
      </p>

      <p className="mb-6">
        We offer access to one of the largest collections of HTML5 games, fully optimized for every screen—desktop, tablet, or mobile. You can feature individual games or even build your own custom portal. Our team is dedicated to helping you succeed, offering support tailored to your content and marketing goals.
      </p>

      <h2 className="text-2xl font-semibold mb-4 text-[#4280BF]">
        Why Partner With Us?
      </h2>

      <p className="mb-6">
        Our experienced team is focused on developing a smooth and accessible browser-based gaming experience. Whether you&apos;re an indie developer or part of a larger team, our platform is built to support and reward contributors of all sizes.
      </p>

      <p className="mb-6">
        Our titles are compatible with nearly every device, making them perfect for users at home, school, or on the go. With millions of players joining us each month, you&apos;ll be tapping into a thriving and ever-growing community.
      </p>

      <p className="mb-6 italic">
        No installations. No downloads. Just launch your favorite titles directly in your browser and start playing.
      </p>

      <p className="mb-6">
        Our games are accessible across a wide range of devices including desktops, laptops, Chromebooks, iOS and Android smartphones, and tablets. We aim to make gaming available to everyone, everywhere.
      </p>

      <Link href="/contact-us">
        <button className="inline-block mt-4 px-6 py-3 bg-[#4280BF] text-white font-semibold rounded hover:bg-[#306090] transition">
          Contact Us
        </button>
      </Link>
    </section>
    </PageTransition>
  );
};

export default AffiliateProgram;
