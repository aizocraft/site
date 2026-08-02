export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  author: string;
  authorImage?: string;
  authorBio?: string;
  date: string;
  readTime: string;
  category: string;
  tags: string[];
  featured?: boolean;
}

export const BLOG_POSTS: BlogPost[] = [
  {
    id: "1",
    slug: "modern-construction-techniques-kenya-2026",
    title: "Modern Construction Techniques Transforming Kenya's Building Industry",
    excerpt: "Discover how innovative construction methods are revolutionizing the building industry in Kenya, from 3D printing to sustainable materials.",
    content: `
      <p>The construction industry in Kenya is undergoing a remarkable transformation. Modern techniques are not only speeding up construction timelines but also improving quality and sustainability. As the country continues to develop, innovative approaches are reshaping how we build.</p>
      
      <h2>3D Printing in Construction</h2>
      <p>One of the most exciting developments is the use of 3D printing technology. This innovative approach allows for rapid prototyping and construction of complex structures with minimal waste. Kenyan construction firms are increasingly adopting this technology to reduce costs and construction time.</p>
      
      <p>The benefits of 3D printing include:</p>
      <ul>
        <li>Reduced material waste by up to 60%</li>
        <li>Faster construction timelines</li>
        <li>Ability to create complex architectural designs</li>
        <li>Lower labor costs</li>
      </ul>
      
      <h2>Sustainable Building Materials</h2>
      <p>Kenyan builders are increasingly turning to sustainable materials like bamboo, recycled plastics, and locally sourced stones. These materials reduce environmental impact while maintaining structural integrity.</p>
      
      <h2>Smart Building Technologies</h2>
      <p>From automated lighting systems to smart security, technology is making buildings more efficient and comfortable for occupants. The integration of IoT devices in construction is creating smarter, more responsive buildings.</p>
    `,
    image: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    author: "David Munene",
    authorImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80",
    authorBio: "David Munene is a construction expert with over 10 years of experience in Kenya's building industry. He specializes in sustainable construction and innovative building techniques.",
    date: "January 15, 2026",
    readTime: "5 min read",
    category: "Construction",
    tags: ["Innovation", "Sustainability", "Technology", "Kenya"],
    featured: true
  },
  {
    id: "2",
    slug: "green-building-practices-east-africa-2026",
    title: "Green Building Practices Gaining Traction in East Africa",
    excerpt: "Explore the rising trend of green building practices in East Africa and how they're creating healthier, more sustainable communities.",
    content: `
      <p>Green building practices are becoming increasingly popular across East Africa. These practices focus on creating buildings that are environmentally responsible and resource-efficient throughout their lifecycle.</p>
      
      <h2>Energy Efficiency</h2>
      <p>Modern buildings in East Africa are incorporating energy-efficient designs, including solar panels, natural ventilation, and energy-saving lighting systems. These features significantly reduce operational costs and environmental impact.</p>
      
      <h2>Water Conservation</h2>
      <p>Rainwater harvesting and water recycling systems are becoming standard features in new constructions, helping address water scarcity issues in the region. These systems can reduce water consumption by up to 50%.</p>
      
      <h2>Sustainable Materials</h2>
      <p>Builders are using locally sourced and sustainable materials to reduce carbon footprint and support local economies. This approach also reduces transportation costs and emissions.</p>
    `,
    image: "https://images.unsplash.com/photo-1516156008625-3a9d6067fab5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    author: "David Munene",
    authorImage: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80",
    authorBio: "David Munene is passionate about sustainable development and has led numerous green building projects across East Africa.",
    date: "February 3, 2026",
    readTime: "4 min read",
    category: "Sustainability",
    tags: ["Green Building", "Sustainability", "Environment"]
  },
  {
    id: "3",
    slug: "future-of-residential-construction-kenya-2026",
    title: "The Future of Residential Construction in Kenya",
    excerpt: "From affordable housing to luxury estates, discover the trends shaping the future of residential construction in Kenya.",
    content: `
      <p>The residential construction sector in Kenya is evolving rapidly. New trends are emerging that cater to changing lifestyles and economic conditions.</p>
      
      <h2>Affordable Housing Solutions</h2>
      <p>Innovative building techniques and materials are making it possible to construct affordable housing without compromising on quality. The government's affordable housing program is driving this transformation.</p>
      
      <h2>Smart Homes</h2>
      <p>Technology integration in homes is becoming standard, with features like home automation, security systems, and energy management. Smart homes offer convenience, security, and energy savings.</p>
      
      <h2>Sustainable Communities</h2>
      <p>Developments are focusing on creating communities with shared amenities and green spaces that promote a better quality of life. These communities are designed to be walkable and sustainable.</p>
    `,
    image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    author: "David Munene",
    authorImage: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80",
    authorBio: "David Munene has extensive experience in residential construction and has worked on projects ranging from affordable housing to luxury estates.",
    date: "March 12, 2026",
    readTime: "6 min read",
    category: "Residential",
    tags: ["Housing", "Innovation", "Technology"]
  },
  {
    id: "4",
    slug: "commercial-building-construction-guide-2026",
    title: "Commercial Building Construction: A Comprehensive Guide",
    excerpt: "Everything you need to know about commercial building construction from planning to completion.",
    content: `
      <p>Commercial building construction requires careful planning and execution. This guide covers the essential steps from concept to completion.</p>
      
      <h2>Planning and Design</h2>
      <p>Proper planning is crucial for commercial projects. This includes site assessment, regulatory compliance, and architectural design. Engaging experienced professionals early in the process is essential.</p>
      
      <h2>Construction Management</h2>
      <p>Effective project management ensures timely completion and quality control throughout the construction process. Modern project management tools and methodologies are transforming how commercial projects are delivered.</p>
      
      <h2>Post-Construction</h2>
      <p>After completion, proper handover and maintenance planning ensures the building's longevity and performance. Regular maintenance and inspections are crucial for commercial buildings.</p>
    `,
    image: "https://images.unsplash.com/photo-1486718448742-163732cd1544?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    author: "David Munene",
    authorBio: "David Munene has managed numerous commercial construction projects across Kenya, delivering high-quality results on time and within budget.",
    date: "April 5, 2026",
    readTime: "7 min read",
    category: "Commercial",
    tags: ["Commercial", "Construction", "Guide"]
  },
  {
    id: "5",
    slug: "sustainable-construction-materials-2026",
    title: "Sustainable Construction Materials for Modern Buildings",
    excerpt: "Learn about the latest sustainable construction materials that are reshaping the building industry.",
    content: `
      <p>Modern construction is embracing sustainability through innovative materials that reduce environmental impact. From recycled materials to locally sourced alternatives, the options are expanding.</p>
      
      <h2>Recycled Materials</h2>
      <p>Using recycled materials in construction reduces waste and promotes circular economy principles. Recycled plastic, rubber, and metal are being used in innovative ways.</p>
      
      <h2>Local Materials</h2>
      <p>Locally sourced materials reduce transportation costs and support local economies while maintaining quality. Materials like locally quarried stone and timber are gaining popularity.</p>
      
      <h2>Innovative Solutions</h2>
      <p>New materials like eco-friendly concrete and sustainable wood alternatives are becoming available. These materials offer comparable performance with reduced environmental impact.</p>
    `,
    image: "https://images.unsplash.com/photo-1577097017403-0a15fe82ab81?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    author: "David Munene",
    authorBio: "David Munene is an advocate for sustainable construction and has researched extensively on eco-friendly building materials.",
    date: "May 20, 2026",
    readTime: "4 min read",
    category: "Sustainability",
    tags: ["Sustainability", "Materials", "Environment"]
  },
  {
    id: "6",
    slug: "construction-safety-best-practices-2026",
    title: "Construction Safety: Best Practices for 2026",
    excerpt: "Stay safe on construction sites with these essential safety practices and protocols.",
    content: `
      <p>Safety is paramount in construction. Here are the best practices for maintaining a safe construction site and protecting workers.</p>
      
      <h2>Personal Protective Equipment</h2>
      <p>Proper PPE is essential for all workers on site, including helmets, gloves, and safety boots. Regular inspections and proper training ensure compliance with safety standards.</p>
      
      <h2>Site Safety Protocols</h2>
      <p>Clear safety protocols and regular training ensure everyone knows how to stay safe. Daily safety briefings and regular drills are essential practices.</p>
      
      <h2>Emergency Preparedness</h2>
      <p>Preparedness for emergencies saves lives. Regular drills, first aid training, and clear emergency procedures are essential for every construction site.</p>
    `,
    image: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    author: "David Munene",
    authorBio: "David Munene is a certified safety professional with extensive experience in construction site safety management.",
    date: "June 10, 2026",
    readTime: "5 min read",
    category: "Safety",
    tags: ["Safety", "Construction", "Best Practices"]
  },
  {
    id: "7",
    slug: "affordable-housing-solutions-kenya-2026",
    title: "Affordable Housing Solutions: Kenya's Path Forward",
    excerpt: "Exploring innovative approaches to affordable housing that are making homeownership accessible to more Kenyans.",
    content: `
      <p>Affordable housing remains a critical challenge in Kenya. However, innovative solutions are emerging to address this issue and make homeownership more accessible.</p>
      
      <h2>Government Initiatives</h2>
      <p>The Kenyan government has launched several programs to increase affordable housing supply across the country. These initiatives include tax incentives, land allocation, and partnerships with developers.</p>
      
      <h2>Public-Private Partnerships</h2>
      <p>Collaborations between government and private sector are accelerating housing delivery. These partnerships leverage private sector efficiency and government resources.</p>
      
      <h2>Innovative Financing</h2>
      <p>New financing models are making it easier for Kenyans to own homes through flexible payment plans and affordable mortgages. These models are critical for increasing homeownership rates.</p>
    `,
    image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    author: "David Munene",
    authorBio: "David Munene has worked on numerous affordable housing projects and is passionate about increasing homeownership in Kenya.",
    date: "July 8, 2026",
    readTime: "6 min read",
    category: "Residential",
    tags: ["Housing", "Affordable", "Kenya"]
  },
  {
    id: "8",
    slug: "smart-cities-infrastructure-kenya-2026",
    title: "Smart Cities: Kenya's Infrastructure Revolution",
    excerpt: "How technology is transforming urban infrastructure and creating smarter, more sustainable cities across Kenya.",
    content: `
      <p>Kenya is embracing the smart city concept, integrating technology into urban infrastructure to improve quality of life and create more sustainable cities.</p>
      
      <h2>Digital Infrastructure</h2>
      <p>High-speed internet and digital services are becoming essential components of modern city planning. Smart cities leverage technology to improve service delivery and citizen engagement.</p>
      
      <h2>Sustainable Transport</h2>
      <p>Innovative transport solutions are reducing congestion and pollution in major cities. Smart traffic management systems and sustainable transport options are being deployed.</p>
      
      <h2>Smart Utilities</h2>
      <p>IoT-enabled utilities are improving efficiency in water, energy, and waste management. These technologies reduce costs and improve service delivery to citizens.</p>
    `,
    image: "https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    author: "David Munene",
    authorBio: "David Munene is a smart cities advocate and has consulted on urban infrastructure projects across Kenya.",
    date: "August 2, 2026",
    readTime: "5 min read",
    category: "Innovation",
    tags: ["Smart Cities", "Technology", "Infrastructure"]
  }
];

export const BLOG_CATEGORIES = ["All", "Construction", "Sustainability", "Residential", "Commercial", "Safety", "Innovation"];

export const getRelatedPosts = (currentPost: BlogPost, limit: number = 3): BlogPost[] => {
  return BLOG_POSTS
    .filter((post) => post.id !== currentPost.id && post.category === currentPost.category)
    .slice(0, limit);
};

export const getPostBySlug = (slug: string): BlogPost | undefined => {
  return BLOG_POSTS.find((post) => post.slug === slug);
};