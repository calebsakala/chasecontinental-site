import { Link } from "react-router-dom";
import { Linkedin, Mail } from "lucide-react";

const Footer = () => {
  return (
    <footer className="relative border-t border-border/50 bg-card/50 backdrop-blur-xl">
      <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: 'radial-gradient(circle, hsl(var(--foreground)) 1px, transparent 1px)', backgroundSize: '24px 24px' }} />

      <div className="relative z-10 mx-auto max-w-6xl px-6 py-16">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center gap-3 group">
              <img
                src="/static/images/cc-logo-mark.png"
                alt="Chase Continental"
                className="h-12 w-auto"
              />
              <div className="flex flex-col">
                <span className="text-xl font-bold font-heading text-foreground">
                  Chase Continental
                </span>
                <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground/50">
                  AI Automation Studio
                </span>
              </div>
            </Link>
            <p className="mt-4 text-sm text-muted-foreground max-w-sm leading-relaxed">
              AI automation and custom software that helps businesses move faster—with fewer mistakes.
            </p>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-bold font-heading text-foreground uppercase tracking-wider">Company</h4>
            <ul className="space-y-3">
              <li><Link to="/blogs" className="text-sm text-muted-foreground hover:text-teal transition-colors">Blog</Link></li>
              <li><Link to="/privacy" className="text-sm text-muted-foreground hover:text-teal transition-colors">Privacy Policy</Link></li>
              <li><Link to="/resources" className="text-sm text-muted-foreground hover:text-teal transition-colors">Resources</Link></li>
              <li><a href="/#products" className="text-sm text-muted-foreground hover:text-teal transition-colors">Products</a></li>
              <li><a href="/#services" className="text-sm text-muted-foreground hover:text-teal transition-colors">Services</a></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-bold font-heading text-foreground uppercase tracking-wider">Connect</h4>
            <ul className="space-y-3">
              <li>
                <a href="https://www.linkedin.com/company/chase-continental" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2.5 text-sm text-muted-foreground hover:text-teal transition-colors">
                  <Linkedin className="h-4 w-4" /> LinkedIn
                </a>
              </li>
              <li>
                <a href="mailto:charles@chasecontinental.com" className="inline-flex items-center gap-2.5 text-sm text-muted-foreground hover:text-teal transition-colors">
                  <Mail className="h-4 w-4" /> charles@chasecontinental.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-border/50 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground/70">
            © {new Date().getFullYear()} Chase Continental. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <a href="https://www.linkedin.com/company/chase-continental" target="_blank" rel="noopener noreferrer" className="text-muted-foreground/60 hover:text-teal transition-colors" aria-label="LinkedIn">
              <Linkedin className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
