import React from 'react';
import { Download } from 'lucide-react';

interface ShimmerDownloadLinkProps {
  href: string;
  text?: string;
  download?: boolean;
  className?: string;
}

// Small, branded download link with an animated shimmering border
export const ShimmerDownloadLink: React.FC<ShimmerDownloadLinkProps> = ({
  href,
  text = 'Download plan details',
  download = true,
  className = '',
}) => {
  return (
    <a
      href={href}
      download={download}
      className={`inline-flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs md:text-sm font-medium
        bg-khambi-accent text-black border border-khambi-gold shadow-sm
        hover:bg-khambi-gold focus:outline-none focus-visible:ring-2 focus-visible:ring-khambi-accent ${className}`}
    >
      <Download className="h-3.5 w-3.5 md:h-4 md:w-4" />
      <span>{text}</span>
    </a>
  );
};

export default ShimmerDownloadLink;
