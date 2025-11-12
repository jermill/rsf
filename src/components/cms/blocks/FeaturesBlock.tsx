import React from 'react';
import { FeaturesBlockContent } from '../../../types/cms';
import Container from '../../ui/Container';
import Section from '../../ui/Section';
import * as Icons from 'lucide-react';

interface FeaturesBlockProps {
  content: FeaturesBlockContent;
}

const FeaturesBlock: React.FC<FeaturesBlockProps> = ({ content }) => {
  const getIcon = (iconName: string) => {
    const Icon = (Icons as any)[iconName];
    return Icon ? <Icon className="h-8 w-8" /> : null;
  };

  return (
    <Section>
      <Container>
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            {content.heading}
          </h2>
          {content.subheading && (
            <p className="text-xl text-gray-600 dark:text-gray-400">
              {content.subheading}
            </p>
          )}
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {content.features.map((feature, index) => (
            <div
              key={index}
              className="text-center p-6 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full mb-4 text-green-600 dark:text-green-400">
                {getIcon(feature.icon)}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">{feature.description}</p>
            </div>
          ))}
        </div>
      </Container>
    </Section>
  );
};

export default FeaturesBlock;

