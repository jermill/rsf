import React from 'react';
import { TestimonialsBlockContent } from '../../../types/cms';
import Container from '../../ui/Container';
import Section from '../../ui/Section';
import TestimonialsSection from '../../sections/TestimonialsSection';

interface TestimonialsBlockProps {
  content: TestimonialsBlockContent;
}

const TestimonialsBlock: React.FC<TestimonialsBlockProps> = ({ content }) => {
  // This block uses the existing TestimonialsSection component
  // The content heading/subheading can be passed as props if needed
  return <TestimonialsSection />;
};

export default TestimonialsBlock;

