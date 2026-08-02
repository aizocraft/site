import Link from "next/link";
import { Shield, Lock, Eye, Database, Mail, Cookie, Users, FileText, CheckCircle } from "lucide-react";

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-[var(--color-background)]">
      {/* Hero Section */}
      <section className="bg-[#0f172a] dark:bg-[#050a15] text-white pt-32 md:pt-40 pb-16 md:pb-20">
        <div className="container-custom">
          <div className="max-w-3xl">
            <div className="flex items-center gap-3 mb-4">
              <Lock className="w-8 h-8 text-[#16a34a] dark:text-[#22c55e]" />
              <span className="badge badge-primary">Privacy</span>
            </div>
            <h1 className="heading-xl mb-4">Privacy Policy</h1>
            <p className="text-lg text-gray-300">
              Your privacy is important to us. Learn how Nenes Construction collects, uses, 
              and protects your personal information.
            </p>
            <p className="text-sm text-gray-400 mt-4">
              Last Updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </p>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <div className="space-y-12">
              {/* Introduction */}
              <div className="card p-8">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[var(--color-accent-soft)] rounded-xl flex items-center justify-center flex-shrink-0">
                    <Shield className="w-6 h-6 text-[var(--color-accent)]" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-[var(--color-foreground)] mb-2">Introduction</h2>
                    <p className="text-[var(--color-muted)] leading-relaxed">
                      Nenes Construction (&quot;we&quot;, &quot;our&quot;, &quot;us&quot;) is committed to protecting your privacy. 
                      This Privacy Policy explains how we collect, use, disclose, and safeguard your 
                      information when you visit our website or use our services. Please read this 
                      policy carefully.
                    </p>
                  </div>
                </div>
              </div>

              {/* Information We Collect */}
              <div className="card p-8">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[var(--color-accent-soft)] rounded-xl flex items-center justify-center flex-shrink-0">
                    <Database className="w-6 h-6 text-[var(--color-accent)]" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-[var(--color-foreground)] mb-2">Information We Collect</h2>
                    <p className="text-[var(--color-muted)] leading-relaxed mb-4">
                      We may collect the following types of information:
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-[var(--color-card-bg)] p-4 rounded-xl border border-gray-200 dark:border-gray-700">
                        <h4 className="font-semibold text-[var(--color-foreground)] mb-2 flex items-center gap-2">
                          <Users className="w-4 h-4 text-[var(--color-accent)]" />
                          Personal Information
                        </h4>
                        <ul className="text-sm text-[var(--color-muted)] space-y-1">
                          <li>• Name and contact details</li>
                          <li>• Email address</li>
                          <li>• Phone number</li>
                          <li>• Physical address</li>
                          <li>• Project requirements</li>
                        </ul>
                      </div>
                      <div className="bg-[var(--color-card-bg)] p-4 rounded-xl border border-gray-200 dark:border-gray-700">
                        <h4 className="font-semibold text-[var(--color-foreground)] mb-2 flex items-center gap-2">
                          <Eye className="w-4 h-4 text-[var(--color-accent)]" />
                          Usage Information
                        </h4>
                        <ul className="text-sm text-[var(--color-muted)] space-y-1">
                          <li>• Browser type and version</li>
                          <li>• Operating system</li>
                          <li>• IP address</li>
                          <li>• Pages visited</li>
                          <li>• Time and date of visits</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* How We Use Your Information */}
              <div className="card p-8">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[var(--color-accent-soft)] rounded-xl flex items-center justify-center flex-shrink-0">
                    <FileText className="w-6 h-6 text-[var(--color-accent)]" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-[var(--color-foreground)] mb-2">How We Use Your Information</h2>
                    <p className="text-[var(--color-muted)] leading-relaxed mb-4">
                      We use the information we collect for various purposes:
                    </p>
                    <ul className="space-y-2 text-[var(--color-muted)]">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-5 h-5 text-[#16a34a] dark:text-[#22c55e] flex-shrink-0 mt-0.5" />
                        <span>To provide and maintain our construction services</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-5 h-5 text-[#16a34a] dark:text-[#22c55e] flex-shrink-0 mt-0.5" />
                        <span>To communicate with you about projects and updates</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-5 h-5 text-[#16a34a] dark:text-[#22c55e] flex-shrink-0 mt-0.5" />
                        <span>To improve our website and services</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-5 h-5 text-[#16a34a] dark:text-[#22c55e] flex-shrink-0 mt-0.5" />
                        <span>To send you promotional materials and offers</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-5 h-5 text-[#16a34a] dark:text-[#22c55e] flex-shrink-0 mt-0.5" />
                        <span>To comply with legal obligations</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Data Security */}
              <div className="card p-8">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[var(--color-accent-soft)] rounded-xl flex items-center justify-center flex-shrink-0">
                    <Lock className="w-6 h-6 text-[var(--color-accent)]" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-[var(--color-foreground)] mb-2">Data Security</h2>
                    <p className="text-[var(--color-muted)] leading-relaxed">
                      We implement appropriate technical and organizational measures to protect your 
                      personal information against unauthorized access, alteration, disclosure, or 
                      destruction. However, no method of transmission over the internet is 100% secure, 
                      and we cannot guarantee absolute security. We regularly review our security 
                      procedures to ensure your data is protected.
                    </p>
                  </div>
                </div>
              </div>

              {/* Cookies */}
              <div className="card p-8">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[var(--color-accent-soft)] rounded-xl flex items-center justify-center flex-shrink-0">
                    <Cookie className="w-6 h-6 text-[var(--color-accent)]" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-[var(--color-foreground)] mb-2">Cookies</h2>
                    <p className="text-[var(--color-muted)] leading-relaxed">
                      Our website uses cookies to enhance your browsing experience. Cookies are small 
                      text files stored on your device. We use both session cookies and persistent 
                      cookies to improve functionality, analyze usage, and personalize content. You 
                      can control cookie preferences through your browser settings. However, disabling 
                      cookies may affect some features of our website.
                    </p>
                  </div>
                </div>
              </div>

              {/* Third-Party Disclosure */}
              <div className="card p-8">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[var(--color-accent-soft)] rounded-xl flex items-center justify-center flex-shrink-0">
                    <Mail className="w-6 h-6 text-[var(--color-accent)]" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-[var(--color-foreground)] mb-2">Third-Party Disclosure</h2>
                    <p className="text-[var(--color-muted)] leading-relaxed">
                      We do not sell, trade, or transfer your personal information to third parties 
                      without your consent, except as required by law or to fulfill our services. We 
                      may share information with trusted service providers who assist us in operating 
                      our website or conducting our business, provided they agree to keep your 
                      information confidential.
                    </p>
                  </div>
                </div>
              </div>

              {/* Your Rights */}
              <div className="card p-8">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[var(--color-accent-soft)] rounded-xl flex items-center justify-center flex-shrink-0">
                    <Users className="w-6 h-6 text-[var(--color-accent)]" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-[var(--color-foreground)] mb-2">Your Rights</h2>
                    <p className="text-[var(--color-muted)] leading-relaxed mb-4">
                      You have the right to:
                    </p>
                    <ul className="space-y-2 text-[var(--color-muted)]">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-5 h-5 text-[#16a34a] dark:text-[#22c55e] flex-shrink-0 mt-0.5" />
                        <span>Access the personal information we hold about you</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-5 h-5 text-[#16a34a] dark:text-[#22c55e] flex-shrink-0 mt-0.5" />
                        <span>Request correction of inaccurate information</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-5 h-5 text-[#16a34a] dark:text-[#22c55e] flex-shrink-0 mt-0.5" />
                        <span>Request deletion of your personal information</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-5 h-5 text-[#16a34a] dark:text-[#22c55e] flex-shrink-0 mt-0.5" />
                        <span>Object to processing of your personal information</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-5 h-5 text-[#16a34a] dark:text-[#22c55e] flex-shrink-0 mt-0.5" />
                        <span>Withdraw consent at any time (if applicable)</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="card p-8 bg-[var(--color-accent-soft)] border border-[var(--color-accent)]/20">
                <h2 className="text-2xl font-bold text-[var(--color-foreground)] mb-2">Questions About Your Privacy?</h2>
                <p className="text-[var(--color-muted)] leading-relaxed mb-4">
                  If you have any questions, concerns, or requests regarding this Privacy Policy, 
                  please contact our Privacy Officer:
                </p>
                <div className="space-y-2 text-[var(--color-muted)]">
                  <p> Email: nenesconstruction@gmail.com</p>
                  <p> Phone: +254 717 780 056 </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}