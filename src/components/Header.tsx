import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Products", href: "/products" },
  { label: "Results", href: "/#results" },
  { label: "Resources", href: "/resources" },
  { label: "Blog", href: "/blogs" },
];

interface HeaderProps {
  variant?: "default" | "transparent";
}

const Header = ({ variant = "default" }: HeaderProps) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (href: string) => {
    setMobileOpen(false);
    if (href.startsWith("/#") && location.pathname === "/") {
      const el = document.querySelector(href.replace("/", ""));
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled || mobileOpen
          ? "bg-background/90 backdrop-blur-2xl border-b border-border/40 shadow-sm"
          : "bg-background/60 backdrop-blur-xl"
      }`}
    >
      <div className="mx-auto max-w-7xl flex h-16 items-center justify-between px-6">
        <Link to="/" className="flex items-center gap-2.5 group">
          <img
            src="/static/images/cc-logo-mark.png"
            alt="Chase Continental"
            className="h-10 w-auto transition-all duration-300 group-hover:scale-105"
          />
          <span className="text-[15px] font-bold font-heading tracking-tight text-foreground">
            Chase Continental
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              onClick={() => handleNavClick(link.href)}
              className="px-4 py-2 text-[13px] font-medium text-muted-foreground hover:text-foreground transition-colors duration-200"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <Button
            size="sm"
            className="rounded-full bg-foreground text-background hover:bg-foreground/90 font-semibold px-5 h-9 text-[13px] transition-all duration-300"
            onClick={() => window.location.assign("/products")}
          >
            See Our Work
          </Button>
        </div>

        <button
          className="inline-flex items-center justify-center rounded-lg p-2 md:hidden text-muted-foreground hover:bg-accent transition-colors"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </button>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="border-t border-border/40 bg-background/95 backdrop-blur-2xl pb-5 md:hidden"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            <nav className="flex flex-col gap-0.5 px-6 pt-3">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  onClick={() => handleNavClick(link.href)}
                  className="px-4 py-3 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
            <div className="mt-4 px-6">
              <Button
                className="w-full rounded-full bg-foreground text-background hover:bg-foreground/90 font-semibold h-11"
                onClick={() => {
                  window.location.assign("/products");
                  setMobileOpen(false);
                }}
              >
                See Our Work
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
