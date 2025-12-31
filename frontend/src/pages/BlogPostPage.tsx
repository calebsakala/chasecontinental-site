import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { client } from '@/sanity/client';
import { urlFor } from '@/sanity/imageUrl';
import { PortableText } from '@portabletext/react';
import { Button } from '@/components/ui/button';
import { Calendar, User } from 'lucide-react';
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

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default BlogPostPage;
