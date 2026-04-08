import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Calendar, User, ArrowRight, ArrowLeft } from "lucide-react";
import {
  PortableText,
  type PortableTextBlock,
  type PortableTextComponents,
} from "@portabletext/react";
import type { SanityImageSource } from "@sanity/image-url";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { client } from "@/sanity/client";
import { urlFor } from "@/sanity/imageUrl";

const BOOK_CALL_URL = "https://calendar.app.google/8oZYnnuHcaiH64Ky8";

const POST_QUERY = `*[_type == "post" && slug.current == $slug][0] {
  title,
  slug,
  mainImage,
  publishedAt,
  "authorName": author->name,
  body
}`;

interface SanityPost {
  title: string;
  slug: { current: string };
  mainImage?: SanityImageSource;
  publishedAt?: string;
  authorName?: string;
  body?: PortableTextBlock[];
}

const portableTextComponents: PortableTextComponents = {
  block: {
    normal: ({ children }) => (
      <p className="text-muted-foreground leading-relaxed my-4">{children}</p>
    ),
    h1: ({ children }) => <h1 className="mt-10 mb-4">{children}</h1>,
    h2: ({ children }) => <h3 className="text-xl mt-10 mb-4">{children}</h3>,
    h3: ({ children }) => <h4 className="text-lg mt-8 mb-3">{children}</h4>,
    h4: ({ children }) => (
      <h4 className="text-base font-semibold mt-6 mb-2">{children}</h4>
    ),
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-gold pl-5 my-6 italic text-muted-foreground">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="list-disc pl-6 space-y-2 my-4">{children}</ul>
    ),
    number: ({ children }) => (
      <ol className="list-decimal pl-6 space-y-2 my-4">{children}</ol>
    ),
  },
  listItem: {
    bullet: ({ children }) => (
      <li className="text-muted-foreground">{children}</li>
    ),
    number: ({ children }) => (
      <li className="text-muted-foreground">{children}</li>
    ),
  },
  marks: {
    strong: ({ children }) => (
      <strong className="text-foreground font-semibold">{children}</strong>
    ),
    em: ({ children }) => <em>{children}</em>,
    link: ({ value, children }) => (
      <a
        href={typeof value?.href === "string" ? value.href : undefined}
        target="_blank"
        rel="noopener noreferrer"
        className="text-gold hover:underline"
      >
        {children}
      </a>
    ),
  },
  types: {
    image: ({ value }) => (
      <div className="my-8 rounded-2xl overflow-hidden border">
        <img
          src={urlFor(value as SanityImageSource)
            .width(800)
            .fit("max")
            .auto("format")
            .url()}
          alt={typeof value?.alt === "string" ? value.alt : ""}
          className="w-full"
        />
      </div>
    ),
  },
};

const BlogPostPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<SanityPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    client
      .fetch(POST_QUERY, { slug })
      .then((data: SanityPost) => setPost(data))
      .catch((err) => console.error("Failed to fetch post:", err))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="pt-16">
          <div className="mx-auto max-w-3xl px-6 py-32">
            <div className="animate-pulse space-y-4">
              <div className="h-4 bg-muted rounded w-1/4" />
              <div className="h-8 bg-muted rounded w-3/4" />
              <div className="h-64 bg-muted rounded-2xl" />
              <div className="h-4 bg-muted rounded w-full" />
              <div className="h-4 bg-muted rounded w-5/6" />
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="pt-16">
          <div className="mx-auto max-w-3xl px-6 py-32 text-center">
            <h1 className="mb-4 text-foreground">Post not found</h1>
            <Button asChild>
              <Link to="/blogs">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Blog
              </Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header />

      <main className="pt-16">
        <article className="mx-auto max-w-3xl px-6 py-16">
          {/* Meta */}
          <div className="flex items-center gap-3 mb-6">
            {post.publishedAt && (
              <span className="inline-flex items-center gap-1 rounded-full bg-secondary px-3 py-1 text-xs font-medium text-muted-foreground">
                <Calendar className="h-3 w-3" />
                {new Date(post.publishedAt).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
            )}
            {post.authorName && (
              <span className="inline-flex items-center gap-1 rounded-full bg-secondary px-3 py-1 text-xs font-medium text-muted-foreground">
                <User className="h-3 w-3" />
                {post.authorName}
              </span>
            )}
          </div>

          {/* Title */}
          <h1 className="mb-8 text-gold">{post.title}</h1>

          {/* Featured image */}
          {post.mainImage && (
            <div className="mb-10 rounded-2xl border overflow-hidden">
              <img
                src={urlFor(post.mainImage)
                  .width(800)
                  .fit("max")
                  .auto("format")
                  .url()}
                alt={post.title}
                className="w-full"
              />
            </div>
          )}

          {/* Body */}
          {post.body && (
            <div className="prose-like">
              <PortableText
                value={post.body}
                components={portableTextComponents}
              />
            </div>
          )}
        </article>

        {/* CTA */}
        <section className="bg-gradient-to-b from-primary/5 to-gold/5 py-20 px-6">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="mb-4 text-foreground">
              Want this in your business?
            </h2>
            <p className="mb-8 text-muted-foreground">
              If you want AI automation that actually works day-to-day, let's
              talk.
            </p>
            <Button
              size="lg"
              className="rounded-full bg-gold text-gold-foreground hover:bg-gold/90 hover-border-swipe"
              onClick={() => window.open(BOOK_CALL_URL, "_blank")}
            >
              Start a Pilot
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default BlogPostPage;
