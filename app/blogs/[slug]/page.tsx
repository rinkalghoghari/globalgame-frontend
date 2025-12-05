"use client";

import { useEffect, useState } from "react";
import { notFound } from "next/navigation";
import { blogPosts } from "../../data/blogs";
import { Home } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink as BreadcrumbLinkBase,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Link from "next/link";
import Image from "next/image";

interface BreadcrumbLinkProps extends Omit<React.ComponentProps<typeof BreadcrumbLinkBase>, 'asChild'> {
  href: string;
  children: React.ReactNode;
}

const BreadcrumbLink = ({
  href,
  children,
  ...props
}: BreadcrumbLinkProps) => {
  const { className, ...restProps } = props;
  return (
    <BreadcrumbLinkBase asChild className={className}>
      <Link href={href} {...restProps}>
        {children}
      </Link>
    </BreadcrumbLinkBase>
  );
};
export default function BlogDetail({ params }: { params: { slug: string } }) {
    const [slug, setSlug] = useState<string | null>(null);

    useEffect(() => {
        const fetchSlug = async () => {
            const unwrappedParams = await params;
            setSlug(unwrappedParams.slug);
        };

        fetchSlug();
    }, [params]);

    useEffect(() => {
        if (slug) {
            window.scrollTo(0, 0);
        }
    }, [slug]);

    if (slug === null) {
        return <div>Loading...</div>;
    }

    const blog = blogPosts.find((post) => post.slug === slug);

    if (!blog) return notFound();

    return (
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Top Banner */}
            <div className="w-full py-6 px-6">
                <div className="max-w-7xl mx-auto">
                     <div className="w-full max-w-7xl mx-auto mb-6">
                        <Breadcrumb>
                            <BreadcrumbList>
                                <BreadcrumbItem>
                                    <BreadcrumbLink href="/" className="flex items-center gap-1">
                                        <Home className="h-4 w-4" />
                                        <span>Home</span>
                                    </BreadcrumbLink>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator />
                                <BreadcrumbItem>
                                    <BreadcrumbLink href="/blogs" className="flex items-center gap-1">
                                        <span>Blogs</span>
                                    </BreadcrumbLink>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator />
                                <BreadcrumbItem>
                                    <BreadcrumbPage>{blog.title}</BreadcrumbPage>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>
                    </div>

                    <div className="flex items-center gap-2 mb-4">
                        <span className="py-1 bg-white/20 rounded-full text-sm font-medium">
                            {blog.category}
                        </span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold mb-4 max-w-4xl">
                        {blog.title}
                    </h1>
                    <p className="text-lg mb-4 max-w-3xl">
                        {blog.excerpt}
                    </p>

                    <p className="mt-2 text-gray-600 text-sm mb-4 max-w-3xl">
                        Category : <span className="font-medium">{blog.category}</span>
                    </p>
                    <div className="flex items-center gap-4 text-sm ">
                        <span>📅 Updated on: {blog.date}</span>
                        <span>⏱️ {blog.readTime}</span>
                    </div>
                </div>
            </div>

            <article className="blog-article bg-white rounded-2xl shadow-md p-8 md:p-10">
                {blog.image && (
                    <div className="w-full flex justify-center mb-8">
                        <Image
                            src={blog.image}
                            alt={blog.title}
                            width={500}          
                            height={500}
                            className="w-2xl h-auto rounded-xl"
                        />
                    </div>
                )}
                <div dangerouslySetInnerHTML={{ __html: blog.content }} />
            </article>


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
    );
}
