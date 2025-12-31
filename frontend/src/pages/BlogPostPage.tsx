import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { client } from '@/sanity/client';
import { urlFor } from '@/sanity/imageUrl';
import { PortableText } from '@portabletext/react';
import { Button } from '@/components/ui/button';
import { Calendar, User, ArrowRight } from 'lucide-react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

interface Post {
  title: string;
  slug: { current: string };
  mainImage: any;
  publishedAt: string;
  authorName: string;
  body: any;
}

const BlogPostPage = () => {
  const { slug } = useParams();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const scrollToBooking = () => {
    window.open('https://calendar.app.google/8oZYnnuHcaiH64Ky8', '_blank');
  };

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const query = `*[_type == "post" && slug.current == $slug][0] {
          title,
          slug,
          mainImage,
          publishedAt,
          "authorName": author->name,
          body
        }`;
        const data = await client.fetch(query, { slug });
        setPost(data);
      } catch (error) {
        console.error("Failed to fetch post:", error);
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchPost();
    }
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4">
        <h1 className="text-2xl font-bold">Post not found</h1>
        <Button onClick={() => navigate('/blogs')}>Back to Blog</Button>
      </div>
    )
  }

  const portableTextComponents = {
    types: {
      image: ({ value }: any) => {
        if (!value?.asset?._ref) {
          return null;
        }
        return (
          <div className="my-8 rounded-xl overflow-hidden shadow-md">
            <img
              src={urlFor(value).width(800).fit('max').auto('format').url()}
              alt={value.alt || ' '}
              className="w-full h-auto object-cover"
            />
          </div>
        );
      },
    },
    block: {
      normal: ({ children }: any) => (
        <p className="mb-6 leading-relaxed text-lg text-foreground/90">{children}</p>
      ),
      h1: ({ children }: any) => (
        <h1 className="text-4xl md:text-5xl font-bold mt-12 mb-6 text-primary leading-tight">{children}</h1>
      ),
      h2: ({ children }: any) => (
        <h2 className="text-3xl md:text-4xl font-bold mt-12 mb-6 text-primary leading-tight">{children}</h2>
      ),
      h3: ({ children }: any) => (
        <h3 className="text-2xl md:text-3xl font-bold mt-10 mb-4 text-primary leading-snug">{children}</h3>
      ),
      h4: ({ children }: any) => (
        <h4 className="text-xl md:text-2xl font-bold mt-8 mb-4 text-primary leading-snug">{children}</h4>
      ),
      blockquote: ({ children }: any) => (
        <blockquote className="border-l-4 border-primary pl-6 py-2 italic my-8 text-xl text-muted-foreground bg-secondary/10 rounded-r-lg">{children}</blockquote>
      ),
    },
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/15 selection:text-primary">
      {/* Navigation */}
      <Header />

      <main className="pt-32 pb-24 px-6 md:px-0">
        <article className="container mx-auto max-w-3xl">
          {/* Header */}
          <header className="text-center mb-12">
            <div className="inline-flex items-center gap-4 text-sm text-muted-foreground mb-6 justify-center">
              <span className="flex items-center gap-2 bg-secondary/30 px-3 py-1 rounded-full">
                <Calendar className="h-4 w-4" />
                {new Date(post.publishedAt).toLocaleDateString()}
              </span>
              {post.authorName && (
                <span className="flex items-center gap-2 bg-secondary/30 px-3 py-1 rounded-full">
                  <User className="h-4 w-4" />
                  {post.authorName}
                </span>
              )}
            </div>

            <h1 className="text-3xl md:text-5xl font-bold text-primary mb-8 leading-tight">
              {post.title}
            </h1>

            {post.mainImage && (
              <div className="rounded-2xl overflow-hidden shadow-2xl border border-border mb-12">
                <img
                  src={urlFor(post.mainImage).width(1200).height(675).url()}
                  alt={post.title}
                  className="w-full h-auto object-cover"
                />
              </div>
            )}
          </header>

          {/* Content */}
          <div className="prose prose-lg prose-slate max-w-none dark:prose-invert">
            <PortableText
              value={post.body}
              components={portableTextComponents}
            />
          </div>
        </article>
      </main>

      <main className="pt-32 pb-24 px-6 md:px-0">
        <article className="container mx-auto max-w-3xl">
          {/* Header */}
          <header className="text-center mb-12">
            <div className="inline-flex items-center gap-4 text-sm text-muted-foreground mb-6 justify-center">
              <span className="flex items-center gap-2 bg-secondary/30 px-3 py-1 rounded-full">
                <Calendar className="h-4 w-4" />
                {new Date(post.publishedAt).toLocaleDateString()}
              </span>
              {post.authorName && (
                <span className="flex items-center gap-2 bg-secondary/30 px-3 py-1 rounded-full">
                  <User className="h-4 w-4" />
                  {post.authorName}
                </span>
              )}
            </div>

            <h1 className="text-3xl md:text-5xl font-bold text-primary mb-8 leading-tight">
              {post.title}
            </h1>

            {post.mainImage && (
              <div className="rounded-2xl overflow-hidden shadow-2xl border border-border mb-12">
                <img
                  src={urlFor(post.mainImage).width(1200).height(675).url()}
                  alt={post.title}
                  className="w-full h-auto object-cover"
                />
              </div>
            )}
          </header>

          {/* Content */}
          <div className="prose prose-lg prose-slate max-w-none dark:prose-invert">
            <PortableText
              value={post.body}
              components={portableTextComponents}
            />
          </div>
        </article>
      </main>

      {/* CTA Section */}
      <section className="py-24 px-6 relative overflow-hidden bg-secondary/30 border-y border-border/50">
        <div className="absolute inset-0 bg-primary/5"></div>
        <div className="container mx-auto max-w-4xl text-center relative z-10">
          <h2 className="text-3xl md:text-5xl font-bold text-primary mb-8">Ready to unlock capacity?</h2>
          <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto">
            See how Chase Continental can standardise core work, speed up delivery, and improve operational control.
          </p>
          <Button
            onClick={scrollToBooking}
            size="lg"
            variant="outline"
            className="hover-border-swipe text-lg px-12 h-16 rounded-full font-bold border-2 border-primary text-primary transition-all cursor-pointer group shadow-lg shadow-primary/10"
          >
            Book a Free Consultation
            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default BlogPostPage;
