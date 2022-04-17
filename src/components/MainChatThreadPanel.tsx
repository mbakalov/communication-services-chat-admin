import { ChatClient } from '@azure/communication-chat';
import { AzureCommunicationTokenCredential } from '@azure/communication-common';

import React, { useState, useEffect } from 'react';
import { CommandBar, ICommandBarItemProps } from '@fluentui/react/lib/CommandBar';
import { ChatThreadList } from './ChatThreadList';

export interface MainChatThreadPanelProps {
  endpointUrl: string,
  token: string
}

export const MainChatThreadPanel = (props: MainChatThreadPanelProps) => {
  const { endpointUrl, token } = props;

  const [chatClient, setChatClient] = useState<ChatClient>();

  useEffect(() => {
    if (token) {
      const tokenCredential = new AzureCommunicationTokenCredential(token);
      const cc = new ChatClient(endpointUrl, tokenCredential);
      setChatClient(cc);
    }
  }, [endpointUrl, token]);

  const onLoadChatThreadsClicked = async () => {
    console.log('onLoadChatThreadsClicked');
  }

  return (
    <div>
      <CommandBar
        items={_items}
      />
      <ChatThreadList
        onLoadChatThreadsClicked={onLoadChatThreadsClicked}
        />
    </div>
  );
}

const _items: ICommandBarItemProps[] = [
  {
    key: 'newItem',
    text: 'New',
    iconProps: { iconName: 'Add' },
  },
  {
    key: 'edit',
    text: 'Edit',
    iconProps: { iconName: 'Edit' },
  },
  {
    key: 'delete',
    text: 'Delete',
    iconProps: { iconName: 'Delete' },
  },
];