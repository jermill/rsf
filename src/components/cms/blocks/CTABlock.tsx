import React from 'react';
import { Link } from 'react-router-dom';
import { CTABlockContent } from '../../../types/cms';
import Button from '../../ui/Button';
import Container from '../../ui/Container';
import Section from '../../ui/Section';

interface CTABlockProps {
  content: CTABlockContent;
}

const CTABlock: React.FC<CTABlockProps> = ({ content }) => {
  return (
    <Section
      className="py-20"
      style={{
        backgroundColor: content.backgroundColor || '#10b981',
      }}
    >
      <Container>
        <div className="text-center text-white">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">{content.heading}</h2>
          {content.subheading && (
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              {content.subheading}
            </p>
          )}
          {content.ctaText && content.ctaLink && (
            <Link to={content.ctaLink}>
              <Button
                size="lg"
                className="bg-white text-gray-900 hover:bg-gray-100 text-lg px-8 py-4"
              >
                {content.ctaText}
              </Button>
            </Link>
          )}
        </div>
      </Container>
    </Section>
  );
};

export default CTABlock;

