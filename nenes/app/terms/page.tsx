import Link from "next/link";
import { Shield, CheckCircle, AlertCircle, FileText, Scale, Users, Building } from "lucide-react";

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-[var(--color-background)]">
      {/* Hero Section */}
      <section className="bg-[#0f172a] dark:bg-[#050a15] text-white pt-32 md:pt-40 pb-16 md:pb-20">
        <div className="container-custom">
          <div className="max-w-3xl">
            <div className="flex items-center gap-3 mb-4">
              <Shield className="w-8 h-8 text-[#16a34a] dark:text-[#22c55e]" />
              <span className="badge badge-primary">Legal</span>
            </div>
            <h1 className="heading-xl mb-4">Terms of Service</h1>
            <p className="text-lg text-gray-300">
              Please read these terms carefully before using our services. 
              By engaging with Nenes Construction, you agree to be bound by these terms.
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
                    <FileText className="w-6 h-6 text-[var(--color-accent)]" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-[var(--color-foreground)] mb-2">Introduction</h2>
                    <p className="text-[var(--color-muted)] leading-relaxed">
                      Welcome to Nenes Construction. These Terms of Service govern your use of our website 
                      and services. By accessing our website or engaging our services, you agree to comply 
                      with these terms. If you do not agree with any part of these terms, please do not use 
                      our services.
                    </p>
                  </div>
                </div>
              </div>

              {/* Services */}
              <div className="card p-8">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[var(--color-accent-soft)] rounded-xl flex items-center justify-center flex-shrink-0">
                    <Building className="w-6 h-6 text-[var(--color-accent)]" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-[var(--color-foreground)] mb-2">Our Services</h2>
                    <p className="text-[var(--color-muted)] leading-relaxed mb-4">
                      Nenes Construction provides a range of construction and building services including:
                    </p>
                    <ul className="space-y-2 text-[var(--color-muted)]">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-5 h-5 text-[#16a34a] dark:text-[#22c55e] flex-shrink-0 mt-0.5" />
                        <span>General contracting and project management</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-5 h-5 text-[#16a34a] dark:text-[#22c55e] flex-shrink-0 mt-0.5" />
                        <span>Residential and commercial construction</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-5 h-5 text-[#16a34a] dark:text-[#22c55e] flex-shrink-0 mt-0.5" />
                        <span>Renovation and remodeling services</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-5 h-5 text-[#16a34a] dark:text-[#22c55e] flex-shrink-0 mt-0.5" />
                        <span>Consultation and design services</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Client Obligations */}
              <div className="card p-8">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[var(--color-accent-soft)] rounded-xl flex items-center justify-center flex-shrink-0">
                    <Users className="w-6 h-6 text-[var(--color-accent)]" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-[var(--color-foreground)] mb-2">Client Obligations</h2>
                    <p className="text-[var(--color-muted)] leading-relaxed mb-4">
                      As a client of Nenes Construction, you agree to:
                    </p>
                    <ul className="space-y-2 text-[var(--color-muted)]">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-5 h-5 text-[#16a34a] dark:text-[#22c55e] flex-shrink-0 mt-0.5" />
                        <span>Provide accurate and complete information about your project requirements</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-5 h-5 text-[#16a34a] dark:text-[#22c55e] flex-shrink-0 mt-0.5" />
                        <span>Ensure timely payments as per the agreed payment schedule</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-5 h-5 text-[#16a34a] dark:text-[#22c55e] flex-shrink-0 mt-0.5" />
                        <span>Provide necessary access to the construction site as required</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-5 h-5 text-[#16a34a] dark:text-[#22c55e] flex-shrink-0 mt-0.5" />
                        <span>Cooperate with our team and follow professional recommendations</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Payment Terms */}
              <div className="card p-8">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[var(--color-accent-soft)] rounded-xl flex items-center justify-center flex-shrink-0">
                    <Scale className="w-6 h-6 text-[var(--color-accent)]" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-[var(--color-foreground)] mb-2">Payment Terms</h2>
                    <div className="space-y-3 text-[var(--color-muted)]">
                      <p>
                        Payment terms will be specified in individual project contracts. Generally:
                      </p>
                      <ul className="space-y-2">
                        <li className="flex items-start gap-2">
                          <CheckCircle className="w-5 h-5 text-[#16a34a] dark:text-[#22c55e] flex-shrink-0 mt-0.5" />
                          <span>A deposit may be required before commencement of work</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="w-5 h-5 text-[#16a34a] dark:text-[#22c55e] flex-shrink-0 mt-0.5" />
                          <span>Progress payments may be scheduled based on project milestones</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="w-5 h-5 text-[#16a34a] dark:text-[#22c55e] flex-shrink-0 mt-0.5" />
                          <span>Final payment is due upon project completion and client satisfaction</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="w-5 h-5 text-[#16a34a] dark:text-[#22c55e] flex-shrink-0 mt-0.5" />
                          <span>Late payments may incur additional charges as specified in the contract</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* Limitations of Liability */}
              <div className="card p-8">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[var(--color-accent-soft)] rounded-xl flex items-center justify-center flex-shrink-0">
                    <AlertCircle className="w-6 h-6 text-[var(--color-accent)]" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-[var(--color-foreground)] mb-2">Limitations of Liability</h2>
                    <p className="text-[var(--color-muted)] leading-relaxed">
                      Nenes Construction shall not be liable for any indirect, incidental, special, 
                      consequential, or punitive damages arising from the use of our services. Our 
                      total liability is limited to the total fees paid by the client for the specific 
                      project in question. We are not responsible for delays caused by circumstances 
                      beyond our control, including but not limited to weather conditions, material 
                      shortages, or third-party actions.
                    </p>
                  </div>
                </div>
              </div>

              {/* Intellectual Property */}
              <div className="card p-8">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[var(--color-accent-soft)] rounded-xl flex items-center justify-center flex-shrink-0">
                    <FileText className="w-6 h-6 text-[var(--color-accent)]" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-[var(--color-foreground)] mb-2">Intellectual Property</h2>
                    <p className="text-[var(--color-muted)] leading-relaxed">
                      All content on this website, including text, graphics, logos, images, and software, 
                      is the property of Nenes Construction and is protected by copyright laws. You may 
                      not reproduce, distribute, or create derivative works without our express written 
                      permission. All designs, plans, and construction methodologies developed by Nenes 
                      Construction remain our intellectual property.
                    </p>
                  </div>
                </div>
              </div>

              {/* Termination */}
              <div className="card p-8">
                <h2 className="text-2xl font-bold text-[var(--color-foreground)] mb-2">Termination</h2>
                <p className="text-[var(--color-muted)] leading-relaxed">
                  Either party may terminate a project contract with written notice. Termination 
                  terms, including any applicable fees or penalties, will be specified in the 
                  individual project contract. We reserve the right to suspend or terminate services 
                  if a client breaches these terms or fails to make timely payments.
                </p>
              </div>

              {/* Contact Information */}
              <div className="card p-8 bg-[var(--color-accent-soft)] border border-[var(--color-accent)]/20">
                <h2 className="text-2xl font-bold text-[var(--color-foreground)] mb-2">Questions About These Terms?</h2>
                <p className="text-[var(--color-muted)] leading-relaxed mb-4">
                  If you have any questions about these Terms of Service, please contact us:
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