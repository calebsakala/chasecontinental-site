import { useEffect, useState } from 'react';
import { client } from '@/sanity/client';
import { urlFor } from '@/sanity/imageUrl';
import { Link } from 'react-router-dom';
import { ArrowRight, Calendar, User } from 'lucide-react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

interface Post {
  _id: string;
  title: string;
  slug: { current: string };
  mainImage: any;
  publishedAt: string;
  excerpt: string;
  authorName: string;
}

const BlogPage = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const query = `*[_type == "post"] | order(publishedAt desc) {
          _id,
          title,
          slug,
          mainImage,
          publishedAt,
          excerpt,
          "authorName": author->name
        }`;
        const data = await client.fetch(query);
        setPosts(data);
      } catch (error) {
        console.error("Failed to fetch posts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/15 selection:text-primary">
      {/* Navigation */}
      <Header />

      {/* Hero Section */}
      <header className="pt-40 pb-16 px-6 bg-secondary/30">
        <div className="container mx-auto max-w-6xl text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider mb-6">
            Insights & Updates
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-primary mb-6">
            Our Blog
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Thoughts on AI, automation, and the future of work.
          </p>
        </div>
      </header>

      {/* Blog Grid */}
      <main className="py-24 px-6">
        <div className="container mx-auto max-w-6xl">
          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((n) => (
                <div key={n} className="h-96 rounded-2xl bg-secondary/50 animate-pulse" />
              ))}
            </div>
          ) : posts.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post) => (
                <article key={post._id} className="group flex flex-col h-full bg-card border border-border rounded-2xl overflow-hidden hover-border-snake hover:shadow-lg transition-all duration-300">
                  <svg className="snake-svg">
                    <rect pathLength="100" className="snake-svg-rect snake-variant-thin-2xl" />
                  </svg>

                  {/* Image */}
                  <div className="h-48 overflow-hidden bg-secondary relative z-10">
                    {post.mainImage ? (
                      <img
                        src={urlFor(post.mainImage).width(800).height(500).url()}
                        alt={post.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-secondary/50 p-12">
                        <img
                          src="/static/images/chase-continental-header-logo.png"
                          alt="Chase Continental"
                          className="w-full h-full object-contain"
                        />
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-6 flex flex-col flex-grow relative z-10">
                    <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(post.publishedAt).toLocaleDateString()}
                      </span>
                      {post.authorName && (
                        <span className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          {post.authorName}
                        </span>
                      )}
                    </div>

                    <h2 className="text-xl font-bold text-primary mb-3 line-clamp-2 leading-tight group-hover:text-primary transition-colors">
                      {post.title}
                    </h2>

                    <p className="text-muted-foreground text-sm line-clamp-3 mb-6 flex-grow leading-relaxed">
                      {post.excerpt}
                    </p>

                    <div className="pt-4 mt-auto border-t border-border/50">
                      <span className="text-sm font-semibold text-primary inline-flex items-center group-hover:translate-x-1 transition-transform">
                        Read Article <ArrowRight className="ml-2 h-4 w-4" />
                      </span>
                    </div>
                  </div>

                  {/* Link overlay */}
                  <Link to={`/blog/${post.slug.current}`} className="absolute inset-0 z-20 focus:outline-none">
                    <span className="sr-only">View article {post.title}</span>
                  </Link>
                </article>
              ))}
            </div>
          ) : (
            <div className="text-center py-24">
              <h3 className="text-2xl font-bold text-primary mb-4">No posts found</h3>
              <p className="text-muted-foreground">Check back later for updates!</p>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default BlogPage;
