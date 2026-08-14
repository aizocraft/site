'use client';

import { useState, useEffect, type ReactNode } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import Hero from './Hero';

// Types
interface Project {
  id: number;
  title: string;
  location: string;
  category: string;
  description: string;
  images: string[];
}

interface MasonryItem {
  id: string;
  img: string;
  project: Project;
  imageIndex: number;
  precalculatedHeight: number;
}

// ============= PROJECT DATA =============
const PROJECTS: Project[] = [
  {
    id: 1,
    title: 'Solar Installation Showcase',
    location: 'Various Locations',
    category: 'Solar Installation',
    description: 'High-efficiency solar panel installations for residential and commercial properties',
    images: [
      '/images/solar-image1.jpg',
      '/images/solar-image2.jpg',
      '/images/solar-image3.jpg',
      '/images/solar-image4.jpg',
      '/images/solar-4.jpg',
      '/images/solar.jpg',
    ],
  },
  {
    id: 2,
    title: 'Borehole Drilling Showcase',
    location: 'Various Locations',
    category: 'Borehole Drilling',
    description: 'Professional borehole drilling services for clean water access',
    images: [
      '/images/borehole_drilling.jpeg',
      '/images/borehole-drilling1.jpg',
      '/images/borehole-drilling2.jpg',
      '/images/borehole-drilling3.jpg',
      '/images/borehole-drilling4.jpg',
      '/images/borehole-drilling5.jpg',
      '/images/borehole.jpg',
    ],
  },
  {
    id: 3,
    title: 'Water Tower Construction Showcase',
    location: 'Various Locations',
    category: 'Water Tower',
    description: 'Elevated water storage towers for reliable water distribution',
    images: [
      '/images/watertower1.jpeg',
      '/images/water_tower1.jpeg',
      '/images/water_tower2.jpeg',
      '/images/water_tower3.jpeg',
      '/images/water_tower4.jpeg',
      '/images/water_tower5.jpeg',
      '/images/water_tower6.jpeg',
      '/images/water_tower7.jpeg',
      '/images/water_tower8.jpeg',
      '/images/tower-construction1.jpg',
      '/images/tower-construction2.jpg',
      '/images/watertower.jpg',
    ],
  },
  {
    id: 4,
    title: 'Combined Solutions Showcase',
    location: 'Various Locations',
    category: 'Combined Solution',
    description: 'Integrated water and solar energy solutions for maximum efficiency',
    images: [
      '/images/Combined-1.jpg',
      '/images/combined-2.jpg',
      '/images/combined-3.jpg',
    ],
  },
];

// ============= MASONRY GRID =============
const Masonry = ({
  items,
  onItemClick,
  renderItem,
  gap = 16,
}: {
  items: MasonryItem[];
  onItemClick?: (item: MasonryItem) => void;
  renderItem: (item: MasonryItem) => ReactNode;
  gap?: number;
}) => {
  const [columns, setColumns] = useState(3);
  const [columnItems, setColumnItems] = useState<MasonryItem[][]>([]);
  const [visibleItems, setVisibleItems] = useState<MasonryItem[]>([]);

  // Responsive column calculation
  useEffect(() => {
    const updateColumns = () => {
      const width = window.innerWidth;
      if (width < 640) setColumns(1);
      else if (width < 768) setColumns(2);
      else if (width < 1024) setColumns(2);
      else if (width < 1280) setColumns(3);
      else setColumns(4);
    };

    updateColumns();
    window.addEventListener('resize', updateColumns);
    return () => window.removeEventListener('resize', updateColumns);
  }, []);

  // Staggered animation
  useEffect(() => {
    setVisibleItems([]);
    const timeouts: NodeJS.Timeout[] = [];

    items.forEach((item, index) => {
      const timeout = setTimeout(() => {
        setVisibleItems((prev) => [...prev, item]);
      }, index * 50);
      timeouts.push(timeout);
    });

    return () => timeouts.forEach((t) => clearTimeout(t));
  }, [items]);

  // Distribute items to columns
  useEffect(() => {
    if (visibleItems.length === 0) return;

    const cols: MasonryItem[][] = Array.from({ length: columns }, () => []);
    const columnHeights: number[] = new Array(columns).fill(0);

    const itemsWithHeights = visibleItems.map((item) => ({
      item,
      height: item.precalculatedHeight || 300 + Math.random() * 200,
    }));

    itemsWithHeights.forEach(({ item, height }) => {
      const shortestColumn = columnHeights.indexOf(Math.min(...columnHeights));
      cols[shortestColumn].push(item);
      columnHeights[shortestColumn] += height;
    });

    setColumnItems(cols);
  }, [visibleItems, columns]);

  return (
    <div
      className="w-full"
      style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: `${gap}px`,
      }}
    >
      {columnItems.map((column, colIndex) => (
        <div
          key={colIndex}
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            gap: `${gap}px`,
          }}
        >
          {column.map((item, itemIndex) => (
            <div
              key={`${item.id}-${colIndex}-${itemIndex}`}
              onClick={() => onItemClick?.(item)}
              className="cursor-pointer transform transition-all duration-500 hover:scale-[0.98] animate-fadeInUp"
              style={{
                animationDelay: `${itemIndex * 50}ms`,
              }}
            >
              {renderItem(item)}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

// ============= MAIN COMPONENT =============
export default function ProjectsPageContent() {
  const [selectedImage, setSelectedImage] = useState<{ project: Project; imageIndex: number } | null>(null);
  const [filteredItems, setFilteredItems] = useState<MasonryItem[]>([]);

  // Build all items (no filtering)
  useEffect(() => {
    const items = PROJECTS.flatMap((project) =>
      project.images.map((image: string, imageIndex: number) => ({
        id: `${project.id}-${imageIndex}`,
        img: image,
        project,
        imageIndex,
        precalculatedHeight: Math.floor(Math.random() * 200) + 320,
      }))
    );

    setFilteredItems(items);
  }, []);

  // Handle keyboard navigation for modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedImage) return;
      
      if (e.key === 'Escape') {
        setSelectedImage(null);
      } else if (e.key === 'ArrowLeft' && selectedImage.imageIndex > 0) {
        setSelectedImage({
          project: selectedImage.project,
          imageIndex: selectedImage.imageIndex - 1,
        });
      } else if (e.key === 'ArrowRight' && selectedImage.imageIndex < selectedImage.project.images.length - 1) {
        setSelectedImage({
          project: selectedImage.project,
          imageIndex: selectedImage.imageIndex + 1,
        });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedImage]);

  const handleMasonryClick = (item: MasonryItem) => {
    setSelectedImage({ project: item.project, imageIndex: item.imageIndex });
  };

  return (
    <div className="min-h-screen bg-[hsl(var(--background))] dark:bg-[hsl(var(--background))]">
      <Hero />

      {/* Gallery Section */}
      <section className="py-8 sm:py-12 md:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {filteredItems.length > 0 ? (
            <Masonry
              items={filteredItems}
              onItemClick={handleMasonryClick}
              gap={16}
              renderItem={(item) => (
                <div className="relative group cursor-pointer overflow-hidden rounded-lg sm:rounded-xl bg-white dark:bg-gray-800 shadow-md hover:shadow-xl transition-all duration-500">
                  {/* Simple Image */}
                  <div className="relative overflow-hidden">
                    <img
                      src={item.img}
                      alt={`${item.project.title} - ${item.imageIndex + 1}`}
                      className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
                      loading="lazy"
                    />
                  </div>
                </div>
              )}
            />
          ) : (
            // Empty State
            <div className="text-center py-16 sm:py-24">
              <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-600 dark:text-gray-400 mb-3 sm:mb-4">
                No Projects Found
              </h3>
              <p className="text-gray-500 dark:text-gray-500 text-sm sm:text-base md:text-lg max-w-md mx-auto mb-6 sm:mb-8 px-4">
                We're constantly expanding our portfolio. Check back soon!
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Image Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-3 sm:p-4 animate-fadeIn"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-[90vw] sm:max-w-5xl max-h-[90vh]">
            <img
              src={selectedImage.project.images[selectedImage.imageIndex]}
              alt={selectedImage.project.title}
              className="max-w-full max-h-[80vh] object-contain rounded-xl sm:rounded-2xl shadow-2xl"
            />

            {/* Close Button */}
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute -top-12 sm:-top-16 right-0 text-white hover:text-gray-300 transition-colors bg-black/50 backdrop-blur-sm rounded-full p-2 sm:p-3 hover:bg-black/70"
            >
              <X className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8" />
            </button>

            {/* Navigation Buttons */}
            {selectedImage.imageIndex > 0 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedImage({
                    project: selectedImage.project,
                    imageIndex: selectedImage.imageIndex - 1,
                  });
                }}
                className="absolute left-3 sm:left-6 top-1/2 transform -translate-y-1/2 bg-black/50 backdrop-blur-sm rounded-full p-2 sm:p-3 hover:bg-black/70 transition-all"
              >
                <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </button>
            )}

            {selectedImage.imageIndex < selectedImage.project.images.length - 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedImage({
                    project: selectedImage.project,
                    imageIndex: selectedImage.imageIndex + 1,
                  });
                }}
                className="absolute right-3 sm:right-6 top-1/2 transform -translate-y-1/2 bg-black/50 backdrop-blur-sm rounded-full p-2 sm:p-3 hover:bg-black/70 transition-all"
              >
                <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        .animate-fadeInUp {
          animation: fadeInUp 0.8s ease-out;
        }

        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
