'use client';

import { motion } from 'framer-motion';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { useRouter } from 'next/navigation';

type FAQItem = {
  question: string;
  answer: string;
};

const faqItems: FAQItem[] = [
  {
    question: 'Are the games on this website really free?',
    answer: 'Yes, all games on our website are completely free to play. You can enjoy all games without any charges.'
  },
  {
    question: 'Do I need to create an account to play games?',
    answer: 'No, you can play games without creating an account. However, if you want to save your progress, you can create an account.'
  },
  {
    question: 'Can I play games on my mobile device?',
    answer: 'Yes, our website is fully optimized for mobile devices. You can enjoy games on any smartphone or tablet.'
  },
  {
    question: 'How do I play a game?',
    answer: 'To play a game, simply click on your preferred game and press the "Play Now" button. Most games are controlled using a keyboard or mouse.'
  },
  {
    question: 'Can I play games in fullscreen mode?',
    answer: 'Yes, all games have a fullscreen button that you can use to play the game in fullscreen mode.'
  },
  {
    question: 'My game progress is not saving. What should I do?',
    answer: 'If your game progress is not saving, please clear your browser\'s cache and cookies, then refresh the page. If the issue persists, please contact us.'
  },
  {
    question: 'Can I play games with my friends?',
    answer: 'Yes, some games support multiplayer mode where you can play with your friends. Check the game details for more information.'
  },
  {
    question: 'Why is the game taking so long to load?',
    answer: 'Loading times may vary depending on the game size and your internet connection speed. Please be patient or check your internet connection.'
  },
  {
    question: 'Can I play games offline?',
    answer: 'No, all our games require an internet connection as they are only available online.'
  },
  {
    question: 'I\'m having issues with a game. How can I get help?',
    answer: 'If you\'re experiencing any issues with a game, please contact us through our contact page. We\'ll assist you as soon as possible.'
  }
];

const FAQPage = () => {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-8 md:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8 sm:mb-10 md:mb-12"
        >
          <h1 className="font-bold text-gray-900 mb-4 text-3xl lg:text-4xl">Frequently Asked Questions</h1>
          <p className="text-base sm:text-lg text-gray-600">Find answers to common questions about our games</p>
        </motion.div>

        <div className="space-y-4">
          <Accordion type="single" collapsible className="w-full space-y-4">
            {faqItems.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.3 }}
              >
                <AccordionItem 
                  value={`item-${index}`}
                  className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200"
                >
                  <AccordionTrigger className="px-4 sm:px-6 py-4 text-left hover:no-underline group">
                    <div className="flex items-center justify-between w-full">
                      <span className="font-medium text-gray-900 text-lg pr-4">{item.question}</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-4 sm:px-6 pb-4 sm:pb-6 pt-2 text-gray-600 bg-gray-50">
                    <div className="mt-2">
                      {item.answer}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </motion.div>
            ))}
          </Accordion>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.5 }}
          className="mt-8 sm:mt-10 md:mt-12 text-center bg-white p-6 rounded-xl shadow-md"
        >
          <h2 className="text-2xl font-semibold text-gray-900 mb-3 sm:mb-4">Still have questions?</h2>
          <p className="text-gray-600 mb-4 sm:mb-5 md:mb-6">If you have any other questions, please don &apos;t hesitate to contact us.</p>
          <button onClick={() => router.push('/contact-us')} className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-2 px-6 rounded-full transition-all duration-300 transform hover:scale-105">
            Contact Us
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default FAQPage;
