import { ChatThreadItem } from '@azure/communication-chat';

import React from 'react';
import { mergeStyles } from '@fluentui/react';
import { PrimaryButton } from '@fluentui/react/lib/Button';

import { ChatThread } from './ChatThread'

export interface ChatThreadListProps {
  enabled: boolean,
  chatThreads?: ChatThreadItem[],
  onLoadChatThreadsClicked: () => Promise<void>
}

export const ChatThreadList = (props: ChatThreadListProps) => {
  const { enabled, chatThreads, onLoadChatThreadsClicked } = props;

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

  if (showLoadButton) {
    return (
      <div className={mergeStyles(containerStyles)}>
        <PrimaryButton
          text="Load Chat Threads"
          disabled={!enabled}
          onClick={onLoadChatThreadsClicked}
          styles={buttonStyles}
        /> 
      </div>
    );
  }

  if (chatThreads.length === 0) {
    return <div>There are no chat threads for this user. Use the 'New' button to create a thread.</div>;
  }

  return (
    <div>
      <ul>
        {chatThreads.map(thread =>
          <li key={thread.id}>
            <ChatThread thread={thread} />
          </li>
        )}
      </ul>
    </div>
  );
}