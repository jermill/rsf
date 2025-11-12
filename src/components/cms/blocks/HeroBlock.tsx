import React from 'react';
import { Link } from 'react-router-dom';
import { HeroBlockContent } from '../../../types/cms';
import { Button } from '../../ui/Button';
import { Container } from '../../ui/Container';

interface HeroBlockProps {
  content: HeroBlockContent;
}

const HeroBlock: React.FC<HeroBlockProps> = ({ content }) => {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      {content.backgroundImage && (
        <>
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${content.backgroundImage})` }}
          />
          <div
            className="absolute inset-0 bg-black"
            style={{ opacity: content.overlayOpacity || 0.4 }}
          />
        </>
      )}

      {/* Content */}
      <Container className="relative z-10 text-center">
        <h1
          className="text-5xl md:text-7xl font-bold text-white mb-6"
          dangerouslySetInnerHTML={{ __html: content.heading }}
        />
        <p className="text-xl md:text-2xl text-gray-200 mb-8 max-w-3xl mx-auto">
          {content.subheading}
        </p>
        {content.ctaText && content.ctaLink && (
          <Link to={content.ctaLink}>
            <Button size="lg" className="text-lg px-8 py-4">
              {content.ctaText}
            </Button>
          </Link>
        )}
      </Container>
    </div>
  );
};

export default HeroBlock;

