import { ChatThreadItem } from '@azure/communication-chat';

import React from 'react';

export interface ChatThreadProps {
  thread: ChatThreadItem
}

export const ChatThread = (props: ChatThreadProps) => {
  const { thread } = props;
  return (
    <div>
      {thread.id}
    </div>
  );
}