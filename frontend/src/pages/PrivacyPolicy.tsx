import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PrivacyPolicy = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      {/* Header */}
      <nav className="fixed top-0 w-full z-50 bg-white border-b border-border shadow-sm">
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
          <a href="/" className="flex items-center gap-3 group">
            <img
              src="/static/images/chase-continental-header-logo.png"
              alt="Chase Continental"
              className="h-9 w-auto"
            />
            <span className="text-sm font-bold tracking-wide text-primary hidden sm:block">CHASE CONTINENTAL</span>
          </a>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/')}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Button>
        </div>
      </nav>

      {/* Content */}
      <main className="pt-32 pb-24 px-6">
        <div className="container mx-auto max-w-4xl">
          <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">Privacy Policy</h1>
          <p className="text-sm text-muted-foreground mb-12">Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>

          <div className="prose prose-slate max-w-none">
            {/* Introduction */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-primary mb-4">Introduction</h2>
              <p className="text-foreground/80 leading-relaxed mb-4">
                Chase Continental ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or book a consultation with us.
              </p>
              <p className="text-foreground/80 leading-relaxed">
                By using our services or booking a demo, you agree to the collection and use of information in accordance with this policy.
              </p>
            </section>

            {/* Information We Collect */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-primary mb-4">Information We Collect</h2>
              <p className="text-foreground/80 leading-relaxed mb-4">
                We collect minimal information necessary to provide our consultancy services:
              </p>
              <div className="bg-secondary/30 border border-border rounded-lg p-6 mb-4">
                <h3 className="text-lg font-bold text-primary mb-3">Personal Information</h3>
                <ul className="list-disc list-inside space-y-2 text-foreground/80">
                  <li>Name and email address (collected via Google Calendar booking link)</li>
                  <li>Company name and job title (if provided during booking)</li>
                  <li>Any information you voluntarily provide during consultations</li>
                </ul>
              </div>
              <div className="bg-secondary/30 border border-border rounded-lg p-6">
                <h3 className="text-lg font-bold text-primary mb-3">Automatically Collected Information</h3>
                <ul className="list-disc list-inside space-y-2 text-foreground/80">
                  <li>Browser type and version</li>
                  <li>IP address and general location data</li>
                  <li>Pages visited and time spent on our website</li>
                </ul>
              </div>
            </section>

            {/* How We Use Your Information */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-primary mb-4">How We Use Your Information</h2>
              <p className="text-foreground/80 leading-relaxed mb-4">
                We use the information we collect to:
              </p>
              <ul className="list-disc list-inside space-y-2 text-foreground/80 mb-4">
                <li>Schedule and conduct consultations and demos</li>
                <li>Communicate with you about our services</li>
                <li>Send follow-up information related to your consultation</li>
                <li>Improve our website and services</li>
                <li>Comply with legal obligations</li>
              </ul>
              <p className="text-foreground/80 leading-relaxed">
                We will <strong>never</strong> sell, rent, or share your personal information with third parties for marketing purposes without your explicit consent.
              </p>
            </section>

            {/* Third-Party Services */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-primary mb-4">Third-Party Services</h2>
              <p className="text-foreground/80 leading-relaxed mb-4">
                We use the following third-party services to operate our business:
              </p>
              <div className="bg-secondary/30 border border-border rounded-lg p-6">
                <h3 className="text-lg font-bold text-primary mb-3">Google Calendar</h3>
                <p className="text-foreground/80 leading-relaxed mb-3">
                  Our booking system uses Google Calendar. When you book a demo, your information is processed by Google according to their privacy policy. We recommend reviewing <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-primary underline hover:no-underline">Google's Privacy Policy</a>.
                </p>
                <p className="text-sm text-muted-foreground">
                  We do not have control over and assume no responsibility for the content, privacy policies, or practices of Google or any other third-party services.
                </p>
              </div>
            </section>

            {/* Data Retention */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-primary mb-4">Data Retention</h2>
              <p className="text-foreground/80 leading-relaxed mb-4">
                We retain your personal information only for as long as necessary to fulfill the purposes outlined in this Privacy Policy, unless a longer retention period is required or permitted by law.
              </p>
              <p className="text-foreground/80 leading-relaxed">
                Consultation records and communications are typically retained for 24 months after your last interaction with us, after which they are securely deleted.
              </p>
            </section>

            {/* Your Privacy Rights */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-primary mb-4">Your Privacy Rights</h2>
              <p className="text-foreground/80 leading-relaxed mb-4">
                Depending on your location, you may have the following rights regarding your personal information:
              </p>
              <ul className="list-disc list-inside space-y-2 text-foreground/80 mb-4">
                <li><strong>Access:</strong> Request a copy of the personal information we hold about you</li>
                <li><strong>Correction:</strong> Request correction of inaccurate or incomplete information</li>
                <li><strong>Deletion:</strong> Request deletion of your personal information</li>
                <li><strong>Objection:</strong> Object to our processing of your personal information</li>
                <li><strong>Portability:</strong> Request transfer of your information to another service</li>
              </ul>
              <p className="text-foreground/80 leading-relaxed">
                To exercise any of these rights, please contact us at <a href="mailto:charles@chasecontinental.com" className="text-primary underline hover:no-underline">charles@chasecontinental.com</a>.
              </p>
            </section>

            {/* Data Security */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-primary mb-4">Data Security</h2>
              <p className="text-foreground/80 leading-relaxed mb-4">
                We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.
              </p>
              <p className="text-foreground/80 leading-relaxed">
                However, no method of transmission over the Internet or electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your information, we cannot guarantee its absolute security.
              </p>
            </section>

            {/* International Data Transfers */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-primary mb-4">International Data Transfers</h2>
              <p className="text-foreground/80 leading-relaxed">
                Your information may be transferred to and maintained on computers located outside of your state, province, country, or other governmental jurisdiction where data protection laws may differ. By using our services, you consent to such transfers.
              </p>
            </section>

            {/* Children's Privacy */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-primary mb-4">Children's Privacy</h2>
              <p className="text-foreground/80 leading-relaxed">
                Our services are not directed to individuals under the age of 18. We do not knowingly collect personal information from children. If you become aware that a child has provided us with personal information, please contact us immediately.
              </p>
            </section>

            {/* Changes to This Policy */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-primary mb-4">Changes to This Privacy Policy</h2>
              <p className="text-foreground/80 leading-relaxed">
                We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date. You are advised to review this Privacy Policy periodically for any changes.
              </p>
            </section>

            {/* Contact Us */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-primary mb-4">Contact Us</h2>
              <p className="text-foreground/80 leading-relaxed mb-4">
                If you have any questions about this Privacy Policy or our data practices, please contact us:
              </p>
              <div className="bg-secondary/30 border border-border rounded-lg p-6">
                <p className="text-foreground/80 leading-relaxed mb-2">
                  <strong className="text-primary">Chase Continental</strong>
                </p>
                <p className="text-foreground/80 leading-relaxed mb-2">
                  Email: <a href="mailto:charles@chasecontinental.com" className="text-primary underline hover:no-underline">charles@chasecontinental.com</a>
                </p>
                <p className="text-foreground/80 leading-relaxed">
                  Website: <a href="https://chasecontinental.com" className="text-primary underline hover:no-underline">chasecontinental.com</a>
                </p>
              </div>
            </section>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-card text-muted-foreground py-8 px-6 border-t border-border">
        <div className="container mx-auto text-center text-sm">
          <p>© {new Date().getFullYear()} Chase Continental. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default PrivacyPolicy;
