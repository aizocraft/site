import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft, Calendar, MapPin, Briefcase, CheckCircle, ArrowRight } from "lucide-react";

const projects = [
  {
    slug: "kcb-tower-backup-system",
    title: "KCB Tower Backup System",
    location: "Nairobi",
    category: "Commercial",
    description: "Complete backup power system installation for Kenya's tallest building, ensuring uninterrupted operations.",
    details: "This project involved installing a comprehensive backup power system including generators, UPS units, and automatic transfer switches. The system ensures that the building's critical systems remain operational during power outages.",
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    date: "January 2025",
    stats: [
      { label: "Project Duration", value: "3 months" },
      { label: "Team Size", value: "12 engineers" },
      { label: "Power Capacity", value: "2.5MW" },
    ],
  },
  {
    slug: "mombasa-solar-farm",
    title: "Mombasa Solar Farm",
    location: "Mombasa",
    category: "Solar",
    description: "Large-scale solar farm providing clean energy to over 5,000 homes in the coastal region.",
    details: "This 10MW solar farm features over 30,000 solar panels and advanced tracking systems. The project includes grid integration and battery storage for consistent power supply.",
    image: "https://images.unsplash.com/photo-1509391366360-2e959784a276?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    date: "March 2025",
    stats: [
      { label: "Project Duration", value: "6 months" },
      { label: "Team Size", value: "25 engineers" },
      { label: "Power Capacity", value: "10MW" },
    ],
  },
  {
    slug: "eldoret-industrial-plant",
    title: "Eldoret Industrial Plant",
    location: "Eldoret",
    category: "Industrial",
    description: "Complete electrical infrastructure for a major manufacturing plant, including automation systems.",
    details: "We designed and installed the entire electrical infrastructure for this manufacturing facility, including high-voltage distribution, motor control centers, and PLC-based automation systems.",
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    date: "May 2025",
    stats: [
      { label: "Project Duration", value: "4 months" },
      { label: "Team Size", value: "18 engineers" },
      { label: "Power Capacity", value: "5MW" },
    ],
  },
  {
    slug: "nairobi-hospital-backup-power",
    title: "Nairobi Hospital Backup Power",
    location: "Nairobi",
    category: "Healthcare",
    description: "Critical backup power systems for a leading hospital, ensuring life-saving equipment always stays on.",
    details: "This critical infrastructure project involved installing redundant backup power systems for operating theaters, intensive care units, and other life-critical departments.",
    image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    date: "June 2025",
    stats: [
      { label: "Project Duration", value: "2 months" },
      { label: "Team Size", value: "8 engineers" },
      { label: "Power Capacity", value: "1.2MW" },
    ],
  },
  {
    slug: "kisumu-mall-electrical-systems",
    title: "Kisumu Mall Electrical Systems",
    location: "Kisumu",
    category: "Commercial",
    description: "Full electrical installation for a modern shopping mall, including lighting, HVAC, and security systems.",
    details: "We provided end-to-end electrical services for this mall, including power distribution, LED lighting, HVAC systems, and comprehensive security and fire alarm systems.",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    date: "April 2025",
    stats: [
      { label: "Project Duration", value: "5 months" },
      { label: "Team Size", value: "15 engineers" },
      { label: "Power Capacity", value: "3MW" },
    ],
  },
  {
    slug: "nakuru-residential-solar",
    title: "Nakuru Residential Solar",
    location: "Nakuru",
    category: "Residential",
    description: "Solar panel installation for a luxury residential estate, reducing energy costs by 60%.",
    details: "We installed solar panels on 50 homes in this estate, including inverters, batteries, and monitoring systems. Residents now enjoy significant savings on their electricity bills.",
    image: "https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    date: "February 2025",
    stats: [
      { label: "Project Duration", value: "3 months" },
      { label: "Team Size", value: "10 engineers" },
      { label: "Homes Powered", value: "50+ homes" },
    ],
  },
];

interface ProjectPageProps {
  params: {
    slug: string;
  };
}

export default function ProjectDetailPage({ params }: ProjectPageProps) {
  const project = projects.find((p) => p.slug === params.slug);

  if (!project) {
    notFound();
  }

  return (
    <div className="section-padding section-alt">
      <div className="container-custom">
        <Link
          href="/portfolio"
          className="inline-flex items-center text-[var(--color-muted)] hover:text-[var(--color-accent)] transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Portfolio
        </Link>

        <div className="card overflow-hidden hover-lift">
          <div className="aspect-[16/9] overflow-hidden">
            <Image
              src={project.image}
              alt={project.title}
              width={1200}
              height={675}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="p-6 md:p-8">
            <div className="flex flex-wrap items-center gap-4">
              <span className="badge badge-accent">{project.category}</span>
              <span className="flex items-center text-sm text-[var(--color-muted)]">
                <MapPin className="w-4 h-4 mr-1.5" /> {project.location}
              </span>
              <span className="flex items-center text-sm text-[var(--color-muted)]">
                <Calendar className="w-4 h-4 mr-1.5" /> {project.date}
              </span>
            </div>

            <h1 className="heading-lg text-[var(--color-primary)] mt-4">{project.title}</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              {project.stats.map((stat) => (
                <div key={stat.label} className="bg-[var(--color-section-alt)] rounded-xl p-4 text-center border border-[var(--color-card-border)]">
                  <p className="text-lg font-bold text-[var(--color-primary)]">{stat.value}</p>
                  <p className="text-sm text-[var(--color-muted)]">{stat.label}</p>
                </div>
              ))}
            </div>

            <div className="mt-8 pt-8 border-t border-[var(--color-card-border)]">
              <h2 className="text-xl font-bold text-[var(--color-foreground)] mb-4">Project Overview</h2>
              <p className="text-[var(--color-muted)] leading-relaxed">{project.description}</p>
              <p className="text-[var(--color-muted)] leading-relaxed mt-4">{project.details}</p>
            </div>

            <div className="mt-8 pt-8 border-t border-[var(--color-card-border)] flex flex-wrap gap-4">
              <Link href="/#contact" className="btn-primary">
                Request a Similar Quote
              </Link>
              <Link href="/portfolio" className="btn-secondary">
                More Projects
              </Link>
            </div>
          </div>
        </div>

        {/* Related Projects */}
        <div className="mt-12">
          <h2 className="text-xl font-bold text-[var(--color-foreground)] mb-6">Related Projects</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {projects
              .filter((p) => p.slug !== project.slug && p.category === project.category)
              .slice(0, 3)
              .map((related) => (
                <Link
                  key={related.slug}
                  href={`/${related.slug}`}
                  className="card overflow-hidden group hover-lift"
                >
                  <div className="aspect-[4/3] overflow-hidden">
                    <Image
                      src={related.image}
                      alt={related.title}
                      width={400}
                      height={300}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-4">
                    <span className="badge badge-accent text-xs">{related.category}</span>
                    <h3 className="font-semibold text-[var(--color-foreground)] mt-1 group-hover:text-[var(--color-accent)] transition-colors">{related.title}</h3>
                    <p className="text-sm text-[var(--color-muted)]">{related.location}</p>
                  </div>
                </Link>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
