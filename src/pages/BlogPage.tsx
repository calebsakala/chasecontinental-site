import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Calendar, User } from "lucide-react";
import { motion } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Reveal from "@/components/Reveal";
import { client } from "@/sanity/client";
import { urlFor } from "@/sanity/imageUrl";
import aiNetwork from "@/assets/ai-network.jpg";

interface Post {
  _id: string;
  title: string;
  slug: { current: string };
  mainImage?: any;
  publishedAt: string;
  excerpt?: string;
  authorName?: string;
}

const BLOG_QUERY = `*[_type == "post"] | order(publishedAt desc) {
  _id,
  title,
  slug,
  mainImage,
  publishedAt,
  excerpt,
  "authorName": author->name
}`;

const BlogPage = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    client
      .fetch(BLOG_QUERY)
      .then((data: Post[]) => setPosts(data || []))
      .catch((err) => console.error("Failed to fetch posts:", err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen">
      <Header />

      <main className="pt-16">
        {/* Hero */}
        <section className="relative overflow-hidden py-28 px-6">
          <div className="absolute inset-0">
            <img src={aiNetwork} alt="" className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-foreground/90" />
          </div>
          <div className="relative z-10 mx-auto max-w-4xl text-center">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/10 backdrop-blur-sm px-5 py-2 text-sm font-medium text-gold">
                Insights & Updates
              </span>
              <h1 className="mt-6 text-primary-foreground">Our Blog</h1>
              <p className="mt-4 text-primary-foreground/60 text-lg max-w-xl mx-auto">
                Thoughts on AI automation, modern software, and the future of work.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Posts grid */}
        <section className="py-24 px-6">
          <div className="mx-auto max-w-6xl">
            {loading ? (
              <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="rounded-2xl border bg-card overflow-hidden animate-pulse">
                    <div className="h-52 bg-muted" />
                    <div className="p-7 space-y-3">
                      <div className="h-3 bg-muted rounded w-2/3" />
                      <div className="h-5 bg-muted rounded" />
                      <div className="h-3 bg-muted rounded w-full" />
                      <div className="h-3 bg-muted rounded w-4/5" />
                    </div>
                  </div>
                ))}
              </div>
            ) : posts.length > 0 ? (
              <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {posts.map((post, i) => (
                  <Reveal key={post._id} delay={i * 0.1}>
                    <article className="group relative rounded-2xl border bg-card overflow-hidden transition-all duration-500 hover:shadow-2xl hover:border-gold/20 hover:-translate-y-1 h-full flex flex-col">
                      <div className="h-52 overflow-hidden">
                        {post.mainImage ? (
                          <img
                            src={urlFor(post.mainImage).width(600).url()}
                            alt={post.title}
                            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                          />
                        ) : (
                          <div className="h-full w-full bg-gradient-to-br from-primary/20 to-gold/10 flex items-center justify-center">
                            <img src="/static/images/chase-continental-header-logo.png" alt="" className="h-16 w-auto opacity-20" />
                          </div>
                        )}
                      </div>
                      <div className="p-7 flex flex-col flex-1">
                        <div className="flex items-center gap-3 text-xs text-muted-foreground mb-4">
                          {post.publishedAt && (
                            <span className="inline-flex items-center gap-1.5">
                              <Calendar className="h-3.5 w-3.5" />
                              {new Date(post.publishedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                            </span>
                          )}
                          {post.authorName && (
                            <span className="inline-flex items-center gap-1.5">
                              <User className="h-3.5 w-3.5" />
                              {post.authorName}
                            </span>
                          )}
                        </div>
                        <h3 className="text-lg mb-3 text-card-foreground line-clamp-2 group-hover:text-gold transition-colors font-heading">
                          {post.title}
                        </h3>
                        {post.excerpt && (
                          <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed flex-1">
                            {post.excerpt}
                          </p>
                        )}
                        <div className="mt-5 flex items-center gap-1.5 text-sm font-semibold text-gold">
                          Read Article
                          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </div>
                      </div>
                      <Link to={`/blog/${post.slug.current}`} className="absolute inset-0" aria-label={`Read: ${post.title}`} />
                    </article>
                  </Reveal>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <p className="text-muted-foreground text-lg">No posts found</p>
                <p className="text-sm text-muted-foreground mt-2">Check back later for updates!</p>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default BlogPage;
