import React from 'react';
import { TextBlockContent } from '../../../types/cms';
import { Container } from '../../ui/Container';
import { Section } from '../../ui/Section';

interface TextBlockProps {
  content: TextBlockContent;
}

const TextBlock: React.FC<TextBlockProps> = ({ content }) => {
  const alignmentClasses = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  };

  return (
    <Section>
      <Container>
        <div className={`prose dark:prose-invert max-w-4xl mx-auto ${alignmentClasses[content.alignment || 'left']}`}>
          {content.heading && (
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
              {content.heading}
            </h2>
          )}
          <div
            className="text-lg text-gray-600 dark:text-gray-400 whitespace-pre-wrap"
            dangerouslySetInnerHTML={{ __html: content.content }}
          />
        </div>
      </Container>
    </Section>
  );
};

export default TextBlock;

