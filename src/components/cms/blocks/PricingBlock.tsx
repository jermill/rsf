import React from 'react';
import { Container } from '../../ui/Container';
import { Section } from '../../ui/Section';
import PricingSection from '../../sections/PricingSection';

interface PricingBlockProps {
  content: any;
}

const PricingBlock: React.FC<PricingBlockProps> = ({ content }) => {
  // This block uses the existing PricingSection component
  return <PricingSection />;
};

export default PricingBlock;

