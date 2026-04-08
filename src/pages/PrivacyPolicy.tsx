import Header from "@/components/Header";
import Footer from "@/components/Footer";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen">
      <Header />

      <main className="pt-16">
        <div className="mx-auto max-w-3xl px-6 py-16">
          <h1 className="mb-2 text-foreground">Privacy Policy</h1>
          <p className="text-sm text-muted-foreground mb-10">
            Last updated: March 1, 2026
          </p>

          <div className="space-y-8">
            <section>
              <h2 className="text-xl mb-3 text-foreground">Introduction</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Chase Continental ("we", "our", or "us") is committed to
                protecting your privacy. This Privacy Policy explains how we
                collect, use, disclose, and safeguard your information when you
                visit our website or book a demo call with us.
              </p>
              <div className="rounded-xl border bg-secondary/30 p-5">
                <p className="text-sm text-muted-foreground">
                  By using our products and offerings or booking a demo, you
                  agree to the collection and use of information in accordance
                  with this policy.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-xl mb-3 text-foreground">
                Information We Collect
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                We collect minimal information necessary to provide our advisory
                offerings:
              </p>
              <div className="space-y-4">
                <div className="rounded-xl border bg-secondary/30 p-5">
                  <h4 className="text-sm font-semibold text-foreground mb-2">
                    Personal Information
                  </h4>
                  <ul className="list-disc pl-5 space-y-2 text-sm text-muted-foreground">
                    <li>
                      Name and email address (collected via Google Calendar
                      booking link)
                    </li>
                    <li>
                      Company name and job title (if provided during booking)
                    </li>
                    <li>
                      Any information you voluntarily provide during demo calls
                    </li>
                  </ul>
                </div>
                <div className="rounded-xl border bg-secondary/30 p-5">
                  <h4 className="text-sm font-semibold text-foreground mb-2">
                    Automatically Collected Information
                  </h4>
                  <ul className="list-disc pl-5 space-y-2 text-sm text-muted-foreground">
                    <li>Browser type and version</li>
                    <li>IP address and general location data</li>
                    <li>Pages visited and time spent on our website</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl mb-3 text-foreground">
                How We Use Your Information
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                We use the information we collect to:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-sm text-muted-foreground">
                <li>
                  Schedule and conduct demo calls and product walkthroughs
                </li>
                <li>Communicate with you about our products and offerings</li>
                <li>Send follow-up information related to your demo call</li>
                <li>Improve our website and offerings</li>
                <li>Comply with legal obligations</li>
              </ul>
              <p className="mt-4 text-sm text-muted-foreground">
                We will never sell, rent, or share your personal information
                with third parties for marketing purposes without your explicit
                consent.
              </p>
            </section>

            <section>
              <h2 className="text-xl mb-3 text-foreground">
                Third-Party Providers
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                We use the following third-party providers to operate our
                business:
              </p>
              <div className="rounded-xl border bg-secondary/30 p-5">
                <h4 className="text-sm font-semibold text-foreground mb-2">
                  Google Calendar
                </h4>
                <p className="text-sm text-muted-foreground">
                  Our booking system uses Google Calendar. When you book a demo,
                  your information is processed by Google according to their
                  privacy policy. We recommend reviewing{" "}
                  <a
                    href="https://policies.google.com/privacy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gold hover:underline"
                  >
                    Google's Privacy Policy
                  </a>
                  .
                </p>
              </div>
              <p className="mt-4 text-sm text-muted-foreground">
                We do not have control over and assume no responsibility for the
                content, privacy policies, or practices of Google or any other
                third-party providers.
              </p>
            </section>

            <section>
              <h2 className="text-xl mb-3 text-foreground">Data Retention</h2>
              <p className="text-muted-foreground leading-relaxed">
                We retain your personal information only for as long as
                necessary to fulfill the purposes outlined in this Privacy
                Policy, unless a longer retention period is required or
                permitted by law.
              </p>
              <p className="mt-3 text-muted-foreground leading-relaxed">
                Demo-call records and communications are typically retained for
                24 months after your last interaction with us, after which they
                are securely deleted.
              </p>
            </section>

            <section>
              <h2 className="text-xl mb-3 text-foreground">
                Your Privacy Rights
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Depending on your location, you may have the following rights
                regarding your personal information:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-sm text-muted-foreground">
                <li>
                  <strong className="text-foreground">Access:</strong> Request a
                  copy of the personal information we hold about you
                </li>
                <li>
                  <strong className="text-foreground">Correction:</strong>{" "}
                  Request correction of inaccurate or incomplete information
                </li>
                <li>
                  <strong className="text-foreground">Deletion:</strong> Request
                  deletion of your personal information
                </li>
                <li>
                  <strong className="text-foreground">Objection:</strong> Object
                  to our processing of your personal information
                </li>
                <li>
                  <strong className="text-foreground">Portability:</strong>{" "}
                  Request transfer of your information to another provider
                </li>
              </ul>
              <p className="mt-4 text-sm text-muted-foreground">
                To exercise any of these rights, please contact us at{" "}
                <a
                  href="mailto:charles@chasecontinental.com"
                  className="text-gold hover:underline"
                >
                  charles@chasecontinental.com
                </a>
                .
              </p>
            </section>

            <section>
              <h2 className="text-xl mb-3 text-foreground">Data Security</h2>
              <p className="text-muted-foreground leading-relaxed">
                We implement appropriate technical and organizational measures
                to protect your personal information against unauthorized
                access, alteration, disclosure, or destruction.
              </p>
              <p className="mt-3 text-muted-foreground leading-relaxed">
                However, no method of transmission over the Internet or
                electronic storage is 100% secure. While we strive to use
                commercially acceptable means to protect your information, we
                cannot guarantee its absolute security.
              </p>
            </section>

            <section>
              <h2 className="text-xl mb-3 text-foreground">
                International Data Transfers
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Your information may be transferred to and maintained on
                computers located outside of your state, province, country, or
                other governmental jurisdiction where data protection laws may
                differ. By using our products and offerings, you consent to such
                transfers.
              </p>
            </section>

            <section>
              <h2 className="text-xl mb-3 text-foreground">
                Children's Privacy
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Our products and offerings are not directed to individuals under
                the age of 18. We do not knowingly collect personal information
                from children. If you become aware that a child has provided us
                with personal information, please contact us immediately.
              </p>
            </section>

            <section>
              <h2 className="text-xl mb-3 text-foreground">
                Changes to This Privacy Policy
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                We may update this Privacy Policy from time to time. We will
                notify you of any changes by posting the new Privacy Policy on
                this page and updating the "Last updated" date. You are advised
                to review this Privacy Policy periodically for any changes.
              </p>
            </section>

            <section>
              <h2 className="text-xl mb-3 text-foreground">Contact Us</h2>
              <p className="text-muted-foreground leading-relaxed">
                If you have any questions about this Privacy Policy or our data
                practices, please contact us:
              </p>
              <div className="mt-4 rounded-xl border bg-secondary/30 p-5 space-y-2 text-sm text-muted-foreground">
                <p>
                  <strong className="text-foreground">Chase Continental</strong>
                </p>
                <p>
                  Email:{" "}
                  <a
                    href="mailto:charles@chasecontinental.com"
                    className="text-gold hover:underline"
                  >
                    charles@chasecontinental.com
                  </a>
                </p>
                <p>
                  Website:{" "}
                  <a
                    href="https://chasecontinental.com"
                    className="text-gold hover:underline"
                  >
                    chasecontinental.com
                  </a>
                </p>
              </div>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
