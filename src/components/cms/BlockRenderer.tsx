import React from 'react';
import { ContentBlock } from '../../types/cms';
import HeroBlock from './blocks/HeroBlock';
import FeaturesBlock from './blocks/FeaturesBlock';
import TestimonialsBlock from './blocks/TestimonialsBlock';
import CTABlock from './blocks/CTABlock';
import GalleryBlock from './blocks/GalleryBlock';
import TextBlock from './blocks/TextBlock';
import PricingBlock from './blocks/PricingBlock';
import WorkoutsBlock from './blocks/WorkoutsBlock';

interface BlockRendererProps {
  blocks: ContentBlock[];
}

const BlockRenderer: React.FC<BlockRendererProps> = ({ blocks }) => {
  const renderBlock = (block: ContentBlock) => {
    if (!block.is_visible) return null;

    switch (block.block_type) {
      case 'hero':
        return <HeroBlock key={block.id} content={block.content} />;
      case 'features':
        return <FeaturesBlock key={block.id} content={block.content} />;
      case 'testimonials':
        return <TestimonialsBlock key={block.id} content={block.content} />;
      case 'cta':
        return <CTABlock key={block.id} content={block.content} />;
      case 'gallery':
        return <GalleryBlock key={block.id} content={block.content} />;
      case 'text':
        return <TextBlock key={block.id} content={block.content} />;
      case 'pricing':
        return <PricingBlock key={block.id} content={block.content} />;
      case 'workouts':
        return <WorkoutsBlock key={block.id} content={block.content} />;
      default:
        return null;
    }
  };

  return (
    <div className="cms-content">
      {blocks.map((block) => renderBlock(block))}
    </div>
  );
};

export default BlockRenderer;

