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
    image: "/gallery/1000318674.jpg",
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
      "/gallery/1000318674.jpg",
      "/gallery/1000318677.jpg",
      "/gallery/1000318680.jpg",
      "/gallery/1000318683.jpg",
    ],
  },
  {
    slug: "nakuru-residential-estate",
    title: "Nakuru Residential Estate",
    location: "Nakuru",
    category: "Residential",
    description: "A modern residential estate with 80 units featuring contemporary design and community amenities.",
    details:
      "We designed and built this residential estate with reinforced concrete structure, modern architectural finishes, landscaped gardens, and community facilities. The project includes 80 housing units with premium finishes and energy-efficient design.",
    image: "/gallery/1000318635.jpg",
    year: "2023",
    duration: "20 months",
    testimonial: {
      quote: "Quality residential development that has transformed the community.",
      author: "David Kiprop, Nakuru Developers",
    },
    materials: [
      "Reinforced concrete",
      "Modern cladding",
      "Aluminum windows",
      "Premium roofing",
    ],
    gallery: [
      "/gallery/1000318635.jpg",
      "/gallery/1000318638.jpg",
      "/gallery/1000318641.jpg",
    ],
  },
  {
    slug: "eldoret-industrial-complex",
    title: "Eldoret Industrial Complex",
    location: "Eldoret",
    category: "Industrial",
    description: "A 15,000 sqm industrial complex with manufacturing facilities, warehouses, and office blocks.",
    details:
      "We constructed this large-scale industrial complex featuring steel portal frame structures, heavy-duty concrete flooring, loading docks, office mezzanines, and fire suppression systems. The facility meets international industrial standards.",
    image: "/gallery/1000318643.jpg",
    year: "2022",
    duration: "14 months",
    testimonial: {
      quote: "Efficient construction that has significantly improved our manufacturing operations.",
      author: "Peter Kamau, Eldoret Industries",
    },
    materials: [
      "Pre-engineered steel",
      "Industrial concrete flooring",
      "Insulated roof panels",
      "Loading dock systems",
    ],
    gallery: [
      "/gallery/1000318643.jpg",
      "/gallery/1000318647.jpg",
      "/gallery/1000318649.jpg",
      "/gallery/1000318653.jpg",
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
    image: "/gallery/1000318656.jpg",
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
      "/gallery/1000318656.jpg",
      "/gallery/1000318657.jpg",
      "/gallery/1000318662.jpg",
    ],
  },
  {
    slug: "kisumu-commercial-center",
    title: "Kisumu Commercial Center",
    location: "Kisumu",
    category: "Commercial",
    description: "A modern commercial center with retail spaces, offices, food court, and underground parking.",
    details:
      "We provided end-to-end construction services for this modern commercial center, including structural works, architectural finishes, MEP systems, elevators, and comprehensive fire safety systems. The center features retail spaces, office floors, food court, and parking for 400 cars.",
    image: "/gallery/1000318663.jpg",
    year: "2024",
    duration: "22 months",
    testimonial: {
      quote: "Transformed the commercial landscape in Kisumu. A beautiful, functional space.",
      author: "Michael Otieno, Kisumu Developers",
    },
    materials: [
      "Structural steel",
      "Glass facades",
      "Premium flooring",
      "LED lighting systems",
    ],
    gallery: [
      "/gallery/1000318663.jpg",
      "/gallery/1000318668.jpg",
      "/gallery/1000318671.jpg",
    ],
  },
  {
    slug: "mombasa-commercial-tower",
    title: "Mombasa Commercial Tower",
    location: "Mombasa",
    category: "Commercial",
    description: "A 10-storey commercial tower featuring modern office spaces, retail outlets, and rooftop gardens.",
    details:
      "We designed and built this 10-storey commercial tower with reinforced concrete structure, glass curtain wall facade, modern HVAC systems, and smart building management. The building includes retail spaces on the ground floor, office spaces on upper floors, and a rooftop garden.",
    image: "/gallery/1000318686.jpg",
    year: "2024",
    duration: "24 months",
    testimonial: {
      quote: "The tower has become a landmark in Mombasa. Professional execution from start to finish.",
      author: "Grace Akinyi, Mombasa Properties",
    },
    materials: [
      "Structural steel",
      "Glass curtain wall",
      "High-strength concrete",
      "Elevator systems",
    ],
    gallery: [
      "/gallery/1000318686.jpg",
      "/gallery/1000318691.jpg",
      "/gallery/1000318693.jpg",
    ],
  },
];

export const getProjectBySlug = (slug: string): Project | undefined => {
  return PORTFOLIO_PROJECTS.find((p) => p.slug === slug);
};

export const getRelatedProjects = (current: Project, limit: number = 3): Project[] => {
  return PORTFOLIO_PROJECTS.filter((p) => p.slug !== current.slug).slice(0, limit);
};