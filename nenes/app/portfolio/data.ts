// Central portfolio data for Nenes Construction
// Single source of truth used by:
//  - /portfolio (listing page)
//  - /portfolio/[slug] (project detail page)
//  - / (home featured projects)

export interface Project {
  slug: string;
  title: string;
  location: string;
  category: string;
  description: string;
  details?: string;
  image: string;
  year: string;
  duration: string;
  testimonial?: {
    quote: string;
    author: string;
  };
  materials: string[];
  gallery?: string[];
}

export const PORTFOLIO_PROJECTS: Project[] = [
  {
    slug: "greenpark-residential-estate",
    title: "Greenpark Residential Estate",
    location: "Nairobi",
    category: "Residential",
    description: "A 50-unit luxury residential estate with modern architecture, landscaped gardens, and premium finishes.",
    details:
      "This project involved the complete construction of 50 residential units including site preparation, foundation work, structural framing, roofing, interior finishing, and landscaping. The estate features modern architecture with energy-efficient designs.",
    image:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    year: "2023",
    duration: "18 months",
    testimonial: {
      quote:
        "Nenes exceeded our expectations with exceptional quality and attention to detail. The team was professional throughout.",
      author: "James Mwangi, Greenpark Developers",
    },
    materials: [
      "Reinforced concrete",
      "Natural stone cladding",
      "Double-glazed windows",
      "Premium roofing tiles",
    ],
    gallery: [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600607687644-c7171b42498f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    ],
  },
  {
    slug: "westside-commercial-tower",
    title: "Westside Commercial Tower",
    location: "Mombasa",
    category: "Commercial",
    description: "A 12-storey commercial tower featuring office spaces, retail outlets, and rooftop gardens.",
    details:
      "We designed and built this 12-storey commercial tower with reinforced concrete structure, glass curtain wall facade, modern HVAC systems, and smart building management. The building includes retail spaces on the ground floor, office spaces on upper floors, and a rooftop garden.",
    image:
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    year: "2023",
    duration: "24 months",
    testimonial: {
      quote: "The tower has become a landmark in Mombasa. Professional execution from start to finish.",
      author: "Grace Akinyi, Westside Properties",
    },
    materials: [
      "Structural steel",
      "Glass curtain wall",
      "High-strength concrete",
      "Elevator systems",
    ],
    gallery: [
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    ],
  },
  {
    slug: "eldoret-industrial-warehouse",
    title: "Eldoret Industrial Warehouse",
    location: "Eldoret",
    category: "Industrial",
    description: "A 10,000 sqm industrial warehouse with loading bays, office blocks, and heavy-duty flooring.",
    details:
      "We constructed this large-scale industrial warehouse featuring steel portal frame structure, concrete ground slab with heavy-duty flooring, loading docks, office mezzanine, and fire suppression systems. The facility meets international industrial standards.",
    image:
      "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    year: "2022",
    duration: "12 months",
    testimonial: {
      quote: "Efficient construction that has significantly improved our logistics operations.",
      author: "Peter Kamau, Eldoret Industries",
    },
    materials: [
      "Pre-engineered steel",
      "Industrial concrete flooring",
      "Insulated roof panels",
      "Loading dock systems",
    ],
    gallery: [
      "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    ],
  },
  {
    slug: "nairobi-hospital-extension",
    title: "Nairobi Hospital Wing Extension",
    location: "Nairobi",
    category: "Healthcare",
    description: "A 200-bed hospital wing with operating theatres, ICU, and modern medical infrastructure.",
    details:
      "This critical healthcare project involved constructing a new wing with reinforced concrete structure, specialized medical gas systems, backup power, HVAC for operating theatres, and modern patient rooms. The facility meets international healthcare standards.",
    image:
      "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    year: "2023",
    duration: "20 months",
    testimonial: {
      quote:
        "State-of-the-art medical facility built to international standards. A game-changer for healthcare.",
      author: "Dr. Sarah Ochieng, Nairobi Hospital",
    },
    materials: [
      "Medical-grade finishes",
      "HVAC systems",
      "Backup power systems",
      "Medical gas piping",
    ],
    gallery: [
      "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    ],
  },
  {
    slug: "kisumu-mall-construction",
    title: "Kisumu Shopping Mall",
    location: "Kisumu",
    category: "Commercial",
    description: "A modern shopping mall with retail spaces, food court, cinema, and underground parking.",
    details:
      "We provided end-to-end construction services for this modern shopping mall, including structural works, architectural finishes, MEP systems, elevators, and comprehensive fire safety systems. The mall features a food court, cinema complex, and parking for 500 cars.",
    image:
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    year: "2024",
    duration: "22 months",
    testimonial: {
      quote: "Transformed the retail landscape in Kisumu. A beautiful, functional space.",
      author: "Michael Otieno, Mall Developers",
    },
    materials: [
      "Structural steel",
      "Glass facades",
      "Premium flooring",
      "LED lighting systems",
    ],
    gallery: [
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    ],
  },
  {
    slug: "nakuru-housing-project",
    title: "Nakuru Affordable Housing",
    location: "Nakuru",
    category: "Residential",
    description: "A 200-unit affordable housing project with community amenities and green spaces.",
    details:
      "We constructed 200 affordable housing units with modern construction techniques for cost efficiency. The project includes community centers, playgrounds, green spaces, and sustainable infrastructure. Each unit features quality finishes and energy-efficient design.",
    image:
      "https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    year: "2023",
    duration: "16 months",
    testimonial: {
      quote: "Quality affordable housing that has improved living standards for many families.",
      author: "Mary Wanjiru, County Government",
    },
    materials: [
      "Concrete blocks",
      "Roofing tiles",
      "Plumbing systems",
      "Solar water heating",
    ],
    gallery: [
      "https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    ],
  },
];

export const getProjectBySlug = (slug: string): Project | undefined => {
  return PORTFOLIO_PROJECTS.find((p) => p.slug === slug);
};

export const getRelatedProjects = (current: Project, limit: number = 3): Project[] => {
  return PORTFOLIO_PROJECTS.filter((p) => p.slug !== current.slug).slice(0, limit);
};

