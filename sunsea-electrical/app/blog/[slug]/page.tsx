"use client";

import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft, Calendar, User, Tag, Clock, ArrowRight, Share2, Heart } from "lucide-react";

const blogPosts = [
  {
    slug: "solar-energy-kenya-2025-guide",
    title: "The Complete Guide to Solar Energy in Kenya (2025)",
    excerpt: "Everything you need to know about switching to solar power in Kenya, from costs to installation and government incentives.",
    content: `Solar energy is transforming Kenya's energy landscape. With abundant sunshine year-round, businesses and homeowners are increasingly turning to solar power to reduce electricity costs and ensure energy independence.

## Why Solar in Kenya?

Kenya receives an average of 5-7 kWh/m² of solar radiation daily, making it one of the best locations in the world for solar energy generation. This abundant resource, combined with falling solar panel costs and government incentives, has created a perfect environment for solar adoption.

## Cost Considerations

The initial investment for a solar system in Kenya typically ranges from KES 150,000 for a basic residential setup to KES 2 million+ for commercial installations. However, with proper planning, most systems pay for themselves within 3-5 years through electricity savings.

## Installation Process

1. **Site Assessment**: Our engineers evaluate your property's solar potential
2. **System Design**: Custom design based on your energy needs
3. **Permitting**: We handle all regulatory requirements
4. **Installation**: Professional installation by certified technicians
5. **Commissioning**: System testing and grid connection
6. **Monitoring**: Ongoing performance tracking

## Government Incentives

The Kenyan government offers several incentives for solar adoption, including tax exemptions on solar equipment and feed-in tariffs for excess power fed into the national grid.`,
    author: "John Kariuki",
    date: "March 15, 2025",
    readTime: "8 min read",
    category: "Solar Energy",
    image: "https://images.unsplash.com/photo-1509391366360-2e959784a276?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    tags: ["Solar", "Renewable Energy", "Kenya", "Energy Savings"],
  },
  {
    slug: "electrical-safety-tips-home",
    title: "10 Essential Electrical Safety Tips for Every Homeowner",
    excerpt: "Protect your family and property with these critical electrical safety guidelines every homeowner should know.",
    content: `Electrical safety should be a priority in every household. According to recent statistics, electrical faults account for a significant percentage of residential fires in Kenya. Here are ten essential tips to keep your home safe.

## 1. Regular Inspections
Schedule annual electrical inspections with a licensed electrician to identify potential hazards before they become problems.

## 2. Avoid Overloading Sockets
Plugging too many devices into a single outlet can cause overheating and fires. Use power strips with built-in surge protection.

## 3. Replace Damaged Cords
Frayed or damaged cords should be replaced immediately. Never use tape to repair electrical cords.

## 4. Install RCDs
Residual Current Devices (RCDs) automatically cut off power when they detect a fault, preventing electric shocks.

## 5. Keep Water Away
Water and electricity don't mix. Keep electrical devices away from water sources and never touch switches with wet hands.

## 6. Use Correct Bulbs
Always use light bulbs with the correct wattage for your fixtures to prevent overheating.

## 7. Childproof Outlets
Install safety covers on all outlets accessible to children.

## 8. Professional Repairs
Never attempt DIY electrical repairs. Always hire a licensed electrician for any electrical work.

## 9. Smoke Alarms
Install smoke alarms on every floor and test them monthly.

## 10. Emergency Plan
Have an emergency plan and ensure everyone in the household knows how to cut off the main power supply.`,
    author: "Grace Wanjiku",
    date: "March 10, 2025",
    readTime: "6 min read",
    category: "Safety",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    tags: ["Safety", "Home", "Electrical Tips", "Fire Prevention"],
  },
  {
    slug: "industrial-automation-trends",
    title: "Industrial Automation Trends Transforming Kenya's Manufacturing",
    excerpt: "Discover how smart automation and IoT are revolutionizing manufacturing plants across Kenya.",
    content: `The Fourth Industrial Revolution is here, and Kenya's manufacturing sector is embracing automation like never before. From PLC-based control systems to IoT-enabled monitoring, industrial automation is reshaping how factories operate.

## PLC and SCADA Systems
Programmable Logic Controllers (PLCs) and Supervisory Control and Data Acquisition (SCADA) systems form the backbone of modern industrial automation. These systems enable precise control of manufacturing processes, real-time monitoring, and data collection for optimization.

## IoT in Manufacturing
Internet of Things (IoT) sensors are being deployed across manufacturing plants to monitor equipment health, energy consumption, and production metrics. This data-driven approach enables predictive maintenance, reducing downtime by up to 50%.

## Robotics and Cobots
Collaborative robots (cobots) are increasingly being used in Kenyan manufacturing for tasks such as assembly, packaging, and quality inspection. These robots work alongside human operators, improving efficiency and safety.

## Energy Management
Smart energy management systems are helping manufacturers reduce their electricity costs by optimizing power usage based on production schedules and real-time pricing.`,
    author: "Peter Omondi",
    date: "March 5, 2025",
    readTime: "10 min read",
    category: "Industrial",
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    tags: ["Automation", "Industrial", "IoT", "Manufacturing"],
  },
  {
    slug: "smart-home-systems-nairobi",
    title: "Smart Home Systems: The Future of Living in Nairobi",
    excerpt: "From automated lighting to intelligent security, explore how smart home technology is reshaping Nairobi homes.",
    content: `Smart home technology is no longer a luxury — it's becoming a standard feature in modern Nairobi homes. With affordable IoT devices and reliable installation services, homeowners can now automate virtually every aspect of their living spaces.

## Smart Lighting
Automated lighting systems allow you to control lights remotely, set schedules, and create ambiance with color-changing bulbs. Energy savings of up to 30% are common with smart lighting.

## Intelligent Security
Modern smart security systems include video doorbells, motion sensors, and smart locks that can be monitored and controlled from anywhere via smartphone.

## Climate Control
Smart thermostats and HVAC controls learn your preferences and optimize energy usage, maintaining comfort while reducing electricity bills.

## Voice Control
Integration with voice assistants like Amazon Alexa and Google Assistant enables hands-free control of all connected devices.`,
    author: "Sarah Nyambura",
    date: "February 28, 2025",
    readTime: "7 min read",
    category: "Smart Home",
    image: "https://images.unsplash.com/photo-1558002038-1055907df827?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    tags: ["Smart Home", "IoT", "Nairobi", "Home Automation"],
  },
  {
    slug: "energy-audit-benefits",
    title: "Why Your Business Needs an Energy Audit in 2025",
    excerpt: "Learn how a professional energy audit can reduce your electricity bills by up to 40%.",
    content: `With rising electricity costs in Kenya, businesses are seeking ways to optimize their energy consumption. A professional energy audit is the first step toward significant savings and improved sustainability.

## What is an Energy Audit?
An energy audit is a systematic inspection and analysis of energy use in a building or facility. It identifies opportunities to reduce energy consumption and costs.

## The Audit Process
1. **Data Collection**: Review of utility bills and energy consumption patterns
2. **Site Inspection**: Physical inspection of all energy-consuming systems
3. **Analysis**: Detailed analysis of energy usage and identification of inefficiencies
4. **Recommendations**: Actionable recommendations for energy savings
5. **Implementation Support**: Assistance with implementing recommended measures

## Typical Savings
Businesses typically achieve 20-40% reduction in energy costs after implementing audit recommendations, with payback periods of 6-18 months.`,
    author: "John Kariuki",
    date: "February 20, 2025",
    readTime: "5 min read",
    category: "Energy",
    image: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    tags: ["Energy Audit", "Business", "Cost Savings", "Efficiency"],
  },
  {
    slug: "commercial-electrical-installation",
    title: "Commercial Electrical Installation: A Complete Project Guide",
    excerpt: "A step-by-step guide to planning and executing commercial electrical projects in Kenya.",
    content: `Commercial electrical installations require careful planning, compliance with regulations, and professional execution. Whether you're building a new office or retrofitting an existing space, this guide covers everything you need to know.

## Planning Phase
- Load assessment and capacity planning
- Compliance with Kenya Bureau of Standards (KEBS) requirements
- Budget estimation and timeline
- Permitting and approvals

## Design Considerations
- Power distribution layout
- Emergency backup systems
- Lighting design for productivity
- Fire alarm and safety systems
- Data and communication infrastructure

## Installation Best Practices
- Use of quality materials and components
- Proper cable sizing and routing
- Compliance with electrical codes
- Safety protocols during installation
- Documentation and labeling

## Commissioning
- System testing and verification
- Load balancing
- Training for facility managers
- Handover documentation`,
    author: "Grace Wanjiku",
    date: "February 15, 2025",
    readTime: "9 min read",
    category: "Commercial",
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    tags: ["Commercial", "Installation", "Project Management", "Compliance"],
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
