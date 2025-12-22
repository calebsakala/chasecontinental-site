import { Button } from '@/components/ui/button';
import { ArrowRight, Brain, Code2, Zap, Eye, ShieldCheck, Terminal, Cpu, Layers } from 'lucide-react';

const LandingPage = () => {
  const scrollToBooking = () => {
    window.open('https://calendar.app.google/8oZYnnuHcaiH64Ky8', '_blank');
  };

  return (
    <div className="min-h-screen bg-[#0B1120] text-slate-300 font-sans selection:bg-emerald-500/30 selection:text-emerald-200 overflow-x-hidden">

      {/* Background Effects */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-emerald-500/5 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-600/5 blur-[120px]" />
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-[#0B1120]/80 backdrop-blur-xl border-b border-white/5 z-50">
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold tracking-tight text-white">CHASE<span className="text-emerald-500">CONTINENTAL</span></span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#problem" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">The Problem</a>
            <a href="#solution" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">The Solution</a>
            <a href="#how-it-works" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">How It Works</a>
            <Button
              onClick={scrollToBooking}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-medium px-6 rounded-full shadow-[0_0_20px_-5px_rgba(16,185,129,0.4)] transition-all hover:shadow-[0_0_25px_-5px_rgba(16,185,129,0.6)] cursor-pointer"
            >
              Book a Demo
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="relative pt-40 pb-32 px-6 z-10">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col items-center text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-emerald-400 text-sm font-medium mb-8 backdrop-blur-sm animate-fade-in-up">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              The Future of Enterprise Automation
            </div>

            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight text-white mb-8 leading-[1.1]">
              Reliability of Code. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">Intelligence of AI.</span>
            </h1>

            <p className="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed mb-12">
              <span className="text-white font-semibold">Chase Agents</span> delivers enterprise automation that combines uncompromising precision with real-world adaptability. What used to take engineering teams months now deploys in days.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 w-full justify-center">
              <Button
                onClick={scrollToBooking}
                size="lg"
                className="bg-white text-slate-900 hover:bg-slate-100 text-lg px-8 h-14 rounded-full font-semibold cursor-pointer"
              >
                Book a Demo
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={scrollToBooking}
                className="border-white/10 bg-white/5 text-white hover:bg-white/10 text-lg px-8 h-14 rounded-full backdrop-blur-sm cursor-pointer"
              >
                See It In Action
              </Button>
            </div>
          </div>
        </div>

        {/* Abstract Grid Decoration */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent"></div>
      </header>

      {/* The Conflict Section (Dark Card Style) */}
      <section id="problem" className="py-32 px-6 relative">
        <div className="container mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">The Enterprise Dilemma</h2>
              <p className="text-lg text-slate-400 mb-8 leading-relaxed">
                Businesses today are caught in a dangerous trade-off. You have to choose between the rock-solid reliability of old software and the game-changing intelligence of new AI.
              </p>

              <div className="space-y-6">
                <div className="group p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-red-500/30 transition-colors">
                  <div className="flex items-center gap-4 mb-3">
                    <div className="p-2 rounded-lg bg-red-500/10 text-red-400">
                      <Code2 className="h-6 w-6" />
                    </div>
                    <h3 className="text-xl font-semibold text-white">Traditional Software</h3>
                  </div>
                  <p className="text-slate-400">Reliable but rigid. Like a train on a track—if the track changes, the train crashes.</p>
                </div>

                <div className="group p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-purple-500/30 transition-colors">
                  <div className="flex items-center gap-4 mb-3">
                    <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400">
                      <Brain className="h-6 w-6" />
                    </div>
                    <h3 className="text-xl font-semibold text-white">Modern AI Models</h3>
                  </div>
                  <p className="text-slate-400">Creative but chaotic. Like a brilliant artist who hallucinates—great for ideas, dangerous for operations.</p>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-blue-500/20 blur-3xl rounded-full opacity-30"></div>
              <div className="relative bg-[#0F1629] border border-white/10 rounded-3xl p-8 md:p-12 shadow-2xl">
                <div className="flex flex-col gap-8">
                  <div className="flex justify-between items-center border-b border-white/5 pb-8">
                    <span className="text-slate-400 font-mono text-sm">METRIC</span>
                    <span className="text-slate-400 font-mono text-sm">STATUS</span>
                  </div>
                  <div className="space-y-6">
                    <div className="flex justify-between items-center">
                      <span className="text-white font-medium">Reliability</span>
                      <div className="flex gap-2">
                        <span className="px-3 py-1 rounded-full bg-red-500/10 text-red-400 text-xs font-medium border border-red-500/20">LOW (AI)</span>
                        <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-medium border border-emerald-500/20">HIGH (CODE)</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-white font-medium">Adaptability</span>
                      <div className="flex gap-2">
                        <span className="px-3 py-1 rounded-full bg-red-500/10 text-red-400 text-xs font-medium border border-red-500/20">LOW (CODE)</span>
                        <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-medium border border-emerald-500/20">HIGH (AI)</span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-8 pt-8 border-t border-white/5">
                    <p className="text-center text-white font-medium">The Solution: <span className="text-emerald-400">Chase Agents</span></p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The Solution / How it Works */}
      <section id="how-it-works" className="py-32 px-6 bg-[#0F1629] border-y border-white/5">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">How It Works</h2>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">
              Our proprietary approach isolates intelligence from execution, delivering both adaptability and reliability where it matters most.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* Connecting Line */}
            <div className="hidden md:block absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent -translate-y-1/2 z-0"></div>

            {/* Step 1 */}
            <div className="relative z-10 bg-[#0B1120] border border-white/10 p-8 rounded-2xl hover:border-emerald-500/30 transition-all group">
              <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-emerald-500/20 transition-colors">
                <Brain className="h-6 w-6 text-emerald-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">1. Understanding</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Natural language input meets advanced analysis. Your intent becomes a structured execution plan.
              </p>
            </div>

            {/* Step 2 */}
            <div className="relative z-10 bg-[#0B1120] border border-white/10 p-8 rounded-2xl hover:border-emerald-500/30 transition-all group">
              <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-blue-500/20 transition-colors">
                <FileCode className="h-6 w-6 text-blue-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">2. Translation</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Proprietary layers convert high-level goals into precise, verifiable instructions optimized for your infrastructure.
              </p>
            </div>

            {/* Step 3 */}
            <div className="relative z-10 bg-[#0B1120] border border-white/10 p-8 rounded-2xl hover:border-emerald-500/30 transition-all group">
              <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-purple-500/20 transition-colors">
                <Terminal className="h-6 w-6 text-purple-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">3. Execution</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Mission-critical operations run with zero variance. Every action is traceable, auditable, and guaranteed.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Bento Grid Features */}
      <section className="py-32 px-6">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-16 text-center">Enterprise-Grade Capabilities</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Large Card */}
            <div className="md:col-span-2 bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-3xl p-8 md:p-12 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-20 group-hover:opacity-30 transition-opacity">
                <Zap className="h-32 w-32 text-emerald-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Real-Time Adaptability</h3>
              <p className="text-slate-400 max-w-md leading-relaxed">
                When external systems change, traditional automations break. Chase Agents self-correct in real-time, maintaining operational continuity without manual intervention.
              </p>
            </div>

            {/* Tall Card */}
            <div className="md:row-span-2 bg-[#0F1629] border border-white/10 rounded-3xl p-8 flex flex-col relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-emerald-900/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="mb-auto">
                <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center mb-6">
                  <Eye className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Total Observability</h3>
                <p className="text-slate-400 leading-relaxed">
                  No more black boxes. See exactly what the system planned and executed in plain English. Audit every decision.
                </p>
              </div>
              <div className="mt-8 p-4 bg-black/40 rounded-xl border border-white/5 font-mono text-xs text-emerald-400">
                &gt; Analyzing request...<br />
                &gt; Plan generated.<br />
                &gt; Executing step 1...<br />
                &gt; Success.
              </div>
            </div>

            {/* Small Card 1 */}
            <div className="bg-[#0F1629] border border-white/10 rounded-3xl p-8 hover:bg-white/5 transition-colors">
              <ShieldCheck className="h-8 w-8 text-emerald-400 mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Trustworthy</h3>
              <p className="text-slate-400 text-sm">Eliminates AI variance during critical execution steps.</p>
            </div>

            {/* Small Card 2 */}
            <div className="bg-[#0F1629] border border-white/10 rounded-3xl p-8 hover:bg-white/5 transition-colors">
              <Cpu className="h-8 w-8 text-blue-400 mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Democratized</h3>
              <p className="text-slate-400 text-sm">Non-technical users can build complex backends just by describing them.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison Table Redesigned */}
      <section className="py-32 px-6 bg-[#0F1629] border-t border-white/5">
        <div className="container mx-auto max-w-5xl">
          <h2 className="text-3xl font-bold text-white mb-12 text-center">Why It's Different</h2>

          <div className="space-y-4">
            {[
              {
                icon: Layers,
                title: "Vs. Traditional AI Solutions",
                desc: "While others struggle with unpredictable behavior, we've engineered deterministic outcomes at scale."
              },
              {
                icon: Code2,
                title: "Vs. Developer Tools",
                desc: "We don't assist—we autonomously build, deploy, and maintain complex systems without developer intervention."
              },
              {
                icon: Zap,
                title: "Vs. Low-Code Platforms",
                desc: "Static platforms break when reality shifts. We continuously adapt to changes in your ecosystem."
              }
            ].map((item, i) => (
              <div key={i} className="flex flex-col md:flex-row items-start md:items-center gap-6 p-8 rounded-2xl bg-[#0B1120] border border-white/5 hover:border-emerald-500/20 transition-all">
                <div className="p-4 rounded-full bg-white/5 text-emerald-400 shrink-0">
                  <item.icon className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                  <p className="text-slate-400">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Chase Continental */}
      <section className="py-32 px-6 bg-[#0B1120] border-t border-white/5">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 text-emerald-400 text-sm font-medium mb-8">
            The Studio Behind The Software
          </div>
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-8">About Chase Continental</h2>
          <p className="text-xl text-slate-400 leading-relaxed mb-12">
            Chase Continental is an AI innovation lab building the infrastructure for autonomous enterprise operations. Our systems combine years of research in reliability engineering with breakthrough capabilities in adaptive intelligence.
          </p>
          <p className="text-lg text-slate-500 leading-relaxed">
            <span className="text-white font-semibold">Chase Agents</span> represents the next evolution in enterprise software—where automation meets autonomy.
          </p>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-emerald-600/10"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-[#0B1120] via-transparent to-[#0B1120]"></div>

        <div className="container mx-auto max-w-4xl text-center relative z-10">
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-8">Ready to Automate?</h2>
          <p className="text-xl text-slate-400 mb-12 max-w-2xl mx-auto">
            Stop choosing between rigid software and risky AI. Implement the future of automation today.
          </p>
          <Button
            onClick={scrollToBooking}
            size="lg"
            className="bg-emerald-500 hover:bg-emerald-400 text-white text-lg px-12 h-16 rounded-full font-bold shadow-[0_0_40px_-10px_rgba(16,185,129,0.5)] transition-all hover:scale-105 cursor-pointer"
          >
            Book a Demo
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#050911] text-slate-500 py-16 px-6 border-t border-white/5">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div className="col-span-2">
              <span className="text-2xl font-bold text-white block mb-6">CHASE<span className="text-emerald-500">CONTINENTAL</span></span>
              <p className="max-w-sm">
                Building the next generation of enterprise automation. Smart, adaptable, and trustworthy.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-emerald-400 transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-emerald-400 transition-colors">Terms of Service</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Connect</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-emerald-400 transition-colors">Twitter</a></li>
                <li><a href="#" className="hover:text-emerald-400 transition-colors">LinkedIn</a></li>
                <li><a href="#" className="hover:text-emerald-400 transition-colors">Email Us</a></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-white/5 text-center text-sm">
            <p>© {new Date().getFullYear()} Chase Continental. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

function FileCode(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
      <polyline points="14 2 14 8 20 8" />
      <path d="m10 13-2 2 2 2" />
      <path d="m14 17 2-2-2-2" />
    </svg>
  )
}

export default LandingPage;
