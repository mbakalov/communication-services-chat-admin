import { ChatClient, ChatThreadItem } from '@azure/communication-chat';
import { AzureCommunicationTokenCredential } from '@azure/communication-common';

import React, { useState, useEffect } from 'react';
import { CommandBar, ICommandBarItemProps } from '@fluentui/react/lib/CommandBar';
import { ChatThreadList } from './ChatThreadList';

// Limit number of threads to load and show on screen
const MAX_CHAT_THREADS = 20;

export interface MainChatThreadPanelProps {
  endpointUrl: string,
  userId: string,
  token: string
}

export const MainChatThreadPanel = (props: MainChatThreadPanelProps) => {
  const { endpointUrl, userId, token } = props;

  const [chatClient, setChatClient] = useState<ChatClient>();
  const [chatThreads, setChatThreads] = useState<ChatThreadItem[]>();

  useEffect(() => {
    if (token) {
      const tokenCredential = new AzureCommunicationTokenCredential(token);
      const cc = new ChatClient(endpointUrl, tokenCredential);
      setChatClient(cc);
    }
  }, [endpointUrl, token]);

  

  const onLoadChatThreadsClicked = async () => {
    if (chatClient) {
      let loadedThreads: ChatThreadItem[] = [];

      const threads = chatClient?.listChatThreads();
      let i = 0;
      for await (const thread of threads) {
        if (i === MAX_CHAT_THREADS) {
          break;
        }

        loadedThreads.push(thread);
        i++;
      }

      setChatThreads(loadedThreads);
    }
  }

  const addNewThreadClicked = (ev?: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>) => {
    const addNewThread = async () => {
      if (chatClient) {
        const createChatThreadRequest = {
          topic: "Hello, World!"
        };
        const createChatThreadOptions = {
          participants: [
            {
              id: { communicationUserId: userId },
              displayName: 'Thread Creator'
            }
          ]
        };

        const createChatThreadResult = await chatClient.createChatThread(
          createChatThreadRequest,
          createChatThreadOptions
        );
        
        if (createChatThreadResult.chatThread) {
          setChatThreads(chatThreads?.concat(createChatThreadResult.chatThread))
        }
      }
    }
    
    addNewThread();
  }

  const _items: ICommandBarItemProps[] = [
    {
      key: 'newItem',
      text: 'New chat thread',
      iconProps: { iconName: 'Add' },
      onClick: addNewThreadClicked,
    },
    {
      key: 'edit',
      text: 'Edit (TBD)',
      iconProps: { iconName: 'Edit' },
      disabled: true
    },
    {
      key: 'delete',
      text: 'Delete (TBD)',
      iconProps: { iconName: 'Delete' },
      disabled: true
    },
  ];

  return (
    <div>
      <CommandBar
        items={_items}
      />
      <ChatThreadList
        enabled={token !== ''}
        chatThreads={chatThreads}
        onLoadChatThreadsClicked={onLoadChatThreadsClicked}
        />
    </div>
  );
}



