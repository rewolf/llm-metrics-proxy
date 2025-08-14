import React from 'react';
import { CreatorLogoIcon } from '../assets/icons';

export const CreatorCredit: React.FC = () => {
  return (
    <div className="creator-credit">
      <CreatorLogoIcon className="creator-icon" />
      <span className="creator-text">
        Built for plebs by{' '}
        <a 
          href="https://njump.me/npub1qj8vk9xavpu5ylgwy58v8np6yr4jhd0new9encly6wuzglpg43uqyks7e6" 
          target="_blank" 
          rel="noopener noreferrer"
          className="creator-link"
        >
          rewolf
        </a>
      </span>
    </div>
  );
};
