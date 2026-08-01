"use client";

import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft, Calendar, User, Tag, Clock, ArrowRight, Share2, Heart } from "lucide-react";

const blogPosts = [
  {
    slug: "construction-cost-guide-kenya-2025",
    title: "The Complete Guide to Construction Costs in Kenya (2025)",
    excerpt: "Everything you need to know about building costs in Kenya, from materials to labor and permits.",
    content: `Building a home or commercial property in Kenya requires careful budgeting and planning. Here's a comprehensive guide to construction costs in 2025.

## Understanding Construction Costs

Construction costs in Kenya vary significantly based on location, materials, and project scope. On average, residential construction costs range from KES 40,000 to KES 80,000 per square meter.

## Key Cost Factors

### Materials
The cost of materials accounts for approximately 50-60% of the total construction budget. Key materials include:
- **Cement**: KES 650-750 per bag
- **Steel (rebar)**: KES 130-160 per kg
- **Sand**: KES 3,000-5,000 per ton
- **Ballast**: KES 3,500-5,500 per ton

### Labor
Labor costs typically account for 25-35% of the budget. Skilled labor rates:
- **Mason**: KES 800-1,200 per day
- **Carpenter**: KES 800-1,200 per day
- **Electrician**: KES 1,500-2,500 per day
- **Plumber**: KES 1,500-2,500 per day

### Permits and Approvals
Budget for permits, approvals, and inspections: approximately 2-5% of total project cost.

## Cost Breakdown by Project Type

- **Basic residential home (3-bedroom)**: KES 4-6 million
- **Standard residential home (4-bedroom)**: KES 8-12 million
- **Luxury home**: KES 15-30 million+
- **Small commercial building**: KES 10-20 million
- **Large commercial complex**: KES 50 million+

## Tips for Cost Management

1. Get multiple quotes from contractors
2. Plan thoroughly to avoid changes during construction
3. Buy materials in bulk when possible
4. Consider phased construction for large projects
5. Work with a professional project manager`,
    author: "John Kariuki",
    date: "March 15, 2025",
    readTime: "8 min read",
    category: "Construction",
    image: "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    tags: ["Construction Costs", "Building", "Kenya", "Budgeting"],
  },
  {
    slug: "essential-tips-choosing-contractor",
    title: "10 Essential Tips for Choosing the Right Contractor",
    excerpt: "Protect your investment with these critical guidelines for selecting a reliable construction contractor.",
    content: `Choosing the right contractor is the most important decision in any construction project. Here are ten essential tips to help you make the right choice.

## 1. Check Credentials
Verify that the contractor is licensed, insured, and registered with relevant professional bodies.

## 2. Review Past Projects
Ask for a portfolio of completed projects and contact previous clients for references.

## 3. Get Multiple Quotes
Obtain at least three detailed quotes from different contractors for comparison.

## 4. Verify Experience
Ensure the contractor has specific experience in the type of project you're planning.

## 5. Check Communication
Choose a contractor who communicates clearly and responds promptly to inquiries.

## 6. Review Contracts Carefully
Read all contract terms, including payment schedules, timelines, and warranty provisions.

## 7. Visit Active Sites
Ask to visit current construction sites to see the contractor's work quality firsthand.

## 8. Check Safety Record
Inquire about the contractor's safety record and protocols.

## 9. Understand Payment Terms
Avoid contractors who demand large upfront payments. A standard payment schedule is 10-30% upfront, with progress payments.

## 10. Trust Your Instincts
If something feels off, don't ignore it. A good working relationship is crucial for project success.`,
    author: "Grace Wanjiku",
    date: "March 10, 2025",
    readTime: "6 min read",
    category: "Advice",
    image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    tags: ["Contractor", "Tips", "Construction", "Hiring"],
  },
  {
    slug: "green-building-trends-kenya",
    title: "Green Building Trends Transforming Kenya's Construction",
    excerpt: "Discover how sustainable building practices are revolutionizing construction across Kenya.",
    content: `Sustainable construction is no longer optional — it's becoming the standard. Here's how green building is transforming Kenya's construction industry.

## Why Green Building Matters

Green building reduces environmental impact, lowers operating costs, and improves occupant health and productivity. In Kenya, the demand for sustainable buildings is growing rapidly.

## Key Trends

### Energy-Efficient Design
Modern buildings incorporate passive solar design, natural ventilation, and energy-efficient lighting to reduce energy consumption by up to 40%.

### Sustainable Materials
Builders are increasingly using locally sourced, recycled, and low-carbon materials such as stabilized earth blocks, recycled steel, and bamboo.

### Water Conservation
Rainwater harvesting, greywater recycling, and water-efficient fixtures are becoming standard in new developments.

### Green Roofs and Walls
Rooftop gardens and vertical green walls improve insulation, reduce urban heat island effect, and enhance aesthetics.

### Smart Building Technology
IoT sensors, automated lighting, and smart HVAC systems optimize energy usage and improve comfort.

## Benefits of Green Building

- **Lower operating costs**: Up to 30% reduction in energy and water bills
- **Higher property value**: Green buildings command 10-15% premium
- **Better health**: Improved indoor air quality and natural lighting
- **Environmental impact**: Reduced carbon footprint and waste`,
    author: "Peter Omondi",
    date: "March 5, 2025",
    readTime: "10 min read",
    category: "Sustainability",
    image: "https://images.unsplash.com/photo-1590584883493-8f1e2e375ffc?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    tags: ["Green Building", "Sustainability", "Environment", "Construction"],
  },
  {
    slug: "modern-home-design-nairobi",
    title: "Modern Home Design Trends in Nairobi for 2025",
    excerpt: "From open-plan living to smart home integration, explore the latest in Nairobi home design.",
    content: `Nairobi's home design scene is evolving rapidly. Here are the top trends shaping modern homes in Kenya's capital.

## Open-Plan Living
Modern homes are moving away from compartmentalized rooms toward open-plan layouts that combine living, dining, and kitchen areas.

## Indoor-Outdoor Integration
Large sliding doors, verandas, and outdoor living spaces blur the line between indoor and outdoor living.

## Smart Home Technology
Automated lighting, security systems, and climate control are becoming standard features in new homes.

## Sustainable Design
Solar panels, rainwater harvesting, and energy-efficient appliances are increasingly popular.

## Minimalist Aesthetics
Clean lines, neutral color palettes, and uncluttered spaces define modern home design.

## Local Materials
There's a growing appreciation for locally sourced materials such as natural stone, timber, and handmade tiles.`,
    author: "Sarah Nyambura",
    date: "February 28, 2025",
    readTime: "7 min read",
    category: "Design",
    image: "https://images.unsplash.com/photo-1600585152220-90363fe7e115?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    tags: ["Home Design", "Nairobi", "Architecture", "Interior"],
  },
  {
    slug: "commercial-building-regulations",
    title: "Commercial Building Regulations in Kenya: A Guide",
    excerpt: "Navigate Kenya's building codes and regulations for commercial construction projects.",
    content: `Understanding building regulations is crucial for any commercial project. Here's what you need to know about commercial building regulations in Kenya.

## National Building Code
Kenya's National Building Code sets the standards for all construction projects. Key requirements include:
- Structural integrity standards
- Fire safety requirements
- Accessibility provisions
- Sanitary and plumbing standards

## County Approvals
Each county has its own planning and building approval processes. You'll need:
- Architectural drawings approved by county planning
- Structural engineering reports
- Environmental impact assessment
- Fire safety compliance certificate

## Key Regulatory Bodies
- **National Construction Authority (NCA)**: Contractor registration and project registration
- **Kenya Bureau of Standards (KEBS)**: Material quality standards
- **County Governments**: Planning and building permits
- **National Environment Management Authority (NEMA)**: Environmental compliance

## Compliance Checklist
1. Engage registered professionals
2. Submit complete architectural and structural plans
3. Obtain all necessary permits before construction
4. Schedule regular inspections during construction
5. Obtain certificate of occupancy upon completion`,
    author: "John Kariuki",
    date: "February 20, 2025",
    readTime: "5 min read",
    category: "Regulations",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    tags: ["Regulations", "Commercial", "Compliance", "Building Codes"],
  },
  {
    slug: "residential-construction-process",
    title: "Residential Construction: A Complete Step-by-Step Guide",
    excerpt: "A comprehensive guide to the residential construction process in Kenya, from foundation to handover.",
    content: `Building your dream home involves many stages. Here's a complete step-by-step guide to residential construction in Kenya.

## Stage 1: Planning and Design
- Site selection and soil testing
- Architectural design and structural engineering
- Budget planning and financing
- Permit applications

## Stage 2: Site Preparation
- Clearing and leveling
- Setting out and pegging
- Temporary facilities setup

## Stage 3: Foundation
- Excavation
- Foundation concrete works
- Damp proofing
- Backfilling

## Stage 4: Structural Works
- Columns, beams, and slabs
- Masonry walls
- Roof structure

## Stage 5: Finishing
- Plastering and rendering
- Flooring
- Painting
- Tiling
- Ceiling installation

## Stage 6: MEP Services
- Electrical wiring and fittings
- Plumbing and drainage
- HVAC installation

## Stage 7: Final Works
- Landscaping
- Driveways and pathways
- Final cleaning
- Handover documentation`,
    author: "Grace Wanjiku",
    date: "February 15, 2025",
    readTime: "9 min read",
    category: "Construction",
    image: "https://images.unsplash.com/photo-1600573472550-8090b5e0745e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    tags: ["Residential", "Construction", "Home Building", "Guide"],
  },
];

interface BlogPostPageProps {
  params: {
    slug: string;
  };
}

export default function BlogPostPage({ params }: BlogPostPageProps) {
  const post = blogPosts.find((p) => p.slug === params.slug);

  if (!post) {
    notFound();
  }

  const relatedPosts = blogPosts
    .filter((p) => p.slug !== post.slug && p.category === post.category)
    .slice(0, 3);

  return (
    <div className="section-padding section-alt">
      <div className="container-custom">
        {/* Back link */}
        <Link
          href="/blog"
          className="inline-flex items-center text-[var(--color-muted)] hover:text-[var(--color-accent)] transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Blog
        </Link>

        <article className="max-w-4xl mx-auto">
          {/* Hero Image */}
          <div className="aspect-[16/9] rounded-2xl overflow-hidden mb-8 shadow-xl">
            <Image
              src={post.image}
              alt={post.title}
              width={1200}
              height={675}
              className="w-full h-full object-cover"
              priority
            />
          </div>

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-4 mb-6">
            <span className="badge badge-accent">{post.category}</span>
            <span className="flex items-center text-sm text-[var(--color-muted)]">
              <Calendar className="w-4 h-4 mr-1.5" />
              {post.date}
            </span>
            <span className="flex items-center text-sm text-[var(--color-muted)]">
              <Clock className="w-4 h-4 mr-1.5" />
              {post.readTime}
            </span>
            <span className="flex items-center text-sm text-[var(--color-muted)]">
              <User className="w-4 h-4 mr-1.5" />
              {post.author}
            </span>
          </div>

          {/* Title */}
          <h1 className="heading-lg text-[var(--color-primary)] mb-6">
            {post.title}
          </h1>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-8">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 px-3 py-1.5 bg-[var(--color-section-alt)] border border-[var(--color-card-border)] text-[var(--color-muted)] rounded-lg text-xs font-medium hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] transition-colors cursor-default"
              >
                <Tag className="w-3 h-3" />
                {tag}
              </span>
            ))}
          </div>

          {/* Content */}
          <div className="prose prose-lg max-w-none dark:prose-invert prose-headings:text-[var(--color-primary)] dark:prose-headings:text-white prose-a:text-[var(--color-accent)] dark:prose-a:text-[var(--color-accent)] prose-img:rounded-xl">
            {post.content.split("\n").map((paragraph, i) => {
              if (paragraph.startsWith("## ")) {
                return (
                  <h2 key={i} className="text-2xl font-bold text-[var(--color-primary)] dark:text-white mt-10 mb-4">
                    {paragraph.replace("## ", "")}
                  </h2>
                );
              }
              if (paragraph.startsWith("# ")) {
                return (
                  <h1 key={i} className="text-3xl font-bold text-[var(--color-primary)] dark:text-white mt-10 mb-4">
                    {paragraph.replace("# ", "")}
                  </h1>
                );
              }
              if (paragraph.startsWith("- ")) {
                return (
                  <li key={i} className="text-[var(--color-muted)] ml-4 mb-1">
                    {paragraph.replace("- ", "")}
                  </li>
                );
              }
              if (paragraph.match(/^\d+\. /)) {
                const match = paragraph.match(/^\d+\. (.*)/);
                return (
                  <li key={i} className="text-[var(--color-muted)] ml-4 mb-1 list-decimal">
                    {match ? match[1] : paragraph}
                  </li>
                );
              }
              if (paragraph.trim() === "") {
                return <div key={i} className="h-4" />;
              }
              if (paragraph.startsWith("**")) {
                return (
                  <p key={i} className="text-[var(--color-muted)] leading-relaxed mb-2 font-semibold">
                    {paragraph}
                  </p>
                );
              }
              return (
                <p key={i} className="text-[var(--color-muted)] leading-relaxed mb-4">
                  {paragraph}
                </p>
              );
            })}
          </div>

          {/* Share */}
          <div className="flex items-center justify-between mt-12 pt-8 border-t border-[var(--color-card-border)]">
            <div className="flex items-center gap-4">
              <span className="text-sm font-semibold text-[var(--color-foreground)]">Share this article</span>
              <button className="p-2 rounded-xl bg-[var(--color-section-alt)] hover:bg-[var(--color-accent-soft)] text-[var(--color-muted)] hover:text-[var(--color-accent)] hover:scale-105 transition-all" aria-label="Share article">
                <Share2 className="w-4 h-4" />
              </button>
              <button className="p-2 rounded-xl bg-[var(--color-section-alt)] hover:bg-[var(--color-accent-soft)] text-[var(--color-muted)] hover:text-[var(--color-accent)] hover:scale-105 transition-all" aria-label="Like article">
                <Heart className="w-4 h-4" />
              </button>
            </div>
            <Link
              href="/#contact"
              className="btn-primary text-sm py-2.5 px-5"
            >
              Get Expert Advice <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </article>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-[var(--color-primary)] mb-8">
              Related Articles
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedPosts.map((related) => (
                <Link
                  key={related.slug}
                  href={`/blog/${related.slug}`}
                  className="card overflow-hidden group hover-lift"
                >
                  <div className="aspect-[16/10] overflow-hidden">
                    <Image
                      src={related.image}
                      alt={related.title}
                      width={400}
                      height={250}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-4">
                    <span className="badge badge-accent text-[10px]">{related.category}</span>
                    <h3 className="font-bold text-[var(--color-foreground)] mt-2 text-sm group-hover:text-[var(--color-accent)] transition-colors line-clamp-2">
                      {related.title}
                    </h3>
                    <p className="text-xs text-[var(--color-muted)] mt-2 line-clamp-2">
                      {related.excerpt}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
