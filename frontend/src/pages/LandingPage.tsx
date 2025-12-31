import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Zap,
  ShieldCheck,
  Menu,
  Cloud,
  Search,
  Bot,
  Settings,
  BarChart3,
  Rocket,
  Building2,
  Leaf,
  Building,
  Settings2,
  Smartphone,
  Activity,
  Users,
  Star,
  Linkedin,
  Twitter
} from 'lucide-react';
import { useState, useEffect } from 'react';

const LandingPage = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToBooking = () => {
    window.open('https://calendar.app.google/8oZYnnuHcaiH64Ky8', '_blank');
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/15 selection:text-primary overflow-x-hidden">

      {/* Background Elements */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-secondary/20" />
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/5 blur-[120px] animate-pulse duration-[10000ms]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-secondary/20 blur-[120px]" />
        <div className="absolute top-[40%] left-[20%] w-[20%] h-[20%] rounded-full bg-primary/5 blur-[100px]" />
      </div>

      {/* Navigation */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white border-b border-border shadow-sm' : 'bg-transparent'}`}>
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
          <a href="#top" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 blur-lg rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
              <img
                src="/static/images/chase-continental-header-logo.png"
                alt="Chase Continental"
                className="h-9 w-auto relative z-10"
              />
            </div>
            <span className="text-sm font-bold tracking-wide text-primary hidden sm:block">CHASE CONTINENTAL</span>
          </a>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#products" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">Products</a>
            <a href="#services" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">Services</a>
            <a href="#results" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">Results</a>
            <Button
              onClick={scrollToBooking}
              variant="outline"
              className="hover-border-swipe rounded-full font-semibold px-6 border-2 border-primary text-primary transition-all cursor-pointer"
            >
              Book a Demo
            </Button>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden p-2 text-primary"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>

        {/* Mobile Nav */}
        {mobileMenuOpen && (
          <div className="md:hidden fixed top-20 left-0 w-full z-60 bg-white border-b border-border p-6 flex flex-col gap-4 shadow-xl animate-in slide-in-from-top-5">
            <a href="#products" className="text-base font-medium text-foreground py-2" onClick={() => setMobileMenuOpen(false)}>Products</a>
            <a href="#services" className="text-base font-medium text-foreground py-2" onClick={() => setMobileMenuOpen(false)}>Services</a>
            <a href="#results" className="text-base font-medium text-foreground py-2" onClick={() => setMobileMenuOpen(false)}>Results</a>
            <Button onClick={scrollToBooking} className="w-full rounded-full border-2 border-transparent bg-primary text-primary-foreground cursor-pointer shadow-md">Book a Demo</Button>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <header id="top" className="relative pt-40 pb-24 px-6 z-10">
        <div className="container mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/5 border border-primary/10 text-primary text-xs font-bold tracking-wide mb-8 hover:bg-primary/10 transition-colors cursor-default">
                <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                ENTERPRISE AI STUDIO
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-primary mb-6 leading-tight">
                Building software that changes the way people work.
              </h1>

              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed mb-8 max-w-xl">
                Unlocking hidden capacity. Building tomorrow's organisations today with a product-first platform designed for real operations.
              </p>



              <div className="flex flex-col sm:flex-row gap-4 mb-12">
                <Button
                  onClick={scrollToBooking}
                  size="lg"
                  className="text-lg px-8 h-14 rounded-full font-semibold bg-primary text-primary-foreground border-2 border-transparent shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all cursor-pointer hover:-translate-y-0.5"
                >
                  Book a Demo
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>

              {/* Trusted By Strip */}
              <div className="border-t border-border/60 pt-8">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">Trusted by industry leaders</p>
                <div className="flex flex-wrap gap-x-8 gap-y-4 items-center opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
                  <div className="flex items-center gap-2 font-bold text-lg text-foreground/80">
                    <Building2 className="h-5 w-5" /> CCID
                  </div>
                  <div className="flex items-center gap-2 font-bold text-lg text-foreground/80">
                    <Leaf className="h-5 w-5" /> Heineken
                  </div>
                  <div className="flex items-center gap-2 font-bold text-lg text-foreground/80">
                    <Building className="h-5 w-5" /> MRI
                  </div>
                </div>
              </div>
            </div>

            <div className="relative animate-in fade-in slide-in-from-right-8 duration-1000 delay-200 flex items-center justify-center">
              {/* Subtle background glow only */}
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 via-transparent to-secondary/10 blur-3xl rounded-full opacity-60" />

              <div className="relative transform hover:-translate-y-2 transition-transform duration-700 ease-out scale-125">
                <img
                  src="/static/images/hero-dashboard.png"
                  alt="Chase Agents Dashboard Interface"
                  className="w-full h-auto object-contain max-h-[600px]"
                />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Stats / Intro Section */}
      <section className="py-24 px-6 bg-primary text-primary-foreground">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-8">
            Unlocking Hidden Capacity Through Digital Transformation
          </h2>
          <p className="text-xl text-primary-foreground/80 leading-relaxed mb-16 max-w-3xl mx-auto">
            Chase Continental unlocks your organization's hidden potential through digital transformation and practical AI. We transform paper-based processes to cloud systems, then automate with hybrid teams that deliver measurable results.
          </p>

          <div className="grid md:grid-cols-3 gap-12 border-t border-primary-foreground/20 pt-12">
            <div>
              <div className="text-4xl font-bold mb-2">100+</div>
              <div className="text-sm font-medium text-primary-foreground/70">Processes Automated</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">3 years</div>
              <div className="text-sm font-medium text-primary-foreground/70">Industry Experience</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">98%</div>
              <div className="text-sm font-medium text-primary-foreground/70">Uptime Achieved</div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Products */}
      <section id="products" className="py-32 px-6 bg-secondary/30 border-y border-border/50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-5xl font-bold text-primary mb-6">Our Products</h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Powerful, product-first platforms designed to automate specific domains of your business with precision and scale.
            </p>
          </div>

          <div className="flex flex-col gap-24">
            {/* Chase Agents */}
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="order-2 lg:order-1 relative group hover-border-snake rounded-2xl">
                <span></span><span></span><span></span><span></span>
                <div className="rounded-2xl border border-white/20 overflow-hidden shadow-2xl hover:shadow-primary/20 transition-all duration-500 bg-black/5">
                  <img
                    src="/static/images/product-chase-agents.png"
                    alt="Chase Agents Dashboard"
                    className="w-full h-auto object-cover"
                  />
                </div>
              </div>
              <div className="order-1 lg:order-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider mb-6">
                  Flagship Platform
                </div>
                <h3 className="text-3xl md:text-4xl font-bold text-primary mb-6">Chase Agents</h3>
                <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                  The Enterprise Standard for Agentic AI. Combine the creativity of LLMs with the precision of verified code. Deploy autonomous agents that execute complex enterprise workflows with zero hallucinations and full observability.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    size="lg"
                    className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/20"
                    asChild
                  >
                    <a href="https://chaseagents.com" target="_blank" rel="noopener noreferrer">
                      Deploy Agents <ArrowRight className="ml-2 h-4 w-4" />
                    </a>
                  </Button>
                </div>
              </div>
            </div>

            {/* Keyword Autopilot */}
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="lg:pr-8">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 text-violet-600 text-xs font-bold uppercase tracking-wider mb-6">
                  SEO Automation
                </div>
                <h3 className="text-3xl md:text-4xl font-bold text-primary mb-6">Keyword Autopilot</h3>
                <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                  Dominate search results with automated keyword strategies that outperform competitors. Our agents analyze search intent, cluster keywords, and generate optimzed content strategies on autopilot.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    size="lg"
                    className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/20"
                    asChild
                  >
                    <a href="https://keywordautopilot.com" target="_blank" rel="noopener noreferrer">
                      Start Ranking <ArrowRight className="ml-2 h-4 w-4" />
                    </a>
                  </Button>
                </div>
              </div>
              <div className="relative group hover-border-snake rounded-2xl">
                <span></span><span></span><span></span><span></span>
                <div className="rounded-2xl border border-white/20 overflow-hidden shadow-2xl hover:shadow-violet-500/20 transition-all duration-500 bg-black/5">
                  <img
                    src="/static/images/product-keyword-autopilot.png"
                    alt="Keyword Autopilot Interface"
                    className="w-full h-auto object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What We Offer */}
      <section id="services" className="py-32 px-6 bg-background">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-5xl font-bold text-primary mb-6">What We Offer</h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Our comprehensive service portfolio covers every aspect of AI automation, from initial strategy to production deployment and ongoing optimization.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: Cloud, title: "Digital Transformation", desc: "Modernize legacy systems, migrate to cloud, and build digital foundations that enable AI automation. Transform paper-based processes into intelligent operations." },
              { icon: Search, title: "Process Analysis & Mapping", desc: "We analyze your current workflows, identify bottlenecks, and map out opportunities for intelligent automation." },
              { icon: Bot, title: "AI Agent Development", desc: "Custom AI agents tailored to your specific business needs, from document processing to customer service automation." },
              { icon: Settings, title: "System Integration", desc: "Seamless integration with your existing tools and platforms, ensuring minimal disruption to current operations." },
              { icon: BarChart3, title: "Performance Monitoring", desc: "Comprehensive monitoring and analytics to track performance, identify issues, and optimize results continuously." },
              { icon: Rocket, title: "Deployment & Support", desc: "End-to-end deployment with ongoing support and maintenance to ensure your systems run smoothly in production." }
            ].map((item, i) => (
              <div key={i} className="group p-8 rounded-2xl bg-card border border-border hover:border-primary/20 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-1 transition-all duration-300">
                <div className="w-12 h-12 bg-primary/5 rounded-xl flex items-center justify-center mb-6 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                  <item.icon className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-4 group-hover:text-primary transition-colors">{item.title}</h3>
                <p className="text-muted-foreground leading-relaxed text-[15px]">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section >

      {/* Proven Results */}
      <section id="results" className="py-24 px-6 bg-secondary/30">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-6">Proven Results in Production</h2>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-semibold border border-primary/20">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              Real case studies from live operations
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: Building2,
                title: "CCID Digital Transformation",
                desc: "Migrated paper-based processes to cloud automation with hybrid teams running full operations.",
                industry: "Government",
                results: ["Paper → Automated", "2 people + 7 agents", "Smart city insights"]
              },
              {
                icon: Leaf,
                title: "Heineken Sustainability",
                desc: "Real-time environmental impact monitoring across global manufacturing operations.",
                industry: "Manufacturing",
                results: ["Real-time dashboards", "Automated compliance", "Value chain optimized"]
              },
              {
                icon: Building,
                title: "MRI Property Tech",
                desc: "Streamlined property management workflows with intelligent automation systems.",
                industry: "Property Tech",
                results: ["Reduced manual work", "Faster processing", "Better accuracy"]
              },
              {
                icon: Settings2,
                title: "DevOps Pipeline",
                desc: "Intelligent CI/CD pipelines with automated testing and deployment systems.",
                industry: "Technology",
                results: ["Zero-downtime deploys", "Automated testing", "Faster releases"]
              },
              {
                icon: Smartphone,
                title: "Retail Notifications",
                desc: "Smart customer engagement platform with personalized messaging and timing.",
                industry: "Retail",
                results: ["Higher engagement", "Personalized experience", "Automated campaigns"]
              },
              {
                icon: Activity,
                title: "Healthcare Processing",
                desc: "Automated medical document classification and processing system.",
                industry: "Healthcare",
                results: ["95% accuracy", "Instant processing", "Compliance assured"]
              }
            ].map((item, i) => (
              <div key={i} className="bg-card border border-border rounded-xl p-6 hover:border-primary/20 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-1 transition-all duration-300 flex flex-col h-full">
                <div className="mb-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 rounded-lg bg-primary/5 text-primary">
                      <item.icon className="h-5 w-5" />
                    </div>
                    <div className="text-xs font-bold text-primary/70 uppercase tracking-wider">{item.industry}</div>
                  </div>
                  <h3 className="text-lg font-bold text-foreground mb-2 leading-tight">{item.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-4">{item.desc}</p>
                </div>

                <div className="mt-auto pt-4 border-t border-border/50">
                  <div className="text-xs font-semibold text-primary uppercase tracking-wider mb-2">Key Results</div>
                  <ul className="space-y-1.5">
                    {item.results.map((result, r) => (
                      <li key={r} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-1.5 shrink-0" />
                        <span className="text-[13px]">{result}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section >

      {/* Our Values */}
      < section className="py-32 px-6 bg-secondary/30 border-t border-border" >
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-primary mb-6">Our Values</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              The principles that guide our work, our partnerships, and the systems we build.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                icon: Zap,
                title: "Innovation",
                desc: "We constantly push the boundaries of what's possible with AI and automation, turning cutting-edge technology into practical business value."
              },
              {
                icon: ShieldCheck,
                title: "Integrity",
                desc: "We build trust through transparency, honesty, and ethical practices. We believe in systems that are auditable, secure, and reliable."
              },
              {
                icon: Users,
                title: "Collaboration",
                desc: "We believe in the power of working together. Our agents don't replace humans; they amplify human potential and enable better teamwork."
              },
              {
                icon: Star,
                title: "Excellence",
                desc: "We strive for the highest quality in everything we do, from the code we write to the operational outcomes we deliver for our clients."
              }
            ].map((item, i) => (
              <div key={i} className="flex flex-col md:flex-row items-start gap-6 p-8 rounded-2xl bg-card border border-border hover:border-primary/20 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-1 transition-all duration-300">
                <div className="p-4 rounded-full bg-primary/5 text-primary shrink-0 ring-1 ring-primary/10">
                  <item.icon className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-primary mb-2">{item.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section >

      {/* Leadership Team */}
      < section className="py-32 px-6 bg-background border-t border-border" >
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary text-secondary-foreground text-sm font-semibold mb-8">
              Product company. Enterprise focus.
            </div>
            <h2 className="text-3xl md:text-5xl font-bold text-primary mb-8">Leadership Team</h2>
            <p className="text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto">
              Chase Continental builds platform software for organisations that want to scale operations without scaling complexity. We productise repeatable work so teams move faster with more control.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 max-w-4xl mx-auto">
            {/* Charles */}
            <div className="group relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-3xl blur opacity-25 group-hover:opacity-75 transition duration-500"></div>
              <div className="relative bg-card border border-border rounded-2xl p-8 h-full flex flex-col">
                <div className="flex items-center gap-6 mb-6">
                  <div className="relative h-24 w-24 rounded-full overflow-hidden border-2 border-primary/10 shrink-0">
                    <img
                      src="/static/images/team/charles.png"
                      alt="Charles K. Chirongoma"
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-primary">Charles K. Chirongoma</h3>
                    <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">CEO, Implementation & Consulting</p>
                  </div>
                </div>
                <p className="text-muted-foreground leading-relaxed mb-6 flex-grow">
                  Economist and management consultant turned CEO. Leads digital transformation initiatives and specializes in identifying optimal AI applications, process mapping, and business intelligence optimization that drives measurable outcomes.
                </p>
                <div className="flex gap-4 mt-auto pt-6 border-t border-border/50">
                  <a href="https://www.linkedin.com/in/charles-k-chirongoma-41327716b/" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                    <Linkedin className="h-5 w-5" />
                  </a>
                  <a href="https://x.com/tue_sday" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                    <Twitter className="h-5 w-5" />
                  </a>
                </div>
              </div>
            </div>

            {/* Caleb */}
            <div className="group relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-secondary/20 to-primary/20 rounded-3xl blur opacity-25 group-hover:opacity-75 transition duration-500"></div>
              <div className="relative bg-card border border-border rounded-2xl p-8 h-full flex flex-col">
                <div className="flex items-center gap-6 mb-6">
                  <div className="relative h-24 w-24 rounded-full overflow-hidden border-2 border-primary/10 shrink-0">
                    <img
                      src="/static/images/team/caleb.jpg"
                      alt="Caleb Sakala"
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-primary">Caleb Sakala</h3>
                    <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">CTO, Product & Engineering</p>
                  </div>
                </div>
                <p className="text-muted-foreground leading-relaxed mb-6 flex-grow">
                  Full-stack engineer and early AI mover who heads up product and engineering. Led multiple engineering teams, shipped multiple SaaS products, and built platforms competing against Lovable.
                </p>
                <div className="flex gap-4 mt-auto pt-6 border-t border-border/50">
                  <a href="https://www.linkedin.com/in/calebsakala" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                    <Linkedin className="h-5 w-5" />
                  </a>
                  <a href="https://x.com/bytecaleb" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                    <Twitter className="h-5 w-5" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section >

      {/* CTA Section */}
      <section className="py-32 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-primary/5"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background"></div>

        <div className="container mx-auto max-w-4xl text-center relative z-10">
          <h2 className="text-4xl md:text-6xl font-bold text-primary mb-8">Ready to unlock capacity?</h2>
          <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto">
            See how Chase Agents can standardise core work, speed up delivery, and improve operational control.
          </p>
          <Button
            onClick={scrollToBooking}
            size="lg"
            variant="outline"
            className="hover-border-swipe text-lg px-12 h-16 rounded-full font-bold border-2 border-primary text-primary transition-all cursor-pointer group shadow-lg shadow-primary/10"
          >
            Book a Demo
            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card text-muted-foreground py-16 px-6 border-t border-border">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div className="col-span-2">
              <div className="flex items-center gap-3 mb-6">
                <img
                  src="/static/images/chasecontinental-logo.png"
                  alt="Chase Continental"
                  className="h-10 w-auto grayscale hover:grayscale-0 transition-all"
                />
                <span className="text-sm font-bold tracking-wide text-primary">CHASE CONTINENTAL</span>
              </div>
              <p className="max-w-sm text-sm leading-relaxed">
                Building platform software that changes the way people work.
              </p>
            </div>
            <div>
              <h4 className="text-primary font-bold mb-6">Legal</h4>
              <ul className="space-y-3 text-sm">
                <li><Link to="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-primary font-bold mb-6">Connect</h4>
              <ul className="space-y-3 text-sm">
                <li><a href="https://www.linkedin.com/company/chase-continental" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">LinkedIn</a></li>
                <li><a href="mailto:charles@chasecontinental.com" className="hover:text-primary transition-colors">Email Us</a></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-border text-center text-sm flex flex-col md:flex-row justify-between items-center gap-4">
            <p>© {new Date().getFullYear()} Chase Continental. All rights reserved.</p>
            <div className="flex gap-4">
              {/* Social Icons could go here */}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
