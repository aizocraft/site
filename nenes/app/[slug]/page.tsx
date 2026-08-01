import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft, Calendar, MapPin, Briefcase, CheckCircle, ArrowRight } from "lucide-react";

const projects = [
  {
    slug: "greenpark-residential-estate",
    title: "Greenpark Residential Estate",
    location: "Nairobi",
    category: "Residential",
    description: "A 50-unit luxury residential estate with modern architecture, landscaped gardens, and premium finishes.",
    details: "This project involved the complete construction of 50 residential units including site preparation, foundation work, structural framing, roofing, interior finishing, and landscaping. The estate features modern architecture with energy-efficient designs.",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    date: "January 2025",
    stats: [
      { label: "Project Duration", value: "14 months" },
      { label: "Team Size", value: "45 workers" },
      { label: "Total Area", value: "12,000 sqm" },
    ],
  },
  {
    slug: "westside-commercial-tower",
    title: "Westside Commercial Tower",
    location: "Mombasa",
    category: "Commercial",
    description: "A 12-storey commercial tower featuring office spaces, retail outlets, and rooftop gardens.",
    details: "We designed and built this 12-storey commercial tower with reinforced concrete structure, glass curtain wall facade, modern HVAC systems, and smart building management. The building includes retail spaces on the ground floor, office spaces on upper floors, and a rooftop garden.",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    date: "March 2025",
    stats: [
      { label: "Project Duration", value: "18 months" },
      { label: "Team Size", value: "60 workers" },
      { label: "Storeys", value: "12 floors" },
    ],
  },
  {
    slug: "eldoret-industrial-warehouse",
    title: "Eldoret Industrial Warehouse",
    location: "Eldoret",
    category: "Industrial",
    description: "A 10,000 sqm industrial warehouse with loading bays, office blocks, and heavy-duty flooring.",
    details: "We constructed this large-scale industrial warehouse featuring steel portal frame structure, concrete ground slab with heavy-duty flooring, loading docks, office mezzanine, and fire suppression systems. The facility meets international industrial standards.",
    image: "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    date: "May 2025",
    stats: [
      { label: "Project Duration", value: "10 months" },
      { label: "Team Size", value: "35 workers" },
      { label: "Total Area", value: "10,000 sqm" },
    ],
  },
  {
    slug: "nairobi-hospital-construction",
    title: "Nairobi Hospital Wing Extension",
    location: "Nairobi",
    category: "Healthcare",
    description: "A 200-bed hospital wing with operating theatres, ICU, and modern medical infrastructure.",
    details: "This critical healthcare project involved constructing a new wing with reinforced concrete structure, specialized medical gas systems, backup power, HVAC for operating theatres, and modern patient rooms. The facility meets international healthcare standards.",
    image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    date: "June 2025",
    stats: [
      { label: "Project Duration", value: "16 months" },
      { label: "Team Size", value: "50 workers" },
      { label: "Bed Capacity", value: "200 beds" },
    ],
  },
  {
    slug: "kisumu-mall-construction",
    title: "Kisumu Shopping Mall",
    location: "Kisumu",
    category: "Commercial",
    description: "A modern shopping mall with retail spaces, food court, cinema, and underground parking.",
    details: "We provided end-to-end construction services for this modern shopping mall, including structural works, architectural finishes, MEP systems, elevators, and comprehensive fire safety systems. The mall features a food court, cinema complex, and parking for 500 cars.",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    date: "April 2025",
    stats: [
      { label: "Project Duration", value: "20 months" },
      { label: "Team Size", value: "70 workers" },
      { label: "Retail Spaces", value: "80+ units" },
    ],
  },
  {
    slug: "nakuru-housing-project",
    title: "Nakuru Affordable Housing",
    location: "Nakuru",
    category: "Residential",
    description: "A 200-unit affordable housing project with community amenities and green spaces.",
    details: "We constructed 200 affordable housing units with modern construction techniques for cost efficiency. The project includes community centers, playgrounds, green spaces, and sustainable infrastructure. Each unit features quality finishes and energy-efficient design.",
    image: "https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    date: "February 2025",
    stats: [
      { label: "Project Duration", value: "12 months" },
      { label: "Team Size", value: "40 workers" },
      { label: "Total Units", value: "200 units" },
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
