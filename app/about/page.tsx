import PageTransition from "@/components/PageTransition";

const AboutUs = () => {
  return (
    <PageTransition>
    <section className="about-us container mx-auto px-4 md:px-12 xl:px-40 py-8 ">
      <h1 className="text-3xl font-bold mb-6 text-[#4280BF]">About Us</h1>
      <p className="mb-6">
        Welcome to our dynamic online gaming hub! Featuring a vast library of
        over 50 titles in 25+ different genres, we&apos;re all about
        delivering diverse and exciting play experiences.
      </p>

      <h2 className="text-xl sm:text-2xl font-semibold mb-2 sm:mb-4 text-[#4280BF]">
        What Drives Us
      </h2>
      <p className="mb-6">
        Our platform is built to be fast, intuitive, and enjoyable. We aim to
        make gaming accessible with a clean design, quick access to content, and
        a layout that works seamlessly across all devices. Your privacy and
        security remain at the forefront of everything we do, ensuring a safe
        and worry free experience.
      </p>

      <h2 className="text-xl sm:text-2xl font-semibold mb-2 sm:mb-4 text-[#4280BF]">
        Community at the Core
      </h2>
      <p className="mb-6">
        This isn&apos;t just a site it&apos;s a space where players connect.
        Whether you&apos;re teaming up, sharing victories, or diving into
        conversations with others who share your interests, there&apos;s always
        a way to be part of the action.
      </p>

      <h2 className="text-xl sm:text-2xl font-semibold mb-2 sm:mb-4 text-[#4280BF]">
        Need Assistance ?
      </h2>
      <p className="mb-6">
        Our dedicated support staff is always ready to help. Whether you have
        questions, face technical issues, or simply want to give feedback,
        we&apos;re here to listen and act. Your voice helps us shape a better
        experience for everyone.
      </p>

      <p className="mb-6 italic">
        Whether you&apos;re looking for a quick break, a mental challenge, or a
        thrilling ride, our platform offers endless opportunities. Jump in and
        start your journey there&apos;s something here for everyone.
      </p>
    </section>
    </PageTransition>
  );
};

export default AboutUs;
