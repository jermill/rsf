import React from 'react';
import { Facebook, Instagram, Twitter, Youtube } from 'lucide-react';
import { Container } from '../ui/Container';

interface FooterProps {
  className?: string;
}

const Footer: React.FC<FooterProps> = ({ className = '' }) => {
  return (
    <footer className={`bg-gray-900 dark:bg-black text-gray-300 py-6 border-t border-gray-800 ${className}`}>
      <Container>
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
              <img 
                src="https://github.com/QRUMN/RSFIMG/blob/main/RSF_IconOnly_FullColor%20(1).png?raw=true"
                alt="RSF Logo"
              className="w-8 h-8 object-contain"
              />
            <span className="font-display font-bold text-lg text-white">Ready Set Fit</span>
          </div>
          
          {/* Quick Links */}
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <FooterLink href="/services">Services</FooterLink>
            <FooterLink href="/pricing">Membership</FooterLink>
            <FooterLink href="/community">Community</FooterLink>
              <FooterLink href="#">Contact</FooterLink>
          </div>
          
          {/* Social Icons */}
          <div className="flex gap-3">
            <SocialIcon icon={<Facebook className="w-4 h-4" />} />
            <SocialIcon icon={<Instagram className="w-4 h-4" />} />
            <SocialIcon icon={<Twitter className="w-4 h-4" />} />
            <SocialIcon icon={<Youtube className="w-4 h-4" />} />
          </div>
        </div>
        
        {/* Copyright */}
        <div className="text-center mt-4 pt-4 border-t border-gray-800">
          <p className="text-gray-500 text-xs">
            &copy; {new Date().getFullYear()} Ready Set Fit. All rights reserved.
          </p>
        </div>
      </Container>
    </footer>
  );
};

interface SocialIconProps {
  icon: React.ReactNode;
}

const SocialIcon: React.FC<SocialIconProps> = ({ icon }) => {
  return (
    <a 
      href="#" 
      className="w-8 h-8 rounded-full bg-gray-800 dark:bg-gray-700 flex items-center justify-center text-gray-400 hover:bg-primary hover:text-black transition-colors"
    >
      {icon}
    </a>
  );
};

interface FooterLinkProps {
  href: string;
  children: React.ReactNode;
}

const FooterLink: React.FC<FooterLinkProps> = ({ href, children }) => {
  return (
      <a 
        href={href} 
      className="text-gray-400 hover:text-primary transition-colors"
      >
        {children}
      </a>
  );
};

export { Footer };