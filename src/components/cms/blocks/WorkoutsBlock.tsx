import React from 'react';
import { Container } from '../../ui/Container';
import { Section } from '../../ui/Section';
import FeaturedWorkoutsSection from '../../sections/FeaturedWorkoutsSection';

interface WorkoutsBlockProps {
  content: any;
}

const WorkoutsBlock: React.FC<WorkoutsBlockProps> = ({ content }) => {
  // This block uses the existing FeaturedWorkoutsSection component
  return <FeaturedWorkoutsSection />;
};

export default WorkoutsBlock;

