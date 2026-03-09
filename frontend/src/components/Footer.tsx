import { Link } from 'react-router-dom';

export const Footer = () => {
  return (
    <footer className="bg-black text-[#d1d5da] py-16 px-6 border-t border-border">
      <div className="container mx-auto">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <img
                src="/static/images/chasecontinental-logo.png"
                alt="Chase Continental"
                className="h-10 w-auto"
              />
              <span className="text-sm font-bold tracking-wide text-white">CHASE CONTINENTAL</span>
            </div>
            <p className="max-w-sm text-sm leading-relaxed">
              Building platform software that changes the way people work.
            </p>
          </div>
          <div>
            <h4 className="text-white font-bold mb-6">Company</h4>
            <ul className="space-y-3 text-sm">
              <li><Link to="/blogs" className="hover:text-white transition-colors">Blog</Link></li>
              <li><Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-6">Connect</h4>
            <ul className="space-y-3 text-sm">
              <li><a href="https://www.linkedin.com/company/chase-continental" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">LinkedIn</a></li>
              <li><a href="mailto:charles@chasecontinental.com" className="hover:text-white transition-colors">Email Us</a></li>
            </ul>
          </div>
        </div>
        <div className="pt-8 border-t border-border text-center  text-sm flex flex-col md:flex-row justify-between items-center gap-4">
          <p>© {new Date().getFullYear()} Chase Continental. All rights reserved.</p>
          <div className="flex gap-4">
            {/* Social Icons could go here */}
          </div>
        </div>
      </div>
    </footer>
  );
};
