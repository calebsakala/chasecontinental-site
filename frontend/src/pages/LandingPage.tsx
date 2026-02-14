import { Button } from '@/components/ui/button';
import {
  ArrowRight,
  CheckCircle2,
  Zap,
  Twitter,
  Cloud,
  Search,
  Bot,
  Settings,
  BarChart3,
  Rocket,
  Building2,
  Leaf,
  Building,
  Users,
  Star,
  Linkedin,
  ShieldCheck
} from 'lucide-react';
import { useState } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

const LandingPage = () => {
  const [hoveredResult, setHoveredResult] = useState<number | null>(null);

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
      <Header variant="transparent" />

      {/* Hero Section */}
      <header id="top" className="relative pt-40 pb-24 px-6 z-10">
        <div className="container mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/5 border border-primary/10 text-primary text-xs font-bold tracking-wide mb-8 hover:bg-primary/10 transition-colors cursor-default">
                <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                WE ARE AN AFRICAN ENTERPRISE AI STUDIO
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-primary mb-6 leading-tight">
                Building software that changes the way people work.
              </h1>

              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed mb-8 max-w-xl">
                Unlocking hidden capacity. Building tomorrow's organisations today with product-first platforms designed for real operations.
              </p>



              <div className="flex flex-col sm:flex-row gap-4 mb-12">
                <Button
                  onClick={scrollToBooking}
                  size="lg"
                  className="hover-border-swipe text-lg px-8 h-14 rounded-full font-semibold bg-transparent text-primary border-2 border-primary shadow-lg shadow-primary/20 transition-all cursor-pointer hover:-translate-y-0.5"
                >
                  Book a Free Consultation
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
                <svg className="snake-svg">
                  <rect pathLength="100" className="snake-svg-rect snake-variant-thick" />
                </svg>
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
                    className="hover-border-swipe rounded-full bg-transparent text-primary border-2 border-primary shadow-lg shadow-primary/20"
                    asChild
                  >
                    <a href="https://chaseagents.com" target="_blank" rel="noopener noreferrer">
                      Deploy Agents <ArrowRight className="ml-2 h-4 w-4" />
                    </a>
                  </Button>
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
              <div key={i} className="group relative hover-border-snake p-8 rounded-2xl bg-card border border-border hover:shadow-lg transition-all duration-300">
                <svg className="snake-svg">
                  <rect pathLength="100" className="snake-svg-rect snake-variant-thin-2xl" />
                </svg>
                <div className="w-12 h-12 bg-primary/5 rounded-xl flex items-center justify-center mb-6 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300 relative z-10">
                  <item.icon className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-4 group-hover:text-primary transition-colors relative z-10">{item.title}</h3>
                <p className="text-muted-foreground leading-relaxed text-[15px] relative z-10">{item.desc}</p>
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
                results: ["100% Paperless Transition", "350% Efficiency Increase", "Real-time City Insights"]
              },
              {
                icon: Leaf,
                title: "Heineken Sustainability",
                desc: "Real-time environmental impact monitoring across global manufacturing operations.",
                industry: "Manufacturing",
                results: ["Global Real-time Monitoring", "100% Automated Compliance", "15% Supply Chain Optimization"]
              },
              {
                icon: Building,
                title: "MRI Property Tech",
                desc: "Streamlined property management workflows with intelligent automation systems.",
                industry: "Property Tech",
                results: ["40% Reduction in Manual Work", "2x Faster Lease Processing", "99.9% Data Accuracy"]
              }
            ].map((item, i) => {
              const isOtherActive = hoveredResult !== null && hoveredResult !== i;

              return (
                <div
                  key={i}
                  className={`bg-card group relative hover-border-snake border border-border rounded-xl p-6 hover:shadow-lg transition-all duration-500 flex flex-col h-full overflow-hidden ${isOtherActive ? 'border-primary/5' : ''}`}
                  onMouseEnter={() => setHoveredResult(i)}
                  onMouseLeave={() => setHoveredResult(null)}
                >
                  <svg className="snake-svg">
                    <rect pathLength="100" className="snake-svg-rect snake-variant-thin-xl" />
                  </svg>

                  {/* Normal Content - Fades out but keeps space */}
                  <div className={`flex flex-col h-full transition-opacity duration-500 ${isOtherActive ? 'opacity-0' : 'opacity-100'}`}>
                    <div className="mb-4 relative z-10">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 rounded-lg bg-primary/5 text-primary">
                          <item.icon className="h-5 w-5" />
                        </div>
                        <div className="text-xs font-bold text-primary/70 uppercase tracking-wider">{item.industry}</div>
                      </div>
                      <h3 className="text-lg font-bold text-foreground mb-2 leading-tight">{item.title}</h3>
                      <p className="text-muted-foreground text-sm leading-relaxed mb-4">{item.desc}</p>
                    </div>

                    <div className="mt-auto pt-4 border-t border-border/50 relative z-10">
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

                  {/* Overlay Content - Fades in absolute on top */}
                  <div
                    className={`absolute inset-0 z-20 flex flex-col justify-center items-center p-6 text-center bg-card transition-all duration-500 ${isOtherActive ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}
                  >
                    <div className="p-3 rounded-full bg-primary/10 text-primary mb-6 ring-1 ring-primary/20">
                      <item.icon className="h-8 w-8" />
                    </div>
                    <div className="text-sm font-bold text-primary uppercase tracking-wider mb-6">Key Results</div>
                    <ul className="space-y-4 w-full">
                      {item.results.map((result, r) => (
                        <li key={r} className="flex items-center justify-center gap-3 text-foreground font-medium">
                          <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0" />
                          <span>{result}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })}
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
              <div key={i} className="flex flex-col md:flex-row items-start gap-6 p-8 rounded-2xl bg-card border border-border relative group hover-border-snake hover:shadow-lg transition-all duration-300">
                <svg className="snake-svg">
                  <rect pathLength="100" className="snake-svg-rect snake-variant-thin-2xl" />
                </svg>
                <div className="p-4 rounded-full bg-primary/5 text-primary shrink-0 ring-1 ring-primary/10 relative z-10">
                  <item.icon className="h-6 w-6" />
                </div>
                <div className="relative z-10">
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
              <div className="relative bg-card border border-border hover-border-snake rounded-2xl p-6 sm:p-8 h-full flex flex-col">
                <svg className="snake-svg">
                  <rect pathLength="100" className="snake-svg-rect snake-variant-thin-2xl" />
                </svg>
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6 mb-6 text-center sm:text-left">
                  <div className="relative h-24 w-24 rounded-full overflow-hidden border-2 border-primary/10 shrink-0">
                    <img
                      src="/static/images/team/charles.png"
                      alt="Charles K. Chirongoma"
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-primary min-h-[4rem] flex items-center sm:items-start justify-center sm:justify-start">Charles K. Chirongoma</h3>
                    <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wide group-hover:text-[#D4AF37] transition-colors min-h-[2.5rem]">CEO, Implementation & Consulting</p>
                  </div>
                </div>
                <p className="text-muted-foreground leading-relaxed mb-6 flex-grow text-center sm:text-left">
                  Economist turned CEO leading high-stakes digital transformation. He specializes in strategic process mapping and AI implementation to drive measurable operational excellence.
                </p>
                <div className="flex gap-4 mt-auto pt-6 border-t border-border/50 bg-card relative z-10 justify-center sm:justify-start">
                  <a href="https://www.linkedin.com/in/charles-k-chirongoma-41327716b/" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-[#D4AF37] group-hover:text-[#D4AF37] transition-colors duration-500">
                    <Linkedin className="h-5 w-5 fill-transparent group-hover:fill-current transition-all duration-500" />
                  </a>
                  <a href="https://x.com/tue_sday" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-[#D4AF37] group-hover:text-[#D4AF37] transition-colors duration-500">
                    <Twitter className="h-5 w-5 fill-transparent group-hover:fill-current transition-all duration-500" />
                  </a>
                </div>
              </div>
            </div>

            {/* Caleb */}
            <div className="group relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-secondary/20 to-primary/20 rounded-3xl blur opacity-25 group-hover:opacity-75 transition duration-500"></div>
              <div className="relative bg-card border border-border hover-border-snake rounded-2xl p-6 sm:p-8 h-full flex flex-col">
                <svg className="snake-svg">
                  <rect pathLength="100" className="snake-svg-rect snake-variant-thin-2xl" />
                </svg>
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6 mb-6 text-center sm:text-left">
                  <div className="relative h-24 w-24 rounded-full overflow-hidden border-2 border-primary/10 shrink-0">
                    <img
                      src="/static/images/team/caleb.jpg"
                      alt="Caleb Sakala"
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-primary min-h-[4rem] flex items-center sm:items-start justify-center sm:justify-start">Caleb Sakala</h3>
                    <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wide group-hover:text-[#D4AF37] transition-colors min-h-[2.5rem]">CTO, Product & Engineering</p>
                  </div>
                </div>
                <p className="text-muted-foreground leading-relaxed mb-6 flex-grow text-center sm:text-left">
                  Visionary AI Product Engineer who led global AI & software initiatives across the US, Brazil, and Cyprus before his 21st birthday. He has collaborated with elite talent from Meta, Google, and Anthropic to deliver world-class AI solutions.
                </p>
                <div className="flex gap-4 mt-auto pt-6 border-t border-border/50 bg-card relative z-10 justify-center sm:justify-start">
                  <a href="https://www.linkedin.com/in/calebsakala" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-[#D4AF37] group-hover:text-[#D4AF37] transition-colors duration-500">
                    <Linkedin className="h-5 w-5 fill-transparent group-hover:fill-current transition-all duration-500" />
                  </a>
                  <a href="https://x.com/bytecaleb" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-[#D4AF37] group-hover:text-[#D4AF37] transition-colors duration-500">
                    <Twitter className="h-5 w-5 fill-transparent group-hover:fill-current transition-all duration-500" />
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
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default LandingPage;
