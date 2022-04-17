import { ChatThreadItem } from '@azure/communication-chat';

import React from 'react';
import { mergeStyles } from '@fluentui/react';
import { PrimaryButton } from '@fluentui/react/lib/Button';

export interface ChatThreadListProps {
  chatThreads?: ChatThreadItem[],
  onLoadChatThreadsClicked: () => Promise<void>
}

export const ChatThreadList = (props: ChatThreadListProps) => {
  const { chatThreads, onLoadChatThreadsClicked } = props;

  const buttonStyles = {
    root: {
      width: '200px'
    }
  }

  const containerStyles = {
    height: '60vmin',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  }

  const showLoadButton = !chatThreads;

  return (showLoadButton ?
    <div className={mergeStyles(containerStyles)}>
        <PrimaryButton
          text="Load Chat Threads"
          onClick={onLoadChatThreadsClicked}
          styles={buttonStyles}
        /> 
    </div> : <></>
  );
}