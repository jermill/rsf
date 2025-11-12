import React from 'react';
import { GalleryBlockContent } from '../../../types/cms';
import Container from '../../ui/Container';
import Section from '../../ui/Section';
import GallerySection from '../../sections/GallerySection';

interface GalleryBlockProps {
  content: GalleryBlockContent;
}

const GalleryBlock: React.FC<GalleryBlockProps> = ({ content }) => {
  // This block uses the existing GallerySection component
  return <GallerySection />;
};

export default GalleryBlock;

