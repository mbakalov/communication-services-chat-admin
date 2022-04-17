import React from 'react';
import gitHubLogo from '../assets/GitHub-Mark-Light-32px.png';

import { mergeStyles } from '@fluentui/react';

export const Header = () => {
  const headerStyles = mergeStyles({
    height: '42px',
    background: 'black',
    paddingLeft: '10px',
    paddingTop: '8px'
  });

  return (
    <div className={headerStyles}>
      <a href='https://github.com/mbakalov/communication-services-chat-admin' target='_blank' rel='noreferrer'>
        <img src={gitHubLogo} alt='GitHub' />
      </a>
    </div>
  );
}