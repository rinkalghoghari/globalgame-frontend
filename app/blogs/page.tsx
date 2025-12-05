"use client"
import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { blogPosts } from '../data/blogs';
import PageTransition from '@/components/PageTransition';
import Image from 'next/image';

export default function BlogIndex() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const categories = ['All', 'Reviews', 'Guides', 'Technical', 'Articles'];

  const filteredPosts = selectedCategory === 'All' 
    ? blogPosts 
    : blogPosts.filter(post => post.category === selectedCategory);

  return (
    <PageTransition>
      <Head>
        <title>Gaming Blog - Tips, Reviews & Guides | Gaming Insights</title>
        <meta name="description" content="Expert gaming insights, tips, and comprehensive guides for online racing games, HTML5 games, and mobile gaming. Stay updated with latest trends." />
        <meta name="keywords" content="gaming blog, racing games, HTML5 games, game guides, gaming tips, browser games" />
      </Head>

          <div className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-8 md:py-12 mb-8">
              <header>
                  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                      <Link href="/" className="text-3xl font-bold hover:text-purple-200 transition">
                          🎮 Gaming Insights Blog
                      </Link>
                      <p className="mt-2 text-lg opacity-90">Expert tips, reviews, and guides for gamers</p>
                  </div>
              </header>
          </div>

      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
   

        {/* AdSense - Top Banner */}
        {/* <div className="container mx-auto px-4 py-6">
          <div className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <p className="text-sm text-gray-500 mb-2">Advertisement</p>
            <div className="h-24 flex items-center justify-center bg-gray-200 rounded">
              [Google AdSense - 728x90 Leaderboard]
            </div>
          </div>
        </div> */}

        {/* Category Filter */}
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-wrap gap-3 justify-center">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-6 py-2 rounded-full font-semibold transition ${
                  selectedCategory === cat
                    ? 'bg-purple-400 text-white shadow-lg'
                    : 'bg-white text-gray-700 hover:bg-purple-50 hover:text-purple-500'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Blog Grid */}
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map(post => (
             
                <article key={post.id} className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow overflow-hidden group">
                  {/* Image/Icon */}
                <div className="w-full flex justify-center mb-4 mt-4">
                  <Image
                    src={post.image}
                    alt={post.title}
                    width={800}           
                    height={500}        
                    className="max-w-full h-auto rounded-xl"
                  />
                </div>
                  {/* Content */}
                  <div className="p-6">
                    {/* Category Badge */}
                    <span className="inline-block px-3 py-1 bg-purple-100 text-purple-600 text-xs font-semibold rounded-full mb-3">
                      {post.category}
                    </span>

                    {/* Title */}
                    <h2 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-purple-500 transition">
                      {post.title}
                    </h2>

                    {/* Excerpt */}
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                      {post.excerpt}
                    </p>

                    {/* Meta Info */}
                    <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                      <span>{new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                      <span>{post.readTime}</span>
                    </div>

                    {/* Read More Button */}
                    <Link href={`/blogs/${post.slug}`} className="inline-flex items-center gap-2 text-purple-500 font-semibold hover:gap-3 transition-all">
                      Read Article
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </div>
                </article>
            ))}
          </div>
        </div>

        {/* AdSense - Bottom Banner */}
        {/* <div className="container mx-auto px-4 py-8">
          <div className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <p className="text-sm text-gray-500 mb-2">Advertisement</p>
            <div className="h-24 flex items-center justify-center bg-gray-200 rounded">
              [Google AdSense - 728x90 Leaderboard]
            </div>
          </div>
        </div> */}


    {/* Newsletter Section */}
          <div className="w-full bg-gray-50 py-12 mt-16">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">Stay Updated!</h2>
              <p className="text-gray-600 mb-6">Subscribe to our newsletter and be the first to know about new games and special offers.</p>
              <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <input 
                  type="email" 
                  placeholder="Enter your email" 
                  className="flex-grow px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors duration-200">
                  Subscribe
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-3">We respect your privacy. Unsubscribe at any time.</p>
            </div>
          </div>

     
      </div>
    </PageTransition>
  );
}