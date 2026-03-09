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
  Users,
  Star,
  Linkedin,
  ShieldCheck
} from 'lucide-react';
import { useState, useEffect, useRef} from 'react';
import { Link } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const LandingPage = () => {
  const [hoveredResult, setHoveredResult] = useState<number | null>(null);

  const scrollToBooking = () => {
    window.open('https://calendar.app.google/8oZYnnuHcaiH64Ky8', '_blank');
  };

  const sectionRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {

      // ===== HERO SECTION =======
      const tH = gsap.timeline({
        scrollTrigger: {
          trigger: "#heroSection",
          start: "top 80%",
          toggleActions: "play none none none",
        },
      });

      const heroItems = [
        ".hero-pill",
        ".hero-heading",
        ".hero-button",
        ".hero-line",
        ".hero-subheading",
        ".hero1",
        ".hero2",
        ".hero-glass",
      ];

      let delay = 0.5; // initial offset

      heroItems.forEach((item) => {
        tH.from(item, {
          x: -50,
          scale: 0.9,
          opacity: 0,
          duration: 1.3,
          ease: "power2.out",
        }, `+${delay}`); // position parameter
        delay += 0.3; // increment for next item
      });

      // ===== SCROLLBAR + HEADINGS + IMAGES SECTION =====
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          toggleActions: "play none none none",
        },
      });

      // Grey scroll bar
      tl.fromTo(
        "#scrollGreyBar",
        { scaleY: 0, transformOrigin: "top" },
        {
          scaleY: 1,
          duration: 1.5,
          ease: "power2.out",
        }
      );

      // Headings
      tl.from(".heading-slide1", {
        y: 50,
        scale: 0.9,
        opacity: 0,
        duration: 1,
        ease: "power2.out",
      },
        "+0.5"
      );

      tl.from(".heading-slide2", {
        y: 50,
        scale: 0.9,
        opacity: 0,
        duration: 1,
        ease: "power2.out",
      },
        "+0.7"
      );

      // Images
      tl.from(".image-fill", {
        x: 50,
        clipPath: "inset(100% 0% 0% 0%)",
        opacity: 0,
        duration: 1,
        stagger: 0.1,
        ease: "power2.out",
      },
        "+1"
      );

      // Text under images
      tl.from(
        ".text-slide-fade",
        {
          x: 50,
          opacity: 0,
          duration: 2,
          stagger: 0.2,
          ease: "power2.out",
        },
        "<"
      );

      // ===== STATS SECTION =====
     const statsCards = gsap.utils.toArray<HTMLElement>("#statsSection .stat-card");
     const tStats = gsap.timeline({
      scrollTrigger: {
        trigger: "#statsSection",
        start: "top 80%",
        toggleActions: "play none none none",
      },
    });

    // Animate cards one by one sequentially
    const delays = [0, 0.3, 0.5]; // seconds for each card
    statsCards.forEach((card, i) => {
      tStats.from(card, {
        scale: 0.75,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
      }, delays[i]); // use the delay for each card
    });

      // ===== Products section =======
      const tp = gsap.timeline({
        scrollTrigger: {
          trigger: "#products",
          start: "top 80%",
          toggleActions: "play none none none",
        },
      });

      // 1 H2 heading
      tp.from(".products-heading", {
        y: 50,
        scale: 0.9,
        opacity: 0,
        duration: 1,
        ease: "power2.out",
      });

      // 2 Paragraph under H2
      tp.from(".products-subheading", {
        y: 50,
        scale: 0.9,
        opacity: 0,
        duration: 1,
        ease: "power2.out",
      }, "+0.3");

      // 3 Flagship Platform pill
      tp.from(".products-pill", { 
        y: 50, 
        scale: 0.9, 
        opacity: 0, 
        duration: 1, 
        ease: "power2.out" 
      }, "+0.5");

      // 4 Product image
      tp.from(".products-image-fill", {
        x: 50,
        clipPath: "inset(100% 0% 0% 0%)",
        opacity: 0,
        duration: 1,
        ease: "power2.out",
      }, "+0.7");

      // 5 H3 heading (product title)
      tp.from(".products-text-heading", {
        y: 50,
        scale: 0.9,
        opacity: 0,
        duration: 1,
        ease: "power2.out",
      }, "+1");

      // 6 Paragraph under H3 (product description)
      tp.from(".products-text-subheading", {
        y: 50,
        scale: 0.9,
        opacity: 0,
        duration: 1,
        ease: "power2.out",
      }, "+1.3");

      // 7 Button slide-up only
      tp.from(".products-button", {
        y: 50,
        opacity: 0,
        duration: 1,
        ease: "power2.out",
      }, "+1.5");

      // ===== SERVICES SECTION ANIMATION =====
      const tO = gsap.timeline({
        scrollTrigger: {
          trigger: "#services",
          start: "top 80%",
          toggleActions: "play none none none",
        },
      });

      // 1 Heading
      tO.from(".services-heading", {
        y: 50,
        scale: 0.9,
        opacity: 0,
        duration: 1,
        ease: "power2.out",
      }, "+0.3");

      // 2 Subheading
      tO.from(".services-subheading", {
        y: 50,
        scale: 0.9,
        opacity: 0,
        duration: 1,
        ease: "power2.out",
      }, "+0.5");

      // 3 Cards: zoom-in only, no slide
      // Order: top-left → top-middle → top-right → bottom-left → bottom-middle → bottom-right
      const serviceCards = gsap.utils.toArray<HTMLElement>("#services .services-card");
      const cardOrder = [0, 1, 2, 3, 4, 5]; // match your grid order
      const delaysO = [1, 1.3, 1.5, 1.7, 2, 2.3]; // seconds for each card

      cardOrder.forEach((i) => {
        tO.from(serviceCards[i], {
          scale: 0.75,
          opacity: 0,
          duration: 0.7,
          ease: "power3.out",
        }, delaysO[i]);
      });

      // ===== RESULTS SECTION =======
      const tR = gsap.timeline({
        scrollTrigger: {
          trigger: "#results",
          start: "top 80%",
          toggleActions: "play none none none",
        },
      });

      // 1 heading
      tR.from(".results-heading", {
        y: 50,
        scale: 0.9,
        opacity: 0,
        duration: 1,
        ease: "power2.out",
      });

      // 2 pill
      tR.from(".results-pill", { 
        y: 50, 
        scale: 0.9, 
        opacity: 0, 
        duration: 1, 
        ease: "power2.out" 
      });

      const resultsCards = gsap.utils.toArray<HTMLElement>("#results .results-card");
      // Animate cards one by one sequentially
      resultsCards.forEach((card) => {
        tR.from(card, {
          scale: 0.75,
          opacity: 0,
          duration: 0.7,
          ease: "power3.out",
        }, ">");
      });

      // ===== VALUES SECTION =======
      const tV = gsap.timeline({
        scrollTrigger: {
          trigger: "#values",
          start: "top 80%",
          toggleActions: "play none none none",
        },
      });

      // 1 heading
      tV.from(".values-heading", {
        y: 50,
        scale: 0.9,
        opacity: 0,
        duration: 1,
        ease: "power2.out",
      });

      // 2 subheading
      tV.from(".values-subheading", {
        y: 50,
        scale: 0.9,
        opacity: 0,
        duration: 1,
        ease: "power2.out",
      });

      const valuesCards = gsap.utils.toArray<HTMLElement>("#values .values-card");
      // Animate cards one by one sequentially
      valuesCards.forEach((card) => {
        tV.from(card, {
          scale: 0.75,
          opacity: 0,
          duration: 0.7,
          ease: "power3.out",
        }, ">");
      });

      // ===== LEADERSHIP SECTION =======
      const tL = gsap.timeline({
        scrollTrigger: {
          trigger: "#leadership",
          start: "top 80%",
          toggleActions: "play none none none",
        },
      });

      // 1 pill
      tL.from(".leadership-pill", { 
        y: 50, 
        scale: 0.9, 
        opacity: 0, 
        duration: 1, 
        ease: "power2.out" 
      });

      // 2 heading
      tL.from(".leadership-heading", {
        y: 50,
        scale: 0.9,
        opacity: 0,
        duration: 1,
        ease: "power2.out",
      });

      // 3 subheading
      tL.from(".leadership-subheading", {
        y: 50,
        scale: 0.9,
        opacity: 0,
        duration: 1,
        ease: "power2.out",
      });

      // 4 cards
      const leadershipCards = gsap.utils.toArray<HTMLElement>("#leadership .leadership-card");
      // Animate cards one by one sequentially
      leadershipCards.forEach((card) => {
        tL.from(card, {
          scale: 0.75,
          opacity: 0,
          duration: 0.7,
          ease: "power3.out",
        }, ">");
      });

      // ===== CTA SECTION =======
      const tCTA = gsap.timeline({
        scrollTrigger: {
          trigger: "#cta",
          start: "top 80%",
          toggleActions: "play none none none",
        },
      });

      // 1 H2 heading
      tCTA.from(".cta-heading", {
        y: 50,
        scale: 0.9,
        opacity: 0,
        duration: 1,
        ease: "power2.out",
      });

      // 2 Paragraph under H2
      tCTA.from(".cta-subtext", {
        y: 50,
        scale: 0.9,
        opacity: 0,
        duration: 1,
        ease: "power2.out",
      });

      // 3 Button slide-up only
      tCTA.from(".cta-button", {
        y: 50,
        opacity: 0,
        duration: 1,
        ease: "power2.out",
      });

    });

    return () => ctx.revert();
  }, []);

  const cards = [
    {
      img: "src/assets/Group 1.svg",
      title: "Legacy Workflows",
      desc: "Paper-based processes, siloed teams, and manual coordination slow down delivery and hide real capacity.",
    },
    {
      img: "src/assets/Group 4.svg",
      title: "Digital Foundations",
      desc: "We migrate operations to cloud platforms that standardise work, centralise data, and create visibility.",
    },
    {
      img: "src/assets/Group 14.svg",
      title: "Autonomous Execution",
      desc: "AI agents execute repeatable work with precision — monitored, observable, and production-ready.",
    },
  ];


  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/15 selection:text-primary overflow-x-hidden">

      {/* Navigation */}
      <Header variant='transparent'/>

      {/* HERO SECTION */}
      <section id="heroSection" className="relative h-[100vh]">
        <div className="sticky top-0 h-screen flex flex-col justify-center overflow-hidden">

          {/* Sticky Background Image */}
          <img
            src="src/assets/background-circuit.png"
            className="absolute inset-0 w-full h-full object-cover"
          />

          {/* Dark overlay for readability */}
          <div className="absolute inset-0 bg-black/49 z-1"></div>

          <div className="relative z-10 w-full max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">

            {/* LEFT SIDE */}
            <div>
              {/*pill*/}
              <div className="hero-pill gradient-border bg-blur inline-block mb-6 text-white"
              style={{
                  "--gb-angle": "137deg",
                  "--gb-radius": "9999px",
                  padding: "0.5rem 1.5rem",
                  background: "rgba(255,255,255,0.05)", 
                  backdropFilter: "blur(12px)",
                } as React.CSSProperties}>
                WE ARE AN AI ENTERPRISE STUDIO
              </div>

              <h1 className="hero-heading relative inline-block text-5xl lg:text-6xl font-bold mb-6 leading-tight text-white">
                {/* Black blur only behind text */}
                <span className="absolute inset-0 bg-black blur-3xl rounded-xl -z-10"></span>
                Building software that changes the way people work.
              </h1>

              {/* Original Button Container */}
              <div className="hero-button flex flex-col sm:flex-row gap-4 mb-12">
                <Button
                  onClick={scrollToBooking}
                  size="lg"
                  className="hover-border-swipe text-lg px-8 h-14 rounded-full font-semibold bg-transparent text-white border-2 border-primary shadow-lg shadow-[#85FBFE]/50 transition-all cursor-pointer hover:-translate-y-0.5"
                >
                  Book a Free Consultation
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>

              {/* TRUSTED BY STRIP */}
              <div className="pt-8">
                <div className="hero-line border-t border-border/60 text-white w-full max-w-md mb-8"></div>
                <p className="hero-subheading text-xs font-semibold text-white uppercase tracking-wider mb-4">
                  Trusted by industry leaders
                </p>
                <div className="flex flex-wrap gap-x-8 gap-y-4 items-center opacity-70">
                  <div className="hero1 flex items-center gap-2 font-bold text-lg text-white">
                    <Building2 className="h-5 w-5" /> CCID
                  </div>
                  <div className="hero2 flex items-center gap-2 font-bold text-lg text-white">
                    <Leaf className="h-5 w-5" /> Heineken
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT GLASS CARD */}
            <div className="flex justify-center">
              <div className="hero-glass gradient-border backdrop-blur-xl bg-white/5 rounded-3xl p-10 max-w-md text-center shadow-[0_0_60px_rgba(255,255,255,0.05)]"
               style={{
                  "--gb-angle": "137deg",
                  "--gb-radius": "1.5rem",
                } as React.CSSProperties}>
                <p className="text-xl text-white/80 leading-relaxed">
                  Unlocking hidden capacity. Building tomorrow's organisations today with product-first platforms designed for real operations.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      <div className="relative overflow-hidden">
      {/* Sticky Background Image */}
      <img
        src="src/assets/background-circuit-middle5.png"
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Dark overlay for readability */}
      <div className="absolute inset-0 bg-black/37"></div>

      {/* GREY SCROLL BAR */}
      <div
        id="scrollGreyBar"
        className="w-full h-[200px] bg-gray-300 origin-top scale-y-0 mb-15"
      />

      <section ref={sectionRef} id="mainSection" className="mt-[-200px] pb-32 bg-white">
        <div className="max-w-[calc(100%-200px)] mx-auto px-6 lg:px-0 grid lg:grid-cols-2 items-start gap-6">
          {/* LEFT — Headings */}
          <div className="space-y-3">
            <h4 className="heading-slide1 text-[24px] font-semibold text-gray-500 uppercase">
              Unlock
            </h4>
            <h2 className="heading-slide2 text-3xl md:text-2xl font-bold">
              Hidden Capacity
            </h2>
          </div>
          {/* RIGHT — Cards */}
          <div className="ml-[-250px] flex flex-col sm:flex-col lg:flex-row gap-3">
            {cards.map((card, i) => (
              <div key={i} className="flex-1 min-w-0 flex flex-col space-y-3 h-full">
                <div className="gradient-border image-fill relative rounded-[5px] overflow-hidden h-full flex-shrink-0 shadow-[0_0_0_1px_black]">
                  <img
                    src={card.img}
                    alt={card.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="text-slide-fade mt-4 relative inline-block">
                  {/* Blue blur behind text only */}
                  <span className="absolute inset-0 bg-black blur-3xl rounded-xl -z-10"></span>
                  <h3 className="text-[26px] text-white font-bold mb-4">{card.title}</h3>
                  <p className="text-[18px] text-[#d1d5da]">{card.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      </div>

      {/* Stats / Intro Section */}
      <section id="statsSection" className="py-30 px-6 bg-black text-white">
        <div className="container mx-auto max-w-5xl text-center">
          <div className="grid md:grid-cols-3 gap-6 md:gap-12">
            {[
              { number: "100+", label: "Processes Automated" },
              { number: "3 years", label: "Industry Experience" },
              { number: "98%", label: "Uptime Achieved" },
            ].map((stat, i) => (
              <div
                key={i}
                className="stat-card gradient-border rounded-[1.5rem] p-6 flex flex-col items-center justify-center min-h-[175px] w-full md:w-auto text-center"
                style={{
                  "--gb-angle": "75deg",
                  "--gb-radius": "1.5rem",
                  background: `linear-gradient(
                    135deg,
                    rgba(255, 255, 255, 0.17) 0%,
                    rgba(255, 255, 255, 0.09) 30%,
                    rgba(255, 255, 255, 0.14) 70%,
                    rgba(255, 255, 255, 0.19) 100%
                  )`,
                  backdropFilter: "blur(12px)",
                  WebkitBackdropFilter: "blur(12px)",
                } as React.CSSProperties}
              >
                <div className="text-3xl font-bold mt-3">{stat.number}</div>
                <div className="mt-2 text-sm font-medium text-primary-foreground/70 text-center">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Products */}
      <section id="products" className="py-32 px-6 border-y border-border/50 relative">
        {/* Sticky Background Image */}
        <img
          src="src/assets/background-circuit-middle.png"
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Dark overlay for readability */}
        <div className="absolute inset-0 bg-black/37"></div>

        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-20">
            <h2 className="products-heading text-3xl text-white md:text-5xl font-bold mb-6">Our Products</h2>
            <p className="products-subheading text-lg text-[#d1d5da] max-w-3xl mx-auto">
              Powerful, product-first platforms designed to automate specific domains of your business with precision and scale.
            </p>
          </div>

          <div className="flex flex-col gap-24">
            {/* Chase Agents */}
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="order-2 lg:order-1 relative group">
                <div className="gradient-border relative rounded-2xl overflow-hidden products-image-fill"
                  style={{
                    "--gb-angle": "131deg",
                    "--gb-radius": "1.5rem",
                    borderWidth: "3px",
                  } as React.CSSProperties}
                >
                  <img
                    src="/static/images/product-chase-agents.png"
                    alt="Chase Agents Dashboard"
                    className="w-full h-auto object-cover"
                  />
                </div>
              </div>
              <div className="order-1 lg:order-2">
                <div className="products-pill gradient-border inline-block mb-6 text-white"
                  style={{
                    "--gb-angle": "191deg",
                    "--gb-radius": "9999px",
                    padding: "0.5rem 1.5rem",
                    background: `linear-gradient(
                      135deg,
                      rgba(255, 255, 255, 0.17) 0%,
                      rgba(255, 255, 255, 0.09) 30%,
                      rgba(255, 255, 255, 0.14) 70%,
                      rgba(255, 255, 255, 0.19) 100%
                    )`,
                    backdropFilter: "blur(12px)",
                  } as React.CSSProperties}
                >
                  FLAGSHIP PLATFORM
                </div>
                <h3 className="products-text-heading text-3xl md:text-4xl font-bold text-white mb-6">Chase Agents</h3>
                <p className="products-text-subheading text-lg text-[#d1d5da] leading-relaxed mb-8">
                  The Enterprise Standard for Agentic AI. Combine the creativity of LLMs with the precision of verified code. Deploy autonomous agents that execute complex enterprise workflows with zero hallucinations and full observability.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="products-button">
                    <Button
                      size="lg"
                      className="hover-border-swipe text-md px-8 h-14 rounded-full font-bold border-2 border-primary text-white transition-all cursor-pointer group shadow-lg shadow-[#85FBFE]/50 hover:-translate-y-0.5"
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
        </div>
      </section>

      {/* What We Offer */}
      <section id="services" className="py-32 px-6 border-y border-border/50 relative">
        {/* Background image */}
        <img
          src="src/assets/background-circuit-middle4.png"
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Dark overlay for readability */}
        <div className="absolute inset-0 bg-black/37"></div>

        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="text-center mb-20">
            <h2 className="services-heading text-3xl md:text-5xl font-bold text-white mb-6">What We Offer</h2>
            <p className="services-subheading text-lg text-[#d1d5da] max-w-3xl mx-auto">
              Our comprehensive service portfolio covers every aspect of AI automation, from initial strategy to production deployment and ongoing optimization.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: Cloud, title: "Digital Transformation", desc: "Modernize legacy systems, migrate to cloud, and build digital foundations that enable AI automation. Transform paper-based processes into intelligent operations.", angle: 137},
              { icon: Search, title: "Process Analysis & Mapping", desc: "We analyze your current workflows, identify bottlenecks, and map out opportunities for intelligent automation.", angle: 191},
              { icon: Bot, title: "AI Agent Development", desc: "Custom AI agents tailored to your specific business needs, from document processing to customer service automation.", angle: 59 },
              { icon: Settings, title: "System Integration", desc: "Seamless integration with your existing tools and platforms, ensuring minimal disruption to current operations.", angle: 237 },
              { icon: BarChart3, title: "Performance Monitoring", desc: "Comprehensive monitoring and analytics to track performance, identify issues, and optimize results continuously.", angle: 75 },
              { icon: Rocket, title: "Deployment & Support", desc: "End-to-end deployment with ongoing support and maintenance to ensure your systems run smoothly in production.", angle: 315 }
            ].map((item, i) => (
              <div
                key={i}
                className="services-card relative p-8 rounded-2xl gradient-border"
                style={{
                  "--gb-angle": `${item.angle}deg`,
                  "--gb-radius": "1.5rem",
                  background: `linear-gradient(
                    135deg,
                    rgba(255, 255, 255, 0.17) 0%,
                    rgba(255, 255, 255, 0.09) 30%,
                    rgba(255, 255, 255, 0.14) 70%,
                    rgba(255, 255, 255, 0.19) 100%
                  )`,
                  backdropFilter: "blur(12px)",
                  WebkitBackdropFilter: "blur(12px)",
                } as React.CSSProperties}
              >
                {/* Gradient-border pill for icon */}
                <div
                  className="gradient-border inline-block mb-6 text-white"
                  style={{
                    "--gb-angle": `${item.angle}deg`,
                    "--gb-radius": "0.75rem",
                    "--gb-color2": "rgba(255, 255, 255, 0.09)",
                    padding: "0.5rem 1rem",
                    background: `linear-gradient(
                      135deg,
                      rgba(255, 255, 255, 0.17) 0%,
                      rgba(255, 255, 255, 0.09) 30%,
                      rgba(255, 255, 255, 0.14) 70%,
                      rgba(255, 255, 255, 0.19) 100%
                    )`,
                    backdropFilter: "blur(12px)",
                  } as React.CSSProperties}
                >
                  <item.icon className="h-6 w-6 text-white" />
                </div>
                {/* Title & Description */}
                <h3 className="text-xl font-bold text-white mb-4">{item.title}</h3>
                <p className="text-[#d1d5da] leading-relaxed text-[15px]">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section >

      {/* Proven Results */}
      <section id="results" className="py-24 px-6 relative overflow-hidden">
        {/* Background image */}
        <img
          src="src/assets/background-circuit-middle3.png"
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Dark overlay for readability */}
        <div className="absolute inset-0 bg-black/37"></div>

        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="text-center mb-16">
            <h2 className="results-heading text-3xl md:text-4xl font-bold text-white mb-6">Proven Results in Production</h2>
            <div
              className="results-pill gradient-border inline-block mb-6 text-white"
              style={{
                "--gb-angle": "175deg",
                "--gb-radius": "9999px",
                padding: "0.5rem 1.5rem",
                background: `linear-gradient(
                  135deg,
                  rgba(255, 255, 255, 0.17) 0%,
                  rgba(255, 255, 255, 0.09) 30%,
                  rgba(255, 255, 255, 0.14) 70%,
                  rgba(255, 255, 255, 0.19) 100%
                )`,
                backdropFilter: "blur(12px)",
              } as React.CSSProperties}
            >
              REAL CASE STUDIES FROM LIVE OPERATIONS
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: Building2,
                title: "CCID Digital Transformation",
                desc: "Migrated paper-based processes to cloud automation with hybrid teams running full operations.",
                industry: "Government",
                results: ["100% Paperless Transition", "350% Efficiency Increase", "Real-time City Insights"],
                url: "/blog/case-study-building-practical-ai-capacity-with-the-ccid"
              },
              {
                icon: Leaf,
                title: "Heineken Sustainability",
                desc: "Real-time environmental impact monitoring across multi-regional operations.",
                industry: "Manufacturing",
                results: ["Multi-regional real-time monitoring", "100% automated reporting", "100% achievement of KPIs due to AI recommendations and business intelligence steering, next steps, and ensuring alignment"]
              }
            ].map((item, i) => {
              const isOtherActive = hoveredResult !== null && hoveredResult !== i;

              const cardContent = (
                <div
                  className={`results-card group relative gradient-border rounded-xl p-6 flex flex-col h-full overflow-hidden ${item.url ? 'cursor-pointer' : ''}`}
                  style={{
                    "--gb-angle": "13deg",
                    "--gb-radius": "1.5rem",
                    background: `linear-gradient(
                      135deg,
                      rgba(255, 255, 255, 0.17) 0%,
                      rgba(255, 255, 255, 0.09) 30%,
                      rgba(255, 255, 255, 0.14) 70%,
                      rgba(255, 255, 255, 0.19) 100%
                    )`,
                    backdropFilter: "blur(12px)",
                    WebkitBackdropFilter: "blur(12px)",
                  } as React.CSSProperties}
                  onMouseEnter={() => setHoveredResult(i)}
                  onMouseLeave={() => setHoveredResult(null)}
                >

                  {/* Normal Content - Fades out but keeps space */}
                  <div className={`flex flex-col h-full transition-opacity duration-500 ${isOtherActive ? 'opacity-0' : 'opacity-100'}`}>
                    <div className="mb-4 relative z-10">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 text-white gradient-border inline-block"
                          style={{
                            "--gb-angle": "13deg",
                            "--gb-radius": "0.75rem",
                            "--gb-color2": "rgba(255, 255, 255, 0.09)",
                            background: `linear-gradient(
                              135deg,
                              rgba(255, 255, 255, 0.17) 0%,
                              rgba(255, 255, 255, 0.09) 30%,
                              rgba(255, 255, 255, 0.14) 70%,
                              rgba(255, 255, 255, 0.19) 100%
                            )`,
                            backdropFilter: "blur(12px)",
                          } as React.CSSProperties}
                        >
                          <item.icon className="h-5 w-5" />
                        </div>
                        <div className="text-xs font-bold text-white uppercase tracking-wider">{item.industry}</div>
                      </div>
                      <h3 className="text-lg font-bold text-white mb-2 leading-tight">{item.title}</h3>
                      <p className="text-[#d1d5da] text-sm leading-relaxed mb-4">{item.desc}</p>
                    </div>

                    <div className="mt-auto pt-4 border-t text-white border-border/50 relative z-10">
                      <div className="text-xs font-semibold text-white uppercase tracking-wider mb-2">Key Results</div>
                      <ul className="space-y-1.5">
                        {item.results.map((result, r) => (
                          <li key={r} className="flex items-start gap-2 text-sm text-[#d1d5da]">
                            <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-1.5 shrink-0" />
                            <span className="text-[13px]">{result}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Overlay Content - Fades in absolute on top */}
                  <div
                    className={`absolute inset-0 z-20 flex flex-col justify-center items-center p-6 text-center backdrop-blur-md bg-card/95 border border-[#1e3a5f]/20 rounded-xl transition-all duration-500 ${isOtherActive ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}
                  >
                    <div className="p-3 rounded-full bg-primary/10 text-white mb-6 ring-1 ring-primary/20">
                      <item.icon className="h-8 w-8" />
                    </div>
                    <div className="text-sm font-bold text-white uppercase tracking-wider mb-6">Key Results</div>
                    <ul className="space-y-4 w-full">
                      {item.results.map((result, r) => (
                        <li key={r} className="flex items-center justify-center gap-3 text-[#d1d5da] font-medium">
                          <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0" />
                          <span>{result}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              );

              return item.url ? (
                <Link key={i} to={item.url} className="block h-full">
                  {cardContent}
                </Link>
              ) : (
                <div key={i} className="h-full">
                  {cardContent}
                </div>
              );
            })}
          </div>
        </div>
      </section >

      {/* Our Values */}
      <section id="values" className="py-32 px-6 relative overflow-hidden">
        {/* Background image */}
        <img
          src="src/assets/background-circuit-middle2.png"
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Dark overlay for readability */}
        <div className="absolute inset-0 bg-black/37"></div>

        <div className="container mx-auto max-w-5xl relative z-10">
          <div className="text-center mb-16">
            <h2 className="values-heading text-3xl font-bold text-white mb-6">Our Values</h2>
            <p className="values-subheading text-lg text-[#d1d5da] max-w-2xl mx-auto">
              The principles that guide our work, our partnerships, and the systems we build.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                icon: Zap,
                title: "Innovation",
                desc: "We constantly push the boundaries of what's possible with AI and automation, turning cutting-edge technology into practical business value.",
                angle: 191
              },
              {
                icon: ShieldCheck,
                title: "Integrity",
                desc: "We build trust through transparency, honesty, and ethical practices. We believe in systems that are auditable, secure, and reliable.",
                angle: 137
              },
              {
                icon: Users,
                title: "Collaboration",
                desc: "We believe in the power of working together. Our agents don't replace humans; they amplify human potential and enable better teamwork.",
                angle: 111
              },
              {
                icon: Star,
                title: "Excellence",
                desc: "We strive for the highest quality in everything we do, from the code we write to the operational outcomes we deliver for our clients.",
                angle: 167
              }
            ].map((item, i) => (
              <div key={i} className="values-card gradient-border flex flex-col md:flex-row items-start gap-6 p-8 rounded-2xl relative group"
                style={{
                  "--gb-angle": `${item.angle}deg`,
                  "--gb-radius": "1.5rem",
                  background: `linear-gradient(
                    135deg,
                    rgba(255, 255, 255, 0.17) 0%,
                    rgba(255, 255, 255, 0.09) 30%,
                    rgba(255, 255, 255, 0.14) 70%,
                    rgba(255, 255, 255, 0.19) 100%
                  )`,
                  backdropFilter: "blur(12px)",
                  WebkitBackdropFilter: "blur(12px)",
                } as React.CSSProperties}
              >
                <div
                  className="gradient-border inline-block mb-6 text-white"
                  style={{
                    "--gb-angle": `${item.angle}deg`,
                    "--gb-radius": "0.75rem",
                    "--gb-color2": "rgba(255, 255, 255, 0.09)",
                    padding: "0.5rem 1rem",
                    background: `linear-gradient(
                      135deg,
                      rgba(255, 255, 255, 0.17) 0%,
                      rgba(255, 255, 255, 0.09) 30%,
                      rgba(255, 255, 255, 0.14) 70%,
                      rgba(255, 255, 255, 0.19) 100%
                    )`,
                    backdropFilter: "blur(12px)",
                  } as React.CSSProperties}
                >
                  <item.icon className="h-6 w-6 text-white" />
                </div>
                <div className="relative z-10">
                  <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                  <p className="text-[#d1d5da] leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section >

      {/* Leadership Team */}
      < section id="leadership" className="py-32 px-6 relative overflow-hidden" >
        {/* Background image */}
        <img
          src="src/assets/background-circuit-middle.png"
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Dark overlay for readability */}
        <div className="absolute inset-0 bg-black/37"></div>

        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="text-center mb-20">
            <div
              className="leadership-pill gradient-border inline-block mb-6 text-white"
              style={{
                "--gb-angle": "39deg",
                "--gb-radius": "9999px",
                padding: "0.5rem 1.5rem",
                background: `linear-gradient(
                  135deg,
                  rgba(255, 255, 255, 0.17) 0%,
                  rgba(255, 255, 255, 0.09) 30%,
                  rgba(255, 255, 255, 0.14) 70%,
                  rgba(255, 255, 255, 0.19) 100%
                )`,
                backdropFilter: "blur(12px)",
              } as React.CSSProperties}
            >
              PRODUCT COMPANY. ENTERPRISE FOCUS.
            </div>
            <h2 className="leadership-heading text-3xl md:text-5xl font-bold text-white mb-8">Leadership Team</h2>
            <p className="leadership-subheading text-xl text-[#d1d5da] leading-relaxed max-w-3xl mx-auto">
              Chase Continental builds platform software for organisations that want to scale operations without scaling complexity. We productise repeatable work so teams move faster with more control.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 max-w-4xl mx-auto">
            {/* Charles */}
            <div className="group relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-[#5BABAD]/25 to-[#539C9E]/25 rounded-3xl blur opacity-25 group-hover:opacity-75 transition duration-500"></div>
              <div className="leadership-card gradient-border relative rounded-2xl p-6 sm:p-8 h-full flex flex-col"
                style={{
                  "--gb-angle": "97deg",
                  "--gb-radius": "1.5rem",
                  background: `linear-gradient(
                    135deg,
                    rgba(255, 255, 255, 0.17) 0%,
                    rgba(255, 255, 255, 0.09) 30%,
                    rgba(255, 255, 255, 0.14) 70%,
                    rgba(255, 255, 255, 0.19) 100%
                  )`,
                  backdropFilter: "blur(12px)",
                  WebkitBackdropFilter: "blur(12px)",
                } as React.CSSProperties}
              >
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6 mb-6 text-center sm:text-left">
                  <div className="relative gradient-border h-24 w-24 rounded-full overflow-hidden shrink-0"
                    style={{
                      "--gb-angle": "97deg",
                      "--gb-radius": "50px",
                      background: `linear-gradient(
                        135deg,
                        rgba(255, 255, 255, 0.17) 0%,
                        rgba(255, 255, 255, 0.09) 30%,
                        rgba(255, 255, 255, 0.14) 70%,
                        rgba(255, 255, 255, 0.19) 100%
                      )`,
                      backdropFilter: "blur(12px)",
                      WebkitBackdropFilter: "blur(12px)",
                    } as React.CSSProperties}
                  >
                    <img
                      src="/static/images/team/charles.png"
                      alt="Charles K. Chirongoma"
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white min-h-[4rem] flex items-center sm:items-start justify-center sm:justify-start">Charles K. Chirongoma</h3>
                    <p className="text-sm font-semibold text-[#d1d5da] uppercase tracking-wide group-hover:text-[#85FBFE] transition-colors min-h-[2.5rem]">CEO, CX, Product-led Systems Transformation</p>
                  </div>
                </div>
                <p className="text-[#d1d5da] leading-relaxed mb-6 flex-grow text-center sm:text-left">
                  He builds systems that make complex organisations work. With a background spanning economics, data, and industrial development, he has led large-scale digital transformations across multi-regional environments. He focuses on integrating AI into real operating models, redesigning teams so humans supervise systems rather than execute tasks.
                </p>
                <div className="flex gap-4 mt-auto pt-6 border-t border-border/50 text-white relative z-10 justify-center sm:justify-start">
                  <a href="https://www.linkedin.com/in/charles-k-chirongoma-41327716b/" target="_blank" rel="noopener noreferrer" className="hover:text-[#85FBFE] group-hover:text-[#85FBFE] transition-colors duration-500">
                    <Linkedin className="h-5 w-5 fill-transparent group-hover:fill-current transition-all duration-500" />
                  </a>
                  <a href="https://x.com/tue_sday" target="_blank" rel="noopener noreferrer" className="hover:text-[#85FBFE] group-hover:text-[#85FBFE] transition-colors duration-500">
                    <Twitter className="h-5 w-5 fill-transparent group-hover:fill-current transition-all duration-500" />
                  </a>
                </div>
              </div>
            </div>

            {/* Caleb */}
            <div className="group relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-[#5BABAD]/25 to-[#539C9E]/25 rounded-3xl blur opacity-25 group-hover:opacity-75 transition duration-500"></div>
              <div className="relative leadership-card gradient-border rounded-2xl p-6 sm:p-8 h-full flex flex-col"
                style={{
                  "--gb-angle": "17deg",
                  "--gb-radius": "1.5rem",
                  background: `linear-gradient(
                    135deg,
                    rgba(255, 255, 255, 0.17) 0%,
                    rgba(255, 255, 255, 0.09) 30%,
                    rgba(255, 255, 255, 0.14) 70%,
                    rgba(255, 255, 255, 0.19) 100%
                  )`,
                  backdropFilter: "blur(12px)",
                  WebkitBackdropFilter: "blur(12px)",
                } as React.CSSProperties}
              >
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6 mb-6 text-center sm:text-left">
                  <div className="relative gradient-border h-24 w-24 rounded-full overflow-hidden shrink-0"
                    style={{
                        "--gb-angle": "97deg",
                        "--gb-radius": "50px",
                        background: `linear-gradient(
                          135deg,
                          rgba(255, 255, 255, 0.17) 0%,
                          rgba(255, 255, 255, 0.09) 30%,
                          rgba(255, 255, 255, 0.14) 70%,
                          rgba(255, 255, 255, 0.19) 100%
                        )`,
                        backdropFilter: "blur(12px)",
                        WebkitBackdropFilter: "blur(12px)",
                    } as React.CSSProperties}
                  >
                    <img
                      src="/static/images/team/caleb.jpg"
                      alt="Caleb Sakala"
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white min-h-[4rem] flex items-center sm:items-start justify-center sm:justify-start">Caleb Sakala</h3>
                    <p className="text-sm font-semibold text-[#d1d5da] uppercase tracking-wide group-hover:text-[#85FBFE] transition-colors min-h-[2.5rem]">CTO, Product & Engineering</p>
                  </div>
                </div>
                <p className="text-[#d1d5da] leading-relaxed mb-6 flex-grow text-center sm:text-left">
                  Visionary AI Product Engineer who led global AI & software initiatives across the US, Brazil, and Cyprus before his 21st birthday. He has collaborated with elite talent from Meta, Google, and Anthropic to deliver world-class AI solutions.
                </p>
                <div className="flex gap-4 mt-auto pt-6 border-t border-border/50 text-white relative z-10 justify-center sm:justify-start">
                  <a href="https://www.linkedin.com/in/calebsakala" target="_blank" rel="noopener noreferrer" className="hover:text-[#85FBFE] group-hover:text-[#85FBFE] transition-colors duration-500">
                    <Linkedin className="h-5 w-5 fill-transparent group-hover:fill-current transition-all duration-500" />
                  </a>
                  <a href="https://x.com/bytecaleb" target="_blank" rel="noopener noreferrer" className="hover:text-[#85FBFE] group-hover:text-[#85FBFE] transition-colors duration-500">
                    <Twitter className="h-5 w-5 fill-transparent group-hover:fill-current transition-all duration-500" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section >

      {/* CTA Section */}
      <section id="cta" className="py-32 px-6 relative overflow-hidden bg-black">
        <div className="container mx-auto max-w-4xl text-center relative z-10">
          <h2 className="cta-heading text-4xl md:text-6xl font-bold text-white mb-8">Ready to unlock capacity?</h2>
          <p className="cta-subtext text-[#d1d5da] mb-12 max-w-2xl mx-auto">
            See how Chase Continental can standardise core work, speed up delivery, and improve operational control.
          </p>
          <div className="cta-button">
            <Button
              onClick={scrollToBooking}
              size="lg"
              variant="outline"
              className="hover-border-swipe text-lg px-12 h-16 rounded-full font-bold border-2 border-primary text-white transition-all cursor-pointer group shadow-lg shadow-[#85FBFE]/50 hover:-translate-y-0.5"
            >
              Book a Free Consultation
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default LandingPage;
