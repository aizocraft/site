// 📁 app/projects/page.tsx
import ProjectsPageContent from './ProjectsPageContent';
import { makeSeo } from '../seo';

export const metadata = makeSeo({
  title: 'Our Projects | SunSea Electrical',
  description:
    'Explore SunSea Electrical projects across Kenya, including industrial power systems, solar installations, generator systems, electrical installations, and integrated energy solutions.',
  canonicalPath: '/projects',
  keywords: [
    'SunSea Electrical projects',
    'electrical installation projects Kenya',
    'solar installation Kenya projects',
    'industrial power systems Kenya',
    'generator systems projects',
    'electrical engineering projects Kenya',
    'renewable energy projects Kenya',
    'electrical projects Nairobi',
    'electrical projects Embu',
    'electrical projects Meru',
    'electrical projects Kenya',
  ],
  openGraph: {
    title: 'SunSea Electrical Projects',
    description:
      'View our completed and ongoing electrical, solar, and power infrastructure projects across Kenya.',
    url: 'https://sunseaelectrical.vercel.app/projects',
    images: [{ 
      url: '/poster.png', 
      width: 1200, 
      height: 630, 
      alt: 'SunSea Electrical Projects' 
    }],
  },
  twitter: {
    title: 'SunSea Electrical Projects',
    description:
      'See our electrical, solar, and power infrastructure projects across Kenya delivered by SunSea Electrical.',
    images: ['/poster.png'],
  },
});

export default function ProjectsPage() {
  return <ProjectsPageContent />;
}